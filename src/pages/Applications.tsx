// src/pages/Applications.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Table,
  List,
  Button,
  Input,
  Space,
  Tag,
  Modal,
  message,
  Grid,
} from 'antd';
import { SearchOutlined, PlusOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import type { TableProps } from 'antd';
import type { Application } from '../types/application';
import { applicationService } from '../services/api';
import ApplicationForm from '../components/ApplicationForm';
import { formatDate } from '../utils/helpers';

const { useBreakpoint } = Grid;

const statusColors: Record<string, string> = {
  saved: 'default',
  applied: 'blue',
  phone_screen: 'cyan',
  interview: 'orange',
  assessment: 'purple',
  final_round: 'geekblue',
  offer: 'green',
  negotiating: 'gold',
  accepted: 'success',
  rejected: 'red',
  declined: 'volcano',
};

const Applications: React.FC = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const screens = useBreakpoint();
  const isMobile = !screens.md;

  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [formVisible, setFormVisible] = useState(false);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const data = await applicationService.getAll();
      setApplications(data);
    } catch (err) {
      message.error(t('common.error'));
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (
    values: Omit<Application, 'id' | 'createdAt' | 'updatedAt'>
  ) => {
    setCreating(true);
    try {
      const newApp = await applicationService.create(values);
      setApplications([newApp, ...applications]);
      setFormVisible(false);
      message.success(t('common.success'));
    } catch (err) {
      message.error(t('common.error'));
      console.error(err);
    } finally {
      setCreating(false);
    }
  };

  const filtered = applications.filter(app =>
    [app.company, app.position]
      .join(' ')
      .toLowerCase()
      .includes(searchText.toLowerCase())
  );

  const columns: TableProps<Application>['columns'] = [
    {
      title: t('applications.company'),
      dataIndex: 'company',
      key: 'company',
      ellipsis: true,
      sorter: (a, b) => a.company.localeCompare(b.company),
    },
    {
      title: t('applications.position'),
      dataIndex: 'position',
      key: 'position',
      ellipsis: true,
      sorter: (a, b) => a.position.localeCompare(b.position),
    },
    {
      title: t('applications.dateApplied'),
      dataIndex: 'dateApplied',
      key: 'dateApplied',
      ellipsis: true,
      render: date => formatDate(date, i18n.language),
      sorter: (a, b) =>
        new Date(a.dateApplied).getTime() -
        new Date(b.dateApplied).getTime(),
      responsive: ['sm'],
    },
    {
      title: t('applications.location'),
      dataIndex: 'location',
      key: 'location',
      ellipsis: true,
      responsive: ['md'],
    },
    {
      title: t('applications.status'),
      dataIndex: 'status',
      key: 'status',
      render: status => (
        <Tag color={statusColors[status]}>
          {t(`status.${status}`)}
        </Tag>
      ),
      responsive: ['sm'],
      filters: Object.keys(statusColors).map(st => ({
        text: t(`status.${st}`),
        value: st,
      })),
      onFilter: (value, rec) => rec.status === value,
    },
    {
      title: t('common.actions'),
      key: 'actions',
      render: (_, rec) => (
        <Space size="small">
          <Button
            type="link"
            size="small"
            onClick={() => navigate(`/applications/${rec.id}`)}
          >
            {t('common.view')}
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => navigate(`/applications/${rec.id}`)}
          >
            {t('common.edit')}
          </Button>
        </Space>
      ),
      responsive: ['sm'],
    },
  ];

  return (
    <div className="applications-page">
      {/* Header + New Button */}
      <div
        className="page-header"
        style={{
          display: 'flex',
          alignItems: 'center',
          flexWrap: 'nowrap',
          marginBottom: 16,
        }}
      >
        <h1 style={{ margin: 0 }}>{t('nav.applications')}</h1>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setFormVisible(true)}
          // ← this auto-margins on the inline-start side (left in LTR, right in RTL)
          style={{ marginInlineStart: 'auto' }}
        >
          {t('applications.newApplication')}
        </Button>
      </div>

      {/* Search */}
      <Input
        placeholder={t('common.search')}
        prefix={<SearchOutlined />}
        value={searchText}
        onChange={e => setSearchText(e.target.value)}
        style={{ marginBottom: 16 }}
      />

      {isMobile ? (
        /* Mobile List + pagination */
        <List
          dataSource={filtered}
          loading={loading}
          pagination={{ pageSize: 10, showSizeChanger: false }}
          rowKey="id"
          renderItem={app => (
            <List.Item
              onClick={() => navigate(`/applications/${app.id}`)}
              style={{
                padding: '12px 16px',
                borderBottom: '1px solid rgba(255,255,255,0.15)',
              }}
            >
              <List.Item.Meta
                title={`${app.company} — ${app.position}`}
                description={formatDate(app.dateApplied, i18n.language)}
              />
              <Tag color={statusColors[app.status]}>
                {t(`status.${app.status}`)}
              </Tag>
            </List.Item>
          )}
        />
      ) : (
        /* Desktop Table */
        <Table
          columns={columns}
          dataSource={filtered}
          rowKey="id"
          loading={loading}
          onRow={rec => ({
            onClick: () => navigate(`/applications/${rec.id}`),
          })}
          scroll={{ x: 'max-content' }}
          size="middle"
          pagination={{
            pageSize: 10,
            showSizeChanger: false,
            position: ['bottomCenter'],
          }}
        />
      )}

      {/* New/Edit Modal */}
      <Modal
        title={t('applications.newApplication')}
        open={formVisible}
        onCancel={() => setFormVisible(false)}
        footer={null}
        width={isMobile ? '100%' : 700}
        style={isMobile ? { top: 0, padding: 0 } : undefined}
        destroyOnHidden
      >
        <ApplicationForm
          onSubmit={handleCreate}
          onCancel={() => setFormVisible(false)}
          loading={creating}
        />
      </Modal>
    </div>
  );
};

export default Applications;
