import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

// Ant Design components & utilities
import {
  Card,
  Calendar as AntCalendar,
  Badge,
  Spin,
  Empty,
  Select,
  Modal,
  Typography,
  Row,
  Col,
} from 'antd';

// Internationalization
import { useTranslation } from 'react-i18next';

// Date handling
import dayjs, { Dayjs } from 'dayjs';

// Custom hooks & services
import { useLanguage } from '../hooks/useLanguage';
import { applicationService } from '../services/api';

// Types
import type { Application, CalendarEvent } from '../types/application';

const { Option } = Select;
const { Title } = Typography;

/**
 * Map application statuses and event types to Ant Design Badge statuses.
 */
const statusBadgeColors: Record<
  string,
  'success' | 'processing' | 'warning' | 'error' | 'default'
> = {
  saved: 'default',
  applied: 'processing',
  phone_screen: 'processing',
  interview: 'warning',
  assessment: 'processing',
  final_round: 'warning',
  offer: 'success',
  negotiating: 'warning',
  accepted: 'success',
  rejected: 'error',
  declined: 'error',
};

const Calendar: React.FC = () => {
  // --- Router, i18n & layout direction hooks ---
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { direction } = useLanguage();
  const isRTL = direction === 'rtl';

  // --- Component state ---
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

  // --- Fetch all applications on mount ---
  useEffect(() => {
    const loadApplications = async () => {
      setLoading(true);
      try {
        const data = await applicationService.getAll();
        setApplications(data);
      } finally {
        setLoading(false);
      }
    };
    loadApplications();
  }, []);

  // --- Group applications by their applied date (YYYY-MM-DD) ---
  const appsByDate = useMemo(() => {
    return applications.reduce<Record<string, Application[]>>((acc, app) => {
      const key = dayjs(app.dateApplied).format('YYYY-MM-DD');
      (acc[key] ||= []).push(app);
      return acc;
    }, {});
  }, [applications]);

  // --- Flatten calendar events and group by event date (YYYY-MM-DD) ---
  const schedByDate = useMemo(() => {
    const allEvents = applications.flatMap(app =>
      (app.calendarEvents || []).map(evt => ({ ...evt, application: app }))
    );
    return allEvents.reduce<
      Record<string, (CalendarEvent & { application: Application })[]>
    >((acc, evt) => {
      const key = dayjs(evt.date).format('YYYY-MM-DD');
      (acc[key] ||= []).push(evt);
      return acc;
    }, {});
  }, [applications]);

  /**
   * When a day cell is clicked, open the modal if there are
   * any applications or events on that date.
   */
  const handleDayClick = (date: Dayjs) => {
    const key = date.format('YYYY-MM-DD');
    if ((appsByDate[key]?.length || 0) + (schedByDate[key]?.length || 0) > 0) {
      setSelectedDate(date);
      setIsModalVisible(true);
    }
  };

  /**
   * Render badges for each application and event in a given date cell.
   */
  const dateCellRender = (value: Dayjs) => {
    const key = value.format('YYYY-MM-DD');
    const apps = appsByDate[key] || [];
    const scheds = schedByDate[key] || [];

    if (!apps.length && !scheds.length) {
      return null;
    }

    return (
      <ul
        className="calendar-events"
        style={{ padding: 0, margin: 0, listStyle: 'none', cursor: 'pointer' }}
        onClick={() => handleDayClick(value)}
      >
        {apps.map(app => (
          <li key={`app-${app.id}`} style={{ marginBottom: 4 }}>
            <Badge
              status={statusBadgeColors[app.status]}
              text={`${app.company} — ${t(`status.${app.status}`)}`}
            />
          </li>
        ))}
        {scheds.map(evt => (
          <li key={`evt-${evt.id}`} style={{ marginBottom: 4 }}>
            <Badge
              status={statusBadgeColors[evt.type]}
              text={`${evt.application.company} — ${t(
                `status.${evt.type}`
              )} @ ${dayjs(evt.date).format('HH:mm')}`}
            />
          </li>
        ))}
      </ul>
    );
  };

  /** We don't render anything special for month cells here. */
  const monthCellRender = (_: Dayjs) => null;

  /**
   * Chooses between date or month cell rendering.
   */
  const cellRender: React.ComponentProps<typeof AntCalendar>['cellRender'] = (
    current,
    info
  ) => {
    if (info.type === 'date') return dateCellRender(current);
    if (info.type === 'month') return monthCellRender(current);
    return info.originNode;
  };

  /**
   * Custom header: Month selector first, then Year selector.
   * Automatically aligns left or right based on RTL/LTR.
   */
  const headerRender: React.ComponentProps<typeof AntCalendar>['headerRender'] = ({
    value,
    onChange,
  }) => (
    <div
      className="calendar-header"
      style={isRTL ? { marginRight: 'auto' } : { marginLeft: 'auto' }}
    >
      {/* Month dropdown */}
      <Select
        size="small"
        value={value.month()}
        onChange={m => onChange(value.clone().set('month', m))}
        style={{ width: 120, marginRight: 8 }}
      >
        {Array.from({ length: 12 }, (_, i) => (
          <Option key={i} value={i}>
            {t(`months.${String(i + 1).padStart(2, '0')}`)}
          </Option>
        ))}
      </Select>

      {/* Year dropdown (from 5 years ago to 5 years in future) */}
      <Select
        size="small"
        value={value.year()}
        onChange={y => onChange(value.clone().set('year', y))}
        style={{ width: 90 }}
      >
        {Array.from({ length: 11 }, (_, idx) => {
          const year = dayjs().year() - 5 + idx;
          return (
            <Option key={year} value={year}>
              {year}
            </Option>
          );
        })}
      </Select>
    </div>
  );

  // Format the selected date key for modal content lookup
  const selectedKey = selectedDate?.format('YYYY-MM-DD')!;

  return (
    <div className="calendar-page" dir={direction}>
      {/* Page title */}
      <Row justify="space-between" style={{ marginBottom: 16 }}>
        <Col>
          <Title level={2}>{t('nav.calendar')}</Title>
        </Col>
      </Row>

      {/* Loading spinner and calendar card */}
      <Spin spinning={loading}>
        <Card className="calendar-card">
          {applications.length > 0 ? (
            <AntCalendar
              cellRender={cellRender}
              headerRender={headerRender}
              onSelect={handleDayClick}
            />
          ) : (
            <Empty description={t('dashboard.noData')} />
          )}
        </Card>
      </Spin>

      {/* Modal showing details for the selected day */}
      <Modal
        title={selectedDate?.format('YYYY-MM-DD')}
        open={isModalVisible}
        destroyOnClose
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        width={600}
        centered
      >
        <div className="day-details">
          <Title level={5}>{t('calendar.todayEvents')}</Title>

          {[
            // Combine application entries and scheduled events into one list
            ...(appsByDate[selectedKey] || []).map(app => ({
              id: `app-${app.id}`,
              status: statusBadgeColors[app.status],
              text: `${app.company} — ${t(`status.${app.status}`)}`,
              onClick: () => {
                setIsModalVisible(false);
                navigate(`/applications/${app.id}`);
              },
            })),
            ...(schedByDate[selectedKey] || []).map(evt => ({
              id: `evt-${evt.id}`,
              status: statusBadgeColors[evt.type],
              text: `${evt.application.company} — ${t(
                `status.${evt.type}`
              )} @ ${dayjs(evt.date).format('HH:mm')}`,
              onClick: () => {
                setIsModalVisible(false);
                navigate(`/applications/${evt.application.id}`);
              },
            })),
          ].map(item => (
            <Card
              key={item.id}
              size="small"
              hoverable
              style={{ marginBottom: 8, width: '100%' }}
              onClick={item.onClick}
            >
              <Badge status={item.status} text={item.text} />
            </Card>
          ))}
        </div>
      </Modal>
    </div>
  );
};

export default Calendar;
