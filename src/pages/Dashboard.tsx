import { useEffect, useState, useMemo } from 'react';
import {
  Row,
  Col,
  Card,
  Statistic,
  Spin,
  Typography,
  List,
  Avatar,
  Badge,
  Tooltip,
  Button
} from 'antd';
import { useTranslation } from 'react-i18next';
import {
  FileOutlined,
  TeamOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  PieChartOutlined,
  LineChartOutlined,
  FireOutlined,
  BarChartOutlined,
  InfoCircleOutlined,
  DownOutlined,
  UpOutlined
} from '@ant-design/icons';
import type { Application, ApplicationStatus } from '../types/application';
import { applicationService } from '../services/api';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  Sector
} from 'recharts';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../hooks/useLanguage';
import { useTheme } from '../hooks/useTheme';
import { STATUS_COLORS } from '../themes/themeConfig';

const { Title, Text } = Typography;

// Greetings in English based on time of day
const GREETINGS_EN = {
  morning: [
    "Mornin'! Ready to roll? ☀️",
    "Hey, good morning! Let's do this. 🌅",
    "What’s up this morning? 🌞",
    "Morning! Time to start strong. 💪"
  ],
  afternoon: [
    "Hey, afternoon! How’s it going? ☀️",
    "Good afternoon! Stay on track. 🌤️",
    "Afternoon vibes—keep it moving. 🚀",
    "Yo, mid-day check! All good? ☕️"
  ],
  evening: [
    "Evening! How was your day? 🌙",
    "Hey, good evening! Time to chill. 🌆",
    "Evening vibes—plan for tomorrow. 🌜",
    "What’s up tonight? Take it easy. 🌠"
  ],
  night: [
    "Night time—winding down? 🌃",
    "Late night? Rest up soon. 💤",
    "Quiet night—perfect for some thinking. 🌌",
    "Burning the midnight oil? Pace yourself. 🌙"
  ]
};

// Greetings in Arabic based on time of day
const GREETINGS_AR = {
  morning: [
    "صباح الخير! جاهز لليوم؟ ☀️",
    "صباح النور! كيفك اليوم؟ 🌅",
    "صباح الفل! إن شاء الله يومك سعيد. 🌸",
    "صباح الخير، يلا نبدأ بقوة. 💪"
  ],
  afternoon: [
    "مساء الخير! كيف يومك ماشي؟ ☀️",
    "نص النهار عدّى! شلونك؟ 🌤️",
    "مساء النور! خذ لك فنجان قهوة. ☕️",
    "ظهريّة سعيدة! خلّي الإنتاج مستمر. 📋"
  ],
  evening: [
    "مساء الخير! وش خططك لبكرة؟ 🌙",
    "مساء الهناء! كيف أمورك؟ 🌆",
    "مع الغروب، حان وقت الاستراحة. 🌜",
    "مساء النور! خذ وقت للاسترخاء. 🌠"
  ],
  night: [
    "ليل هادي! 💤",
    "سهران؟ لا تنسى تاخذ فاصل. 🌃",
    "ليل هادي فرصة للتفكير. 🌌",
    "لو بعدك صاحي، لا تنسى ترتاح. 🌙"
  ]
};

// KPI info tooltips
const KPI_TOOLTIPS = {
  totalApplications: 'dashboard.kpiTooltip.totalApplications',
  activeApplications: 'dashboard.kpiTooltip.activeApplications',
  interviewsScheduled: 'dashboard.kpiTooltip.interviewsScheduled',
  offersReceived: 'dashboard.kpiTooltip.offersReceived',
  rejections: 'dashboard.kpiTooltip.rejections',
  successRate: 'dashboard.kpiTooltip.successRate',
  responseRate: 'dashboard.kpiTooltip.responseRate',
  applicationStreak: 'dashboard.kpiTooltip.applicationStreak'
};

// Helper for KPI title with tooltip, RTL/LTR
const KpiTitleWithTooltip = ({
  label,
  tooltipKey,
  language
}: {
  label: string;
  tooltipKey: string;
  language: string;
}) => {
  const { t } = useTranslation();
  const isRTL = language === 'ar';

  if (isRTL) {
    return (
      <span
        style={{
          color: 'var(--text-color)',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          width: '100%',
          justifyContent: 'flex-start',
          fontFamily: "'Cairo', sans-serif'"
        }}
      >
        <Tooltip
          title={t(tooltipKey)}
          placement="left"
          styles={{ root: { direction: 'rtl', textAlign: 'right' } }}
        >
          <InfoCircleOutlined
            style={{
              color: 'var(--color-primary)',
              cursor: 'pointer',
              fontSize: '14px',
              marginLeft: '4px'
            }}
          />
        </Tooltip>
        <span>{label}</span>
      </span>
    );
  }

  return (
    <span
      style={{
        color: 'var(--text-color)',
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        width: '100%',
        justifyContent: 'space-between'
      }}
    >
      <span>{label}</span>
      <Tooltip title={t(tooltipKey)} placement="right">
        <InfoCircleOutlined
          style={{
            color: 'var(--color-primary)',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        />
      </Tooltip>
    </span>
  );
};

const Dashboard: React.FC = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { themeMode } = useTheme();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  // Responsive width
  const [width, setWidth] = useState(window.innerWidth);
  useEffect(() => {
    const onResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);
  const isMobile = width < 576;

  // View more/less KPIs
  const [expanded, setExpanded] = useState(false);

  // Greeting logic
  const getGreeting = () => {
    const hour = new Date().getHours();
    const greetings = language === 'ar' ? GREETINGS_AR : GREETINGS_EN;
    let timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night';
    if (hour >= 5 && hour < 12) timeOfDay = 'morning';
    else if (hour >= 12 && hour < 17) timeOfDay = 'afternoon';
    else if (hour >= 17 && hour < 22) timeOfDay = 'evening';
    else timeOfDay = 'night';
    const arr = greetings[timeOfDay];
    return arr[Math.floor(Math.random() * arr.length)];
  };

  const getMotivationQuote = () => {
    try {
      const quotes =
        i18n.getResourceBundle(language, 'translation')?.dashboard
          ?.motivationQuotes || [];
      if (Array.isArray(quotes) && quotes.length) {
        return quotes[Math.floor(Math.random() * quotes.length)];
      }
    } catch {
      //
    }
    return language === 'ar'
      ? "قد لا يكون اليوم أسهل يوم في رحلتك، لكنه الأمل الذي يُبنى عليه نجاح الغد."
      : "Today may not be the easiest day of your journey, but it's the hope on which tomorrow's success is built.";
  };

  const greeting = useMemo(() => getGreeting(), [language]);
  const motivationQuote = useMemo(
    () => getMotivationQuote(),
    [language, i18n]
  );

  // Fetch applications
  useEffect(() => {
    const fetchApplications = async () => {
      setLoading(true);
      try {
        const data = await applicationService.getAll();
        setApplications(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, []);

  // Statistics
  const totalApplications = applications.filter(a => a.status !== 'saved')
    .length;
  const activeApplications = applications.filter(a =>
    !['saved', 'accepted', 'rejected', 'declined'].includes(a.status)
  ).length;
  const interviewsScheduled = applications.filter(a =>
    ['phone_screen', 'interview', 'final_round'].includes(a.status)
  ).length;
  const offersReceived = applications.filter(a =>
    ['offer', 'negotiating', 'accepted'].includes(a.status)
  ).length;
  const rejections = applications.filter(a =>
    ['rejected', 'declined'].includes(a.status)
  ).length;
  const successRate =
    totalApplications > 0
      ? Math.round((offersReceived / totalApplications) * 100)
      : 0;
  const responseRate =
    totalApplications > 0
      ? Math.round(
          ((interviewsScheduled + offersReceived + rejections) /
            totalApplications) *
            100
        )
      : 0;

  // Streak
  const calculateStreak = () => {
    const filtered = applications
      .filter(a => a.status !== 'saved')
      .sort(
        (a, b) =>
          new Date(b.dateApplied).getTime() -
          new Date(a.dateApplied).getTime()
      );
    if (!filtered.length) return 0;
    const today = new Date().toISOString().split('T')[0];
    if (!filtered.some(a => a.dateApplied === today)) return 0;
    const dateSet = new Set(filtered.map(a => a.dateApplied));
    let streak = 1;
    let dt = new Date(today);
    while (true) {
      dt.setDate(dt.getDate() - 1);
      const ds = dt.toISOString().split('T')[0];
      if (dateSet.has(ds)) streak++;
      else break;
    }
    return streak;
  };
  const applicationStreak = calculateStreak();

  // Recent 5
  const recentApplications = useMemo(
    () =>
      [...applications]
        .sort(
          (a, b) =>
            new Date(b.updatedAt).getTime() -
            new Date(a.updatedAt).getTime()
        )
        .slice(0, 5),
    [applications]
  );

  // Pie chart data
  const pieChartData = useMemo(() => {
    const counts = applications.reduce(
      (acc, a) => {
        acc[a.status] = (acc[a.status] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );
    return Object.entries(counts)
      .filter(([, count]) => count > 0)
      .map(([status, count]) => ({
        name: t(`status.${status}`, status),
        value: count,
        status: status as ApplicationStatus
      }));
  }, [applications, t]);

  // Monthly trends
  const monthlyData = useMemo(() => {
    const monthMap = new Map<number, { name: string; applications: number }>();
    const names = [
      t('months.01'),
      t('months.02'),
      t('months.03'),
      t('months.04'),
      t('months.05'),
      t('months.06'),
      t('months.07'),
      t('months.08'),
      t('months.09'),
      t('months.10'),
      t('months.11'),
      t('months.12')
    ];
    names.forEach((nm, idx) =>
      monthMap.set(idx, { name: nm, applications: 0 })
    );
    applications
      .filter(a => a.status !== 'saved')
      .forEach(a => {
        const m = new Date(a.dateApplied).getMonth();
        const obj = monthMap.get(m)!;
        monthMap.set(m, { ...obj, applications: obj.applications + 1 });
      });
    return Array.from(monthMap.values());
  }, [applications, t]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'saved':
        return 'default';
      case 'applied':
      case 'assessment':
        return 'processing';
      case 'phone_screen':
        return 'processing';
      case 'interview':
      case 'final_round':
        return 'warning';
      case 'offer':
      case 'accepted':
        return 'success';
      case 'negotiating':
        return 'warning';
      case 'rejected':
      case 'declined':
        return 'error';
      default:
        return 'default';
    }
  };

  const [activePieIndex, setActivePieIndex] = useState<number | undefined>(
    undefined
  );

  const chartTheme = {
    backgroundColor: 'transparent',
    textColor: themeMode === 'dark' ? '#EEEEEE' : '#2C3E50',
    gridColor:
      themeMode === 'dark'
        ? 'rgba(255, 255, 255, 0.1)'
        : 'rgba(0, 0, 0, 0.1)',
    lineColor: themeMode === 'dark' ? '#76ABAE' : '#91d5ff',
    areaColor: themeMode === 'dark' ? '#76ABAE' : '#91d5ff',
    tooltipBackground:
      themeMode === 'dark'
        ? 'rgba(30, 30, 30, 0.95)'
        : 'rgba(255, 255, 255, 0.95)',
    tooltipText: themeMode === 'dark' ? '#FFFFFF' : '#2C3E50',
    pieColors:
      themeMode === 'dark'
        ? ['#76ABAE', '#69d5ce', '#5ec2bb', '#52afa9', '#448d88']
        : ['#91d5ff', '#69c0ff', '#40a9ff', '#1890ff', '#096dd9']
  };

  const cardStyles = {
    background: 'var(--card-bg)',
    headerColor: 'var(--text-color)',
    bodyColor: 'var(--text-color-secondary)',
    borderColor: 'var(--border-color)',
    titleFontWeight: 600,
    borderRadius: 'var(--radius-md)'
  };

  return (
    <div
      className={`dashboard-page ${language === 'ar' ? 'rtl' : 'ltr'}`}
      style={{
        background: 'var(--card-bg)',
        padding: '16px 24px 32px',
        minHeight: '100vh',
        direction: language === 'ar' ? 'rtl' : 'ltr'
      }}
    >
      <div
        className={`dashboard-header ${
          language === 'ar' ? 'text-right' : 'text-left'
        }`}
        style={{
          marginBottom: 'var(--spacing-lg)',
          textAlign: language === 'ar' ? 'right' : 'left',
          paddingBottom: '12px',
          borderBottom: `1px solid var(--border-color)`
        }}
      >
        <Title
          level={1}
          style={{
            color: cardStyles.headerColor,
            margin: '0 0 8px 0',
            fontSize: '28px',
            fontWeight: 600,
            lineHeight: 1.2
          }}
        >
          {greeting}
        </Title>
        <Title
          level={4}
          type="secondary"
          style={{
            color: cardStyles.bodyColor,
            fontWeight: 'normal',
            margin: 0,
            fontSize: '16px',
            lineHeight: 1.5
          }}
        >
          {motivationQuote}
        </Title>
      </div>

      <Spin spinning={loading}>
        {/* KPI Row */}
        <Row
          gutter={[16, 16]}
          className={`dashboard-stats${expanded ? ' expanded' : ''}`}
        >
          {/* Total Applications */}
          <Col xs={24} sm={12} md={8} xl={6}>
            <Card
              className="layout-card"
              style={{
                background: cardStyles.background,
                border: `1px solid ${cardStyles.borderColor}`,
                borderRadius: cardStyles.borderRadius,
                height: '100%',
                transition: 'all 0.3s ease'
              }}
              hoverable
            >
              <Statistic
                title={
                  <KpiTitleWithTooltip
                    label={t('dashboard.totalApplications')}
                    tooltipKey={KPI_TOOLTIPS.totalApplications}
                    language={language}
                  />
                }
                value={totalApplications}
                prefix={<FileOutlined style={{ color: cardStyles.headerColor }} />}
                valueStyle={{
                  color: cardStyles.headerColor,
                  fontSize: '28px',
                  fontWeight: 600
                }}
              />
            </Card>
          </Col>

          {/* Offers Received */}
          <Col xs={24} sm={12} md={8} xl={6}>
            <Card
              className="layout-card"
              style={{
                background: cardStyles.background,
                border: `1px solid ${cardStyles.borderColor}`,
                borderRadius: cardStyles.borderRadius,
                height: '100%',
                transition: 'all 0.3s ease'
              }}
              hoverable
            >
              <Statistic
                title={
                  <KpiTitleWithTooltip
                    label={t('dashboard.offersReceived')}
                    tooltipKey={KPI_TOOLTIPS.offersReceived}
                    language={language}
                  />
                }
                value={offersReceived}
                prefix={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
                valueStyle={{
                  color: '#52c41a',
                  fontSize: '28px',
                  fontWeight: 600
                }}
              />
            </Card>
          </Col>

          {/* Rejections */}
          <Col xs={24} sm={12} md={8} xl={6}>
            <Card
              className="layout-card"
              style={{
                background: cardStyles.background,
                border: `1px solid ${cardStyles.borderColor}`,
                borderRadius: cardStyles.borderRadius,
                height: '100%',
                transition: 'all 0.3s ease'
              }}
              hoverable
            >
              <Statistic
                title={
                  <KpiTitleWithTooltip
                    label={t('dashboard.rejections')}
                    tooltipKey={KPI_TOOLTIPS.rejections}
                    language={language}
                  />
                }
                value={rejections}
                prefix={<CloseCircleOutlined style={{ color: '#f5222d' }} />}
                valueStyle={{
                  color: '#f5222d',
                  fontSize: '28px',
                  fontWeight: 600
                }}
              />
            </Card>
          </Col>

          {/* Active Applications */}
          <Col xs={24} sm={12} md={8} xl={6}>
            <Card
              className="layout-card"
              style={{
                background: cardStyles.background,
                border: `1px solid ${cardStyles.borderColor}`,
                borderRadius: cardStyles.borderRadius,
                height: '100%',
                transition: 'all 0.3s ease'
              }}
              hoverable
            >
              <Statistic
                title={
                  <KpiTitleWithTooltip
                    label={t('dashboard.activeApplications')}
                    tooltipKey={KPI_TOOLTIPS.activeApplications}
                    language={language}
                  />
                }
                value={activeApplications}
                prefix={<BarChartOutlined style={{ color: cardStyles.headerColor }} />}
                valueStyle={{
                  color: cardStyles.headerColor,
                  fontSize: '28px',
                  fontWeight: 600
                }}
              />
            </Card>
          </Col>

          {/* Interviews Scheduled */}
          <Col xs={24} sm={12} md={8} xl={6}>
            <Card
              className="layout-card"
              style={{
                background: cardStyles.background,
                border: `1px solid ${cardStyles.borderColor}`,
                borderRadius: cardStyles.borderRadius,
                height: '100%',
                transition: 'all 0.3s ease'
              }}
              hoverable
            >
              <Statistic
                title={
                  <KpiTitleWithTooltip
                    label={t('dashboard.interviewsScheduled')}
                    tooltipKey={KPI_TOOLTIPS.interviewsScheduled}
                    language={language}
                  />
                }
                value={interviewsScheduled}
                prefix={<TeamOutlined style={{ color: cardStyles.headerColor }} />}
                valueStyle={{
                  color: cardStyles.headerColor,
                  fontSize: '28px',
                  fontWeight: 600
                }}
              />
            </Card>
          </Col>

          {/* Response Rate */}
          <Col xs={24} sm={12} md={8} xl={6}>
            <Card
              className="layout-card"
              style={{
                background: cardStyles.background,
                border: `1px solid ${cardStyles.borderColor}`,
                borderRadius: cardStyles.borderRadius
              }}
              hoverable
            >
              <Statistic
                title={
                  <KpiTitleWithTooltip
                    label={t('dashboard.responseRate')}
                    tooltipKey={KPI_TOOLTIPS.responseRate}
                    language={language}
                  />
                }
                value={responseRate}
                suffix="%"
                prefix={<LineChartOutlined style={{ color: cardStyles.headerColor }} />}
                valueStyle={{ color: cardStyles.headerColor }}
              />
            </Card>
          </Col>

          {/* Success Rate */}
          <Col xs={24} sm={12} md={8} xl={6}>
            <Card
              className="layout-card"
              style={{
                background: cardStyles.background,
                border: `1px solid ${cardStyles.borderColor}`,
                borderRadius: cardStyles.borderRadius
              }}
              hoverable
            >
              <Statistic
                title={
                  <KpiTitleWithTooltip
                    label={t('dashboard.successRate')}
                    tooltipKey={KPI_TOOLTIPS.successRate}
                    language={language}
                  />
                }
                value={successRate}
                suffix="%"
                prefix={<PieChartOutlined style={{ color: cardStyles.headerColor }} />}
                valueStyle={{ color: cardStyles.headerColor }}
              />
            </Card>
          </Col>

          {/* Application Streak */}
          <Col xs={24} sm={12} md={8} xl={6}>
            <Card
              className="layout-card"
              style={{
                background: cardStyles.background,
                border: `1px solid ${cardStyles.borderColor}`,
                borderRadius: cardStyles.borderRadius
              }}
              hoverable
            >
              <Statistic
                title={
                  <KpiTitleWithTooltip
                    label={t('dashboard.applicationStreak')}
                    tooltipKey={KPI_TOOLTIPS.applicationStreak}
                    language={language}
                  />
                }
                value={applicationStreak}
                suffix={
                  <span
                    style={{
                      color:
                        applicationStreak > 0 ? '#fa8c16' : cardStyles.headerColor
                    }}
                  >
                    {t('dashboard.days')}
                  </span>
                }
                prefix={
                  <FireOutlined
                    style={{
                      color:
                        applicationStreak > 0 ? '#fa8c16' : cardStyles.headerColor
                    }}
                  />
                }
                valueStyle={{
                  color:
                    applicationStreak > 0 ? '#fa8c16' : cardStyles.headerColor
                }}
              />
            </Card>
          </Col>
        </Row>

        {/* View More / Less for mobile */}
        {isMobile && (
          <div className="dashboard-toggle">
            <Button
              type="text"
              icon={expanded ? <UpOutlined /> : <DownOutlined />}
              onClick={() => setExpanded(x => !x)}
            >
              {expanded ? t('dashboard.viewLess') : t('dashboard.viewMore')}
            </Button>
          </div>
        )}

        {/* Recent Applications List */}
        <div style={{ marginTop: '32px' }}>
          <Card
            title={t('dashboard.recentApplications')}
            className="layout-card"
            style={{
              background: cardStyles.background,
              border: `1px solid ${cardStyles.borderColor}`,
              borderRadius: cardStyles.borderRadius,
              transition: 'all 0.2s ease'
            }}
            styles={{
              header: {
                color: cardStyles.headerColor,
                fontWeight: cardStyles.titleFontWeight,
                borderBottom: `1px solid ${cardStyles.borderColor}`,
                padding: '16px 20px'
              },
              body: { padding: '8px 16px' }
            }}
          >
            <List
              itemLayout="horizontal"
              dataSource={recentApplications}
              renderItem={app => {
                const diff =
                  Math.ceil(
                    (new Date().getTime() -
                      new Date(app.updatedAt).getTime()) /
                      (1000 * 60 * 60 * 24)
                  );
                const daysAgo =
                  diff === 0
                    ? t('dashboard.today')
                    : diff === 1
                    ? t('dashboard.yesterday')
                    : t('dashboard.daysAgo', { count: diff });

                return (
                  <List.Item
                    key={app.id}
                    onClick={() => navigate(`/applications/${app.id}`)}
                    className="recent-application-item"
                    style={{
                      borderBottom: `1px solid ${cardStyles.borderColor}`,
                      padding: '12px 8px',
                      cursor: 'pointer',
                      transition: 'background-color 0.2s ease'
                    }}
                  >
                    <List.Item.Meta
                      avatar={
                        <Avatar
                          style={{
                            backgroundColor:
                              STATUS_COLORS[
                                app.status as ApplicationStatus
                              ] || '#1890ff',
                            verticalAlign: 'middle'
                          }}
                        >
                          {app.company.charAt(0)}
                        </Avatar>
                      }
                      title={
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                          }}
                        >
                          <span style={{ color: cardStyles.headerColor }}>
                            {app.company} - {app.position}
                          </span>
                          <Badge
                            status={getStatusColor(app.status) as any}
                            text={
                              <span style={{ color: cardStyles.bodyColor }}>
                                {t(`status.${app.status}`)}
                              </span>
                            }
                          />
                        </div>
                      }
                      description={
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between'
                          }}
                        >
                          <Text style={{ color: cardStyles.bodyColor }}>
                            {app.location}
                          </Text>
                          <Text style={{ color: cardStyles.bodyColor }}>
                            {daysAgo}
                          </Text>
                        </div>
                      }
                    />
                  </List.Item>
                );
              }}
              locale={{
                emptyText: (
                  <div
                    style={{
                      color: chartTheme.textColor,
                      padding: '20px',
                      textAlign: 'center'
                    }}
                  >
                    {t('dashboard.noData')}
                  </div>
                )
              }}
            />
          </Card>
        </div>

        {/* Charts */}
        <div style={{ marginTop: '32px' }}>
          <Row gutter={[16, 16]}>
            {/* Status Distribution Pie */}
            <Col xs={24} lg={12}>
              <Card
                title={t('dashboard.statusDistribution')}
                className="layout-card"
                style={{
                  background: cardStyles.background,
                  border: `1px solid ${cardStyles.borderColor}`,
                  borderRadius: cardStyles.borderRadius,
                  height: '100%'
                }}
                styles={{
                  header: {
                    color: cardStyles.headerColor,
                    fontWeight: cardStyles.titleFontWeight,
                    borderBottom: `1px solid ${cardStyles.borderColor}`,
                    padding: '16px 20px'
                  },
                  body: {
                    padding: '16px',
                    height: 'calc(100% - 57px)'
                  }
                }}
              >
                {applications.length ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart style={{ backgroundColor: chartTheme.backgroundColor }}>
                      <defs>
                        <filter id="blur-filter">
                          <feGaussianBlur in="SourceGraphic" stdDeviation="1" />
                        </filter>
                        <filter id="active-glow">
                          <feGaussianBlur stdDeviation="3" result="blur" />
                          <feFlood floodColor="#3498db" floodOpacity="0.5" result="color" />
                          <feComposite in="color" in2="blur" operator="in" result="shadow" />
                          <feComposite in="SourceGraphic" in2="shadow" operator="over" />
                        </filter>
                        {pieChartData.map((entry, idx) => {
                          const base = chartTheme.pieColors[idx % chartTheme.pieColors.length];
                          return (
                            <radialGradient
                              key={`grad-${entry.status}`}
                              id={`pieGrad-${entry.status}`}
                              cx="50%"
                              cy="50%"
                              r="50%"
                              fx="50%"
                              fy="50%"
                            >
                              <stop offset="0%" stopColor={base} stopOpacity={0.9} />
                              <stop offset="85%" stopColor={base} stopOpacity={0.7} />
                              <stop offset="100%" stopColor={base} stopOpacity={0.6} />
                            </radialGradient>
                          );
                        })}
                      </defs>
                      <Pie
                        data={pieChartData}
                        cx="50%"
                        cy="50%"
                        label={false}
                        labelLine={false}
                        outerRadius={110}
                        innerRadius={5}
                        dataKey="value"
                        stroke={themeMode === 'dark' ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.1)'}
                        strokeWidth={2}
                        paddingAngle={3}
                        animationDuration={800}
                        animationEasing="ease-out"
                        activeIndex={activePieIndex}
                        activeShape={(props: any) => {
                          const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } = props;
                          return (
                            <g>
                              <Sector
                                cx={cx}
                                cy={cy}
                                innerRadius={innerRadius}
                                outerRadius={outerRadius + 8}
                                startAngle={startAngle}
                                endAngle={endAngle}
                                fill={fill}
                                opacity={0.95}
                                stroke={themeMode === 'dark' ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.2)'}
                                strokeWidth={2}
                                filter="url(#active-glow)"
                              />
                              <Sector
                                cx={cx}
                                cy={cy}
                                innerRadius={innerRadius - 3}
                                outerRadius={innerRadius - 1}
                                startAngle={startAngle}
                                endAngle={endAngle}
                                fill={fill}
                                opacity={0.9}
                                stroke={themeMode === 'dark' ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.2)'}  
                                strokeWidth={1}
                              />
                            </g>
                          );
                        }}
                        onMouseEnter={(_, idx) => setActivePieIndex(idx)}
                        onMouseLeave={() => setActivePieIndex(undefined)}
                      >
                        {pieChartData.map((entry, idx) => {
                          const base = chartTheme.pieColors[idx % chartTheme.pieColors.length];
                          STATUS_COLORS[entry.status] = base;
                          return (
                            <Cell
                              key={`cell-${entry.status}`}
                              fill={`url(#pieGrad-${entry.status})`}
                              filter="url(#blur-filter)"
                              strokeWidth={2}
                              stroke={themeMode === 'dark' ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.15)'}
                            />
                          );
                        })}
                      </Pie>
                      <RechartsTooltip
                        content={props => {
                          if (!props.active || !props.payload?.length) return null;
                          const data = props.payload[0].payload;
                          const value = data.value;
                          const statusName = t(`status.${data.status}`);
                          const percent = ((value / totalApplications) * 100).toFixed(1);
                          return (
                            <div
                              style={{
                                background: chartTheme.tooltipBackground,
                                padding: '8px 12px',
                                border: `2px solid ${
                                  themeMode === 'dark' ? '#76ABAE' : '#76A9FA'
                                }`,
                                borderRadius: '8px',
                                boxShadow: `0 2px 8px ${
                                  themeMode === 'dark'
                                    ? 'rgba(0,0,0,0.3)'
                                    : 'rgba(0,0,0,0.1)'
                                }`,
                                fontSize: '14px',
                                color: chartTheme.tooltipText
                              }}
                            >
                              <p style={{ margin: 0, fontWeight: 'bold', textTransform: 'capitalize' }}>
                                {statusName}
                              </p>
                              <p style={{ margin: 0 }}>
                                {value} {t('dashboard.applications')} ({percent}%)
                              </p>
                            </div>
                          );
                        }}
                        cursor={{ opacity: 0.1 }}
                        wrapperStyle={{ zIndex: 1000 }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div
                    className="chart-placeholder"
                    style={{
                      color: chartTheme.textColor,
                      height: '300px',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      fontSize: '14px',
                      backgroundColor: 'rgba(145,213,255,0.05)',
                      borderRadius: '12px',
                      border: '1px dashed rgba(145,213,255,0.3)'
                    }}
                  >
                    {t('dashboard.noData')}
                  </div>
                )}
              </Card>
            </Col>

            {/* Monthly Trends Area Chart */}
            <Col xs={24} lg={12}>
              <Card
                title={t('dashboard.monthlyTrends')}
                className="layout-card monthly-trends-card"
                style={{
                  background: cardStyles.background,
                  border: `1px solid ${cardStyles.borderColor}`,
                  borderRadius: cardStyles.borderRadius,
                  height: '100%'
                }}
                styles={{
                  header: {
                    color: cardStyles.headerColor,
                    fontWeight: cardStyles.titleFontWeight,
                    borderBottom: `1px solid ${cardStyles.borderColor}`,
                    padding: '16px 20px'
                  },
                  body: {
                    padding: '16px',
                    height: 'calc(100% - 57px)'
                  }
                }}
              >
                {applications.length ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart
                      data={monthlyData}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      style={{ backgroundColor: chartTheme.backgroundColor }}
                    >
                      <defs>
                        <linearGradient id="colorApplications" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={chartTheme.areaColor} stopOpacity={0.8} />
                          <stop offset="95%" stopColor={chartTheme.areaColor} stopOpacity={0.1} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke={chartTheme.gridColor} vertical={false} opacity={0.4} />
                      <XAxis
                        dataKey="name"
                        stroke={chartTheme.textColor}
                        angle={isMobile ? 0 : -15}
                        textAnchor={isMobile ? 'middle' : 'end'}
                        tick={{ fill: chartTheme.textColor, fontSize: isMobile ? 10 : 12 }}
                        axisLine={{ stroke: 'transparent' }}
                        tickLine={{ stroke: 'transparent' }}
                        interval={isMobile ? Math.ceil(monthlyData.length / 4) : 0}
                      />
                      <YAxis
                        stroke={chartTheme.textColor}
                        tick={{ fill: chartTheme.textColor, fontSize: 12 }}
                        axisLine={{ stroke: 'transparent' }}
                        tickLine={{ stroke: 'transparent' }}
                        tickCount={5}
                      />
                      <RechartsTooltip
                        contentStyle={{
                          backgroundColor: chartTheme.tooltipBackground,
                          color: chartTheme.tooltipText,
                          border: 'none',
                          borderRadius: '8px',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                          padding: '8px 12px'
                        }}
                        animationDuration={300}
                        cursor={{
                          stroke: chartTheme.lineColor,
                          strokeWidth: 1,
                          strokeOpacity: 0.5
                        }}
                      />
                      <Legend
                        wrapperStyle={{ color: chartTheme.textColor }}
                        formatter={value => (
                          <span style={{ color: chartTheme.textColor, fontSize: 12 }}>
                            {value}
                          </span>
                        )}
                        iconType="circle"
                        iconSize={8}
                      />
                      <Area
                        type="monotone"
                        dataKey="applications"
                        stroke={chartTheme.lineColor}
                        fill="url(#colorApplications)"
                        activeDot={{ r: 6, strokeWidth: 0 }}
                        name={t('dashboard.applications')}
                        dot={false}
                        strokeWidth={2}
                        animationDuration={1000}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div
                    className="chart-placeholder"
                    style={{
                      color: chartTheme.textColor,
                      height: '300px',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      fontSize: '16px'
                    }}
                  >
                    {t('dashboard.noData')}
                  </div>
                )}
              </Card>
            </Col>
          </Row>
        </div>
      </Spin>
    </div>
  );
};

export default Dashboard;
