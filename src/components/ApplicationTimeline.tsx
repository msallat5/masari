// src/components/ApplicationTimeline.tsx

import React, { useState, useMemo } from 'react';
import {
  Timeline,
  Input,
  Button,
  Typography,
  Space,
  Select,
  Row,
  Col,
  Modal,
  DatePicker,
  Form,
  type TimelineProps,
} from 'antd';
import {
  ClockCircleOutlined,
  FormOutlined,
  FileTextOutlined,
  CalendarOutlined,
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

import { useLanguage } from '../hooks/useLanguage';
import { formatDate } from '../utils/helpers';
import type {
  Application,
  ApplicationStatus,
  InterviewDetails,
} from '../types/application';
import '../index.css';

dayjs.extend(relativeTime);

const { Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;

// ─────────────────────────────────────────────────────────────────────────────
// Styled wrappers for responsive layout and custom styles
// ─────────────────────────────────────────────────────────────────────────────

const ResponsiveContainer = styled.div`
  padding: 0 16px;
  @media (max-width: 576px) {
    padding: 0 8px;
  }
  .date-header {
    margin: 16px 0 8px;
    text-align: center;
    font-size: 14px;
  }
  .ant-timeline {
    margin: 0;
  }
  .ant-timeline-item-content {
    word-break: break-word;
  }
`;

const TimelineIndent = styled.div`
  margin-left: 32px;
  color: var(--text-color-secondary);
  font-style: italic;
`;

// ─────────────────────────────────────────────────────────────────────────────
// Helpers: map statuses to tag colors and flatten history into events
// ─────────────────────────────────────────────────────────────────────────────

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

interface ApplicationEvent {
  id: string;
  type: 'created' | 'status_change' | 'note';
  date: string;
  status?: ApplicationStatus;
  interviewDetails?: InterviewDetails;
  note?: string;
}

/**
 * Generate a unified, chronological list of timeline events
 * (creation, status changes, and notes) from an Application.
 */
function generateTimelineEvents(app: Application): ApplicationEvent[] {
  const events: ApplicationEvent[] = [
    { id: 'created', type: 'created', date: app.createdAt },
  ];

  app.statusHistory?.forEach((h, i) => {
    events.push({
      id: `status-${h.status}-${i}`,
      type: 'status_change',
      date: h.date,
      status: h.status,
      interviewDetails: h.interviewDetails,
    });
  });

  app.notesHistory?.forEach((n, i) => {
    events.push({
      id: `note-${i}`,
      type: 'note',
      date: n.date,
      note: n.note,
    });
  });

  return events.sort((a, b) => dayjs(a.date).diff(dayjs(b.date)));
}

// ─────────────────────────────────────────────────────────────────────────────
// Props for the ApplicationTimeline component
// ─────────────────────────────────────────────────────────────────────────────

interface Props {
  application: Application;
  onAddNote: (note: string) => Promise<void>;
  onUpdateStatus?: (
    newStatus: ApplicationStatus,
    opts?: { interviewDetails?: InterviewDetails }
  ) => Promise<void>;
}

// ─────────────────────────────────────────────────────────────────────────────
// Main component
// ─────────────────────────────────────────────────────────────────────────────

const ApplicationTimeline: React.FC<Props> = ({
  application,
  onAddNote,
  onUpdateStatus,
}) => {
  const { t } = useTranslation();
  const { direction, language } = useLanguage();
  const isRTL = direction === 'rtl';

  // Timeline always left-aligned
  const timelineMode: TimelineProps['mode'] = 'left';

  // Note input state
  const [noteText, setNoteText] = useState('');
  const [showNoteInput, setShowNoteInput] = useState(false);
  const [adding, setAdding] = useState(false);

  // Status update state
  const [newStatus, setNewStatus] = useState<ApplicationStatus>();
  const [updating, setUpdating] = useState(false);

  // Scheduling modal state
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [scheduleFor, setScheduleFor] = useState<ApplicationStatus | null>(
    null
  );
  const [form] = Form.useForm();

  // Group events by day for rendering
  const groupedEvents = useMemo(() => {
    const flat = generateTimelineEvents(application);
    const byDay: Record<string, ApplicationEvent[]> = {};
    flat.forEach(evt => {
      const key = dayjs(evt.date).format('YYYY-MM-DD');
      (byDay[key] ||= []).push(evt);
    });
    return Object.entries(byDay).sort(([a], [b]) =>
      dayjs(a).diff(dayjs(b))
    );
  }, [application]);

  const needsScheduling = (s: ApplicationStatus) =>
    ['phone_screen', 'interview', 'assessment', 'final_round'].includes(s);

  // ───────────────────────────────────────────────────────────────────────────
  // Handlers
  // ───────────────────────────────────────────────────────────────────────────

  /** Save a new note, then reset the input */
  const handleSaveNote = async () => {
    if (!noteText.trim()) return;
    setAdding(true);
    try {
      await onAddNote(noteText);
      setNoteText('');
      setShowNoteInput(false);
    } finally {
      setAdding(false);
    }
  };

  /** Perform a status update (with optional scheduling details) */
  const doUpdate = async (
    status: ApplicationStatus,
    opts?: { interviewDetails?: InterviewDetails }
  ) => {
    if (!onUpdateStatus) return;
    setUpdating(true);
    try {
      await onUpdateStatus(status, opts);
      setNewStatus(undefined);
    } finally {
      setUpdating(false);
    }
  };

  /** When the user clicks “Done” after choosing a new status */
  const handleStatusDone = () => {
    if (!newStatus) return;
    if (needsScheduling(newStatus)) {
      setScheduleFor(newStatus);
      setShowScheduleModal(true);
    } else {
      doUpdate(newStatus);
    }
  };

  /** Confirm scheduling modal and perform update */
  const handleScheduleOk = async () => {
    const vals = await form.validateFields();
    await doUpdate(scheduleFor!, {
      interviewDetails: {
        dateTime: vals.dateTime.toISOString(),
        location: vals.location,
        notes: vals.notes,
      },
    });
    form.resetFields();
    setShowScheduleModal(false);
    setScheduleFor(null);
  };

  /** Cancel scheduling modal */
  const handleScheduleCancel = () => {
    form.resetFields();
    setShowScheduleModal(false);
    setScheduleFor(null);
  };

  // ───────────────────────────────────────────────────────────────────────────
  // Render
  // ───────────────────────────────────────────────────────────────────────────

  return (
    <ResponsiveContainer dir={direction} className="timeline-container">
      <Space direction="vertical" style={{ width: '100%' }} size="large">
        {/* Header actions */}
        <Row wrap gutter={[8, 8]} justify="start" align="middle">
          <Col xs={24} sm="auto">
            <Space size="middle">
              {onUpdateStatus && !showNoteInput && (
                <>
                  <Select<ApplicationStatus>
                    size="large"
                    placeholder={t('applications.updateStatus')}
                    value={newStatus}
                    onChange={setNewStatus}
                    style={{ minWidth: 150, height: 40 }}
                  >
                    {Object.keys(statusColors).map(s => (
                      <Option key={s} value={s as ApplicationStatus}>
                        {t(`status.${s}`)}
                      </Option>
                    ))}
                  </Select>
                  {newStatus && (
                    <Button
                      size="large"
                      type="primary"
                      loading={updating}
                      onClick={handleStatusDone}
                      style={{ height: 40 }}
                    >
                      {t('common.done')}
                    </Button>
                  )}
                </>
              )}
              {!showNoteInput && !newStatus && (
                <Button
                  size="large"
                  icon={<FileTextOutlined />}
                  loading={adding}
                  onClick={() => setShowNoteInput(v => !v)}
                  style={{ height: 40 }}
                >
                  {t('applications.addNote')}
                </Button>
              )}
            </Space>
          </Col>
        </Row>

        {/* Note input area */}
        {showNoteInput && (
          <div className="note-input-area">
            <TextArea
              rows={3}
              value={noteText}
              onChange={e => setNoteText(e.target.value)}
              placeholder={t('applications.enterNoteHere')}
              autoFocus
            />
            <div style={{ marginTop: 12, textAlign: isRTL ? 'left' : 'right' }}>
              <Space>
                <Button onClick={() => setShowNoteInput(false)}>
                  {t('common.cancel')}
                </Button>
                <Button
                  type="primary"
                  onClick={handleSaveNote}
                  loading={adding}
                  disabled={!noteText.trim()}
                >
                  {t('applications.saveNote')}
                </Button>
              </Space>
            </div>
          </div>
        )}

        {/* Timeline per day */}
        {!showNoteInput &&
          groupedEvents.map(([day, evts]) => (
            <div key={day}>
              <div className="date-header">
                <Text strong>{formatDate(day, language)}</Text>
              </div>
              <Timeline
                mode={timelineMode}
                items={evts.map(evt => {
                  const isStatus = evt.type === 'status_change';
                  const dot =
                    evt.type === 'created' ? (
                      <ClockCircleOutlined />
                    ) : isStatus ? (
                      <FormOutlined />
                    ) : (
                      <FileTextOutlined />
                    );
                  const color = isStatus && evt.status
                    ? statusColors[evt.status]
                    : 'blue';

                  return {
                    key: evt.id,
                    dot,
                    color,
                    children: (
                      <>
                        {isStatus ? (
                          <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                          }}>
                            <Text strong>
                              {t('timeline.statusChanged')} {t(`status.${evt.status}`)}
                            </Text>
                            {evt.interviewDetails && (
                              <Space size="small">
                                <CalendarOutlined />
                                <Text italic>
                                  {formatDate(evt.interviewDetails.dateTime, language)}
                                </Text>
                              </Space>
                            )}
                          </div>
                        ) : evt.type === 'note' ? (
                          <div style={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: 16,
                          }}>
                            <Text strong>{t('timeline.noteAdded')}</Text>
                            <TimelineIndent style={{
                              textAlign: isRTL ? 'left' : 'right',
                            }}>
                              {evt.note}
                            </TimelineIndent>
                          </div>
                        ) : (
                          <Text strong>{t('timeline.created')}</Text>
                        )}
                        <div>
                          <Text type="secondary">
                            {dayjs(evt.date).format('HH:mm')}
                          </Text>
                        </div>
                      </>
                    ),
                  };
                })}
              />
            </div>
          ))}

        {/* Scheduling modal */}
        <Modal
          title={
            scheduleFor
              ? t(
                  `applications.schedule${scheduleFor.charAt(0).toUpperCase() +
                    scheduleFor.slice(1)}`
                )
              : ''
          }
          open={showScheduleModal}
          onOk={handleScheduleOk}
          onCancel={handleScheduleCancel}
          okText={t('applications.scheduleConfirm')}
          cancelText={t('common.cancel')}
          confirmLoading={updating}
        >
          <Form form={form} layout="vertical">
            <Form.Item
              name="dateTime"
              label={t('applications.dateAndTime')}
              rules={[{ required: true, message: t('applications.dateTimeRequired') }]}
            >
              <DatePicker
                showTime
                format="YYYY-MM-DD HH:mm"
                style={{ width: '100%' }}
              />
            </Form.Item>
            <Form.Item name="location" label={t('applications.location')}>
              <Input placeholder={t('applications.locationPlaceholder')} />
            </Form.Item>
            <Form.Item name="notes" label={t('applications.notes')}>
              <TextArea rows={3} placeholder={t('applications.notesPlaceholder')} />
            </Form.Item>
          </Form>
        </Modal>
      </Space>
    </ResponsiveContainer>
  );
};

export default ApplicationTimeline;
