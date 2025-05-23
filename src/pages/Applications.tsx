import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Ant Design responsive hook
import { Grid } from 'antd';
const { useBreakpoint } = Grid;

// Ant Design components & utilities
import {
  Table,
  List,
  Button,
  Input,
  Space,
  Tag,
  Modal,
  message,
} from 'antd';

// Ant Design icons
import { SearchOutlined, PlusOutlined } from '@ant-design/icons';

// Internationalization
import { useTranslation } from 'react-i18next';

// Services & helpers
import { applicationService } from '../services/api';
import { formatDate } from '../utils/helpers';

// Form component
import ApplicationForm from '../components/ApplicationForm';

// Types
import type { TableProps } from 'antd';
import type { Application } from '../types/application';

/**
 * Map each application status to a Tag color.
 */
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
  // --- Hooks: navigation, translation, responsiveness ---
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const screens = useBreakpoint();
  const isMobile = !screens.md;

  // --- Component state ---
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchText, setSearchText] = useState<string>('');
  const [formVisible, setFormVisible] = useState<boolean>(false);
  const [creating, setCreating] = useState<boolean>(false);

  // --- Load all applications once on mount ---
  useEffect(() => {
    fetchApplications();
  }, []);

  /**
   * Fetch applications from the API.
   */
  const fetchApplications = async () => {
    setLoading(true);
    try {
      const data = await applicationService.getAll();
      setApplications(data);
    } catch (err) {
      console.error(err);
      message.error(t('common.error'));
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle creation of a new application.
   */
  const handleCreate = async (
    values: Omit<Application, 'id' | 'createdAt' | 'updatedAt'>
  ) => {
    setCreating(true);
    try {
      const newApp = await applicationService.create(values);
      setApplications(prev => [newApp, ...prev]);
      setFormVisible(false);
      message.success(t('common.success'));
    } catch (err) {
      console.error(err);
      message.error(t('common.error'));
    } finally {
      setCreating(false);
    }
  };

  // --- Filter applications by company or position ---
  const filtered = applications.filter(app =>
    `${app.company} ${app.position}`
      .toLowerCase()
      .includes(searchText.toLowerCase())
  );

  /**
   * Define columns for desktop Table view.
   */
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
        new Date(a.dateApplied).getTime() - new Date(b.dateApplied).getTime(),
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
        <Tag color={statusColors[status]}>{t(`status.${status}`)}</Tag>
      ),
      responsive: ['sm'],
      filters: Object.keys(statusColors).map(st => ({
        text: t(`status.${st}`),
        value: st,
      })),
      onFilter: (value, record) => record.status === value,
    },
    {
      title: t('common.actions'),
      key: 'actions',
      render: (_, record) => (
        <Space size="small">
          {/* View and Edit both navigate to the detail page (could be split later) */}
          <Button
            type="link"
            size="small"
            onClick={() => navigate(`/applications/${record.id}`)}
          >
            {t('common.view')}
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => navigate(`/applications/${record.id}`)}
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
      {/* --- Page Header with title and New button --- */}
      <div
        className="page-header"
        style={{
          display: 'flex',
          alignItems: 'center',
          marginBottom: 16,
        }}
      >
        <h1 style={{ margin: 0 }}>{t('nav.applications')}</h1>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setFormVisible(true)}
          style={{ marginInlineStart: 'auto' }}
        >
          {t('applications.newApplication')}
        </Button>
      </div>

      {/* --- Search Input --- */}
      <Input
        placeholder={t('common.search')}
        prefix={<SearchOutlined />}
        value={searchText}
        onChange={e => setSearchText(e.target.value)}
        style={{ marginBottom: 16 }}
      />

      {/* --- Responsive List or Table --- */}
      {isMobile ? (
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
                borderBottom: '1px solid rgba(0,0,0,0.1)',
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
        <Table
          columns={columns}
          dataSource={filtered}
          rowKey="id"
          loading={loading}
          onRow={record => ({
            onClick: () => navigate(`/applications/${record.id}`),
          })}
          scroll={{ x: 'max-content' }}
          size="middle"
          pagination={{ pageSize: 10, showSizeChanger: false, position: ['bottomCenter'] }}
        />
      )}

      {/* --- Modal for New Application Form --- */}
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
