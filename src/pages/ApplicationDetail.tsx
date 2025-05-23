// src/pages/ApplicationDetail.tsx

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

// UI components & icons
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

// Internationalization & direction
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../hooks/useLanguage';

// Services & utilities
import { applicationService } from '../services/api';
import { formatDate } from '../utils/helpers';

// Components
import ApplicationForm from '../components/ApplicationForm';
import ApplicationTimeline from '../components/ApplicationTimeline';

// Types
import type {
  Application,
  ApplicationStatus,
  NoteHistoryItem,
  StatusHistoryItem,
  CalendarEvent,
  InterviewDetails,
} from '../types/application';

/**
 * Mapping of application statuses to Ant Design tag colors.
 */
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
  // --- Router hooks ---
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // --- i18n & layout direction ---
  const { t, i18n } = useTranslation();
  const { direction } = useLanguage();
  const isRTL = direction === 'rtl';

  // --- Component state ---
  const [application, setApplication] = useState<Application | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [editing, setEditing] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState<boolean>(false);
  const [deleting, setDeleting] = useState<boolean>(false);

  // --- Fetch application on mount or when `id` changes ---
  useEffect(() => {
    if (!id) return;

    const loadApplication = async () => {
      setLoading(true);
      try {
        const data = await applicationService.getById(id);
        setApplication(data);
      } catch {
        message.error(t('common.error'));
      } finally {
        setLoading(false);
      }
    };

    loadApplication();
  }, [id, t]);

  /**
   * Handle saving edits to the application.
   */
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

  /**
   * Handle deleting the application.
   */
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

  /**
   * Add a note to the application's history.
   */
  const handleAddNote = async (note: string) => {
    if (!id || !application) return;

    const now = new Date().toISOString();
    const newNote: NoteHistoryItem = { note, date: now };
    const updatedNotes = [...(application.notesHistory || []), newNote];

    // Optimistically update UI
    setApplication(app => app && { ...app, notesHistory: updatedNotes });

    try {
      await applicationService.update(id, { notesHistory: updatedNotes });
      message.success(t('common.success'));
    } catch {
      message.error(t('common.error'));
      throw new Error('Failed to save note');
    }
  };

  /**
   * Change the application status and optionally add interview details.
   */
  const handleStatusUpdate = async (
    newStatus: ApplicationStatus,
    opts?: { interviewDetails?: InterviewDetails }
  ) => {
    if (!id || !application || application.status === newStatus) return;

    const now = new Date().toISOString();
    const statusEntry: StatusHistoryItem = {
      status: newStatus,
      date: now,
      interviewDetails: opts?.interviewDetails,
    };

    // Build new status history and calendar events arrays
    const updatedHistory = [...(application.statusHistory || []), statusEntry];
    const updatedEvents = opts?.interviewDetails
      ? [
          ...(application.calendarEvents || []),
          {
            id: `evt-${now}`,
            applicationId: application.id,
            title: t(`status.${newStatus}`),
            date: opts.interviewDetails.dateTime,
            type: newStatus as CalendarEvent['type'],
            location: opts.interviewDetails.location,
            notes: opts.interviewDetails.notes,
          },
        ]
      : application.calendarEvents || [];

    // Optimistically update UI
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

  // --- Render loading state ---
  if (loading) {
    return <Skeleton active />;
  }

  // --- Render error if no application found ---
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

  // --- Render edit form if in editing mode ---
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

  // --- Main detail view ---
  return (
    <div className="application-detail-page" style={{ direction }}>
      {/* Page header with back button and action buttons */}
      <div className="page-header">
        <div className="header-left">
          <Button
            icon={isRTL ? <ArrowRightOutlined /> : <ArrowLeftOutlined />}
            onClick={() => navigate('/applications')}
          />
          <h1>
            {application.company} — {application.position}
          </h1>
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

      {/* Details and timeline sections */}
      <Row gutter={[24, 24]}>
        {/* Left: Static application details */}
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

        {/* Right: Timeline with notes & status updates */}
        <Col xs={24} lg={12}>
          <ApplicationTimeline
            application={application}
            onAddNote={handleAddNote}
            onUpdateStatus={handleStatusUpdate}
          />
        </Col>
      </Row>

      {/* Delete confirmation modal */}
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
