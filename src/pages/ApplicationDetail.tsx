// src/pages/ApplicationDetail.tsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Card,
  Button,
  Descriptions,
  Tag,
  Modal,
  Skeleton,
  message,
  Space,
  Row,
  Col,
} from 'antd';
import {
  EditOutlined,
  DeleteOutlined,
  ArrowLeftOutlined,
  ArrowRightOutlined,
  LinkOutlined,
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import type { Application, ApplicationStatus } from '../types/application';
import { applicationService } from '../services/api';
import { formatDate } from '../utils/helpers';
import ApplicationForm from '../components/ApplicationForm';
import ApplicationTimeline from '../components/ApplicationTimeline';
import { useLanguage } from '../hooks/useLanguage';
import type {
  NoteHistoryItem,
  StatusHistoryItem,
  CalendarEvent,
  InterviewDetails,
} from '../types/application';

const statusColors: Record<ApplicationStatus, string> = {
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

const ApplicationDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const { direction } = useLanguage();
  const isRTL = direction === 'rtl';

  const [application, setApplication] = useState<Application | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    (async () => {
      if (!id) return;
      setLoading(true);
      try {
        const data = await applicationService.getById(id);
        setApplication(data);
      } catch {
        message.error(t('common.error'));
      } finally {
        setLoading(false);
      }
    })();
  }, [id, t]);

  const handleUpdate = async (patch: Partial<Application>) => {
    if (!id) return;
    setSaving(true);
    try {
      const updated = await applicationService.update(id, patch);
      if (updated) {
        setApplication(updated);
        setEditing(false);
        message.success(t('common.success'));
      }
    } catch {
      message.error(t('common.error'));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    setDeleting(true);
    try {
      const ok = await applicationService.delete(id);
      if (ok) {
        message.success(t('common.success'));
        navigate('/applications');
      }
    } catch {
      message.error(t('common.error'));
    } finally {
      setDeleting(false);
      setDeleteModalVisible(false);
    }
  };

  const handleAddNote = async (note: string) => {
    if (!id || !application) return;
    const now = new Date().toISOString();
    const newNote: NoteHistoryItem = { note, date: now };
    const updatedNotes = [...(application.notesHistory || []), newNote];
    setApplication(app => app && { ...app, notesHistory: updatedNotes });
    try {
      await applicationService.update(id, { notesHistory: updatedNotes });
      message.success(t('common.success'));
    } catch {
      message.error(t('common.error'));
      throw new Error();
    }
  };

  const handleStatusUpdate = async (
    newStatus: ApplicationStatus,
    opts?: { interviewDetails?: InterviewDetails }
  ) => {
    if (!id || !application || application.status === newStatus) return;
    const now = new Date().toISOString();
    const entry: StatusHistoryItem = {
      status: newStatus,
      date: now,
      interviewDetails: opts?.interviewDetails,
    };
    const updatedHistory = [...(application.statusHistory || []), entry];
    const updatedEvents = opts?.interviewDetails
      ? [
          ...(application.calendarEvents || []),
          {
            id: `evt-${now}`,
            applicationId: application.id,
            title: t(`status.${newStatus}`),
            date: opts.interviewDetails!.dateTime,
            type: newStatus as CalendarEvent['type'],
            location: opts.interviewDetails!.location,
            notes: opts.interviewDetails!.notes,
          },
        ]
      : application.calendarEvents || [];

    setApplication(app =>
      app && {
        ...app,
        status: newStatus,
        updatedAt: now,
        statusHistory: updatedHistory,
        calendarEvents: updatedEvents,
      }
    );

    try {
      await applicationService.update(id, {
        status: newStatus,
        updatedAt: now,
        statusHistory: updatedHistory,
        calendarEvents: updatedEvents,
      });
      message.success(t('common.success'));
    } catch {
      message.error(t('common.error'));
    }
  };

  if (loading) return <Skeleton active />;

  if (!application) {
    return (
      <div style={{ textAlign: isRTL ? 'right' : 'left' }}>
        <h1>{t('common.error')}</h1>
        <Button
          type="primary"
          icon={isRTL ? <ArrowRightOutlined /> : <ArrowLeftOutlined />}
          onClick={() => navigate('/applications')}
        >
          {t('nav.applications')}
        </Button>
      </div>
    );
  }

  if (editing) {
    return (
      <Card title={t('applications.edit')}>
        <ApplicationForm
          initialValues={application}
          onSubmit={handleUpdate}
          onCancel={() => setEditing(false)}
          loading={saving}
        />
      </Card>
    );
  }

  return (
    <div className="application-detail-page" style={{ direction }}>
      <div className="page-header">
        <div className="header-left">
          <Button
            icon={isRTL ? <ArrowRightOutlined /> : <ArrowLeftOutlined />}
            onClick={() => navigate('/applications')}
          />
          <h1>{application.company} — {application.position}</h1>
        </div>
        <div className="header-actions">
          <Space>
            <Button
              type="primary"
              icon={<EditOutlined />}
              onClick={() => setEditing(true)}
            >
              {t('common.edit')}
            </Button>
            <Button
              danger
              icon={<DeleteOutlined />}
              onClick={() => setDeleteModalVisible(true)}
            >
              {t('common.delete')}
            </Button>
          </Space>
        </div>
      </div>

      <Row gutter={[24, 24]}>
        <Col xs={24} lg={12}>
          <Descriptions
            bordered
            layout="vertical"
            column={{ xs: 1, sm: 1 }}
            style={{ direction }}
            styles={{
              label:   { textAlign: 'start', direction },
              content: { textAlign: 'start', direction },
            }}
          >
            <Descriptions.Item label={t('applications.company')}>
              {application.company}
            </Descriptions.Item>
            <Descriptions.Item label={t('applications.position')}>
              {application.position}
            </Descriptions.Item>
            <Descriptions.Item label={t('applications.dateApplied')}>
              {formatDate(application.dateApplied, i18n.language)}
            </Descriptions.Item>
            <Descriptions.Item label={t('applications.location')}>
              {application.location}
            </Descriptions.Item>
            <Descriptions.Item label={t('applications.source')}>
              {application.source}
            </Descriptions.Item>
            <Descriptions.Item label={t('applications.jobType')}>
              {application.jobType
                ? t(`jobType.${application.jobType}`)
                : '-'}
            </Descriptions.Item>
            <Descriptions.Item label={t('applications.status')}>
              <Tag color={statusColors[application.status]}>
                {t(`status.${application.status}`)}
              </Tag>
            </Descriptions.Item>
            {application.jobUrl && (
              <Descriptions.Item label={t('applications.jobUrl')}>
                <a
                  href={application.jobUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ textDecoration: 'none' }}
                >
                  <Tag icon={<LinkOutlined />} color="blue">
                    {application.jobUrl}
                  </Tag>
                </a>
              </Descriptions.Item>
            )}
          </Descriptions>
        </Col>
        <Col xs={24} lg={12}>
          <ApplicationTimeline
            application={application}
            onAddNote={handleAddNote}
            onUpdateStatus={handleStatusUpdate}
          />
        </Col>
      </Row>

      <Modal
        title={t('common.confirm')}
        open={deleteModalVisible}
        onOk={handleDelete}
        onCancel={() => setDeleteModalVisible(false)}
        confirmLoading={deleting}
        okText={t('common.delete')}
        cancelText={t('common.cancel')}
        centered
        styles={{
          body: { direction, textAlign: isRTL ? 'right' : 'left' },
        }}
      >
        <p>{t('applications.deleteConfirmation')}</p>
      </Modal>
    </div>
  );
};

export default ApplicationDetail;
