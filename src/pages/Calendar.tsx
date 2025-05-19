// src/pages/Calendar.tsx

import React, { useState, useEffect, useMemo } from 'react';
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
  Col
} from 'antd';
import { useTranslation } from 'react-i18next';
import dayjs, { Dayjs } from 'dayjs';
import { useNavigate } from 'react-router-dom';

import type { Application, CalendarEvent } from '../types/application';
import { applicationService } from '../services/api';
import { useLanguage } from '../hooks/useLanguage';

const { Option } = Select;
const { Title } = Typography;

// Map statuses to Badge colors
const statusBadgeColors: Record<string, 'success'|'processing'|'warning'|'error'|'default'> = {
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
  declined: 'error'
};

const Calendar: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { direction } = useLanguage();
  const isRTL = direction === 'rtl';

  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  // Fetch applications on mount
  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        setApplications(await applicationService.getAll());
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Group applications by applied date
  const appsByDate = useMemo(() => {
    return applications.reduce<Record<string, Application[]>>((acc, app) => {
      const key = dayjs(app.dateApplied).format('YYYY-MM-DD');
      (acc[key] ||= []).push(app);
      return acc;
    }, {});
  }, [applications]);

  // Flatten & group calendar events by date
  const schedByDate = useMemo(() => {
    return applications
      .flatMap(app =>
        (app.calendarEvents || []).map(evt => ({ ...evt, application: app }))
      )
      .reduce<Record<string, (CalendarEvent & { application: Application })[]>>(
        (acc, evt) => {
          const key = dayjs(evt.date).format('YYYY-MM-DD');
          (acc[key] ||= []).push(evt);
          return acc;
        },
        {}
      );
  }, [applications]);

  // Open modal if that date has items
  const handleDayClick = (date: Dayjs) => {
    const key = date.format('YYYY-MM-DD');
    if ((appsByDate[key] || []).length || (schedByDate[key] || []).length) {
      setSelectedDate(date);
      setIsModalVisible(true);
    }
  };

  // Render badges inside each calendar cell
  const dateCellRender = (value: Dayjs) => {
    const key = value.format('YYYY-MM-DD');
    const apps = appsByDate[key] || [];
    const scheds = schedByDate[key] || [];

    if (!apps.length && !scheds.length) return null;

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
              text={`${evt.application.company} — ${t(`status.${evt.type}`)} @ ${dayjs(evt.date).format('HH:mm')}`}
            />
          </li>
        ))}
      </ul>
    );
  };

  const monthCellRender = (_: Dayjs) => null;

  const cellRender: React.ComponentProps<typeof AntCalendar>['cellRender'] = (current, info) => {
    if (info.type === 'date') return dateCellRender(current);
    if (info.type === 'month') return monthCellRender(current);
    return info.originNode;
  };

  // Header: Month→Year in source order, but the wrapper itself gets
  // marginLeft/Right auto so it slides left in RTL and right in LTR
  const headerRender: React.ComponentProps<typeof AntCalendar>['headerRender'] = ({
    value,
    onChange
  }) => (
    <div
      className="calendar-header"
      style={
        isRTL
          ? { marginRight: 'auto' }
          : { marginLeft: 'auto' }
      }
    >
      {/* Month first */}
      <Select
        size="small"
        value={value.month()}
        onChange={m => onChange(value.clone().set('month', m))}
        style={{ width: 120, marginRight: 8 }}
      >
        {Array.from({ length: 12 }).map((_, i) => (
          <Option key={i} value={i}>
            {t(`months.${String(i + 1).padStart(2, '0')}`)}
          </Option>
        ))}
      </Select>

      {/* Year second */}
      <Select
        size="small"
        value={value.year()}
        onChange={y => onChange(value.clone().set('year', y))}
        style={{ width: 90 }}
      >
        {Array.from({ length: 11 }).map((_, idx) => {
          const yr = dayjs().year() - 5 + idx;
          return (
            <Option key={yr} value={yr}>
              {yr}
            </Option>
          );
        })}
      </Select>
    </div>
  );

  const selectedKey = selectedDate?.format('YYYY-MM-DD')!;

  return (
    <div className="calendar-page" dir={direction}>
      <Row justify="space-between" style={{ marginBottom: 16 }}>
        <Col>
          <Title level={2}>{t('nav.calendar')}</Title>
        </Col>
      </Row>

      <Spin spinning={loading}>
        <Card className="calendar-card">
          {applications.length ? (
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

      <Modal
        title={selectedDate?.format('YYYY-MM-DD')}
        open={isModalVisible}
        destroyOnHidden
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        width={600}
        centered
      >
        <div className="day-details">
          <Title level={5}>{t('calendar.todayEvents')}</Title>

          {[
            ...(appsByDate[selectedKey] || []).map(app => ({
              id: `app-${app.id}`,
              status: statusBadgeColors[app.status],
              text: `${app.company} — ${t(`status.${app.status}`)}`,
              onClick: () => {
                setIsModalVisible(false);
                navigate(`/applications/${app.id}`);
              }
            })),
            ...(schedByDate[selectedKey] || []).map(evt => ({
              id: `evt-${evt.id}`,
              status: statusBadgeColors[evt.type],
              text: `${evt.application.company} — ${t(`status.${evt.type}`)} @ ${dayjs(evt.date).format('HH:mm')}`,
              onClick: () => {
                setIsModalVisible(false);
                navigate(`/applications/${evt.application.id}`);
              }
            }))
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
