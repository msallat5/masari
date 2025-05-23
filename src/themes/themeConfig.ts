import type { ThemeConfig } from 'antd';
import { theme as antdTheme } from 'antd';
import type { ApplicationStatus } from '../types/application';

/**
 * Consistent status colors for applications.
 */
export const STATUS_COLORS: Record<ApplicationStatus, string> = {
  saved: '#d9d9d9',
  applied: '#1890ff',
  phone_screen: '#13c2c2',
  interview: '#faad14',
  assessment: '#722ed1',
  final_round: '#2f54eb',
  offer: '#52c41a',
  negotiating: '#fa8c16',
  accepted: '#389e0d',
  rejected: '#f5222d',
  declined: '#cf1322',
};

/**
 * Light-mode palette for custom charts, cards, typography, etc.
 */
export const LIGHT_THEME_COLORS = {
  // Layout
  backgroundColor: '#F8FAFC',
  cardBackground:   '#FFFFFF',
  borderColor:      '#E2E8F0',

  // Typography
  headerColor:      '#2C3E50',
  bodyColor:        '#4A5568',
  titleFontWeight:  600,
  fontFamily:       "'Helvetica Neue', sans-serif",
  fontFamilyArabic: "'Cairo', sans-serif",

  // Charts
  chartBackground:  '#FFFFFF',
  chartText:        '#2C3E50',
  chartGrid:        '#E2E8F0',
  chartLine:        '#76A9FA',
  tooltipBackground:'#FFFFFF',
  tooltipText:      '#2C3E50',

  // Borders & shapes
  borderRadius:     '10px',

  // Hover states
  hoverBackground:  '#EBF8FF',
  hoverBorder:      '#76A9FA',
};

/**
 * Dark-mode palette for custom charts, cards, typography, etc.
 */
export const DARK_THEME_COLORS = {
  // Layout
  backgroundColor: '#121212',
  cardBackground:   '#1E1E1E',
  borderColor:      '#333333',

  // Typography
  headerColor:      '#FFFFFF',
  bodyColor:        '#CCCCCC',
  titleFontWeight:  600,
  fontFamily:       "'Helvetica Neue', sans-serif",
  fontFamilyArabic: "'Cairo', sans-serif",

  // Charts
  chartBackground:  '#1E1E1E',
  chartText:        '#EEEEEE',
  chartGrid:        '#333333',
  chartLine:        '#76ABAE',
  tooltipBackground:'#242424',
  tooltipText:      '#EEEEEE',

  // Borders & shapes
  borderRadius:     '10px',

  // Hover states
  hoverBackground:  '#333333',
  hoverBorder:      '#76ABAE',
};

/**
 * Ant Design theme configuration for light mode.
 */
export const lightTheme: ThemeConfig = {
  token: {
    // Core tokens
    colorPrimary:   '#76A9FA',
    colorSuccess:   '#52c41a',
    colorWarning:   '#faad14',
    colorError:     '#f5222d',
    colorInfo:      '#76A9FA',

    // Typography & shape
    fontFamily:     LIGHT_THEME_COLORS.fontFamily,
    borderRadius:   16,

    // Background & text
    colorBgBase:    LIGHT_THEME_COLORS.backgroundColor,
    colorTextBase:  LIGHT_THEME_COLORS.headerColor,
  },
  components: {
    // Card overrides
    Card: {
      borderRadiusLG:       16,
      colorBgContainer:     LIGHT_THEME_COLORS.cardBackground,
      boxShadow:            '0 1px 3px rgba(0, 0, 0, 0.05)',
      colorBorderSecondary: LIGHT_THEME_COLORS.borderColor,
    },
    // Button overrides
    Button: {
      borderRadius:     8,
      controlOutline:   'rgba(118, 169, 250, 0.2)',
    },
    // Layout overrides
    Layout: {
      bodyBg:           LIGHT_THEME_COLORS.backgroundColor,
      headerBg:         LIGHT_THEME_COLORS.cardBackground,
      colorBgContainer: LIGHT_THEME_COLORS.cardBackground,
    },
    // Menu overrides
    Menu: {
      itemBg:             'transparent',
      itemColor:          LIGHT_THEME_COLORS.bodyColor,
      itemHoverColor:     LIGHT_THEME_COLORS.headerColor,
      itemSelectedColor:  LIGHT_THEME_COLORS.headerColor,
      colorActiveBarBorderSize: 0,
    },
    // Table overrides
    Table: {
      colorBgContainer:  LIGHT_THEME_COLORS.cardBackground,
      headerBg:          '#F1F7FD',
      headerColor:       LIGHT_THEME_COLORS.headerColor,
      headerSortActiveBg:'#D9EAFD',
      headerSortHoverBg: '#D9EAFD',
      rowHoverBg:        LIGHT_THEME_COLORS.hoverBackground,
      borderColor:       LIGHT_THEME_COLORS.borderColor,
    },
    // Input overrides
    Input: {
      colorBgContainer:  LIGHT_THEME_COLORS.cardBackground,
      activeBorderColor: LIGHT_THEME_COLORS.chartLine,
      hoverBorderColor:  LIGHT_THEME_COLORS.chartLine,
      colorBorder:       LIGHT_THEME_COLORS.borderColor,
    },
    // Select overrides
    Select: {
      colorBgContainer:  LIGHT_THEME_COLORS.cardBackground,
      optionSelectedBg:  'rgba(118, 169, 250, 0.1)',
      optionActiveBg:    'rgba(118, 169, 250, 0.1)',
    },
    // Modal overrides
    Modal: {
      contentBg:         LIGHT_THEME_COLORS.cardBackground,
      headerBg:          LIGHT_THEME_COLORS.cardBackground,
    },
    // Statistic overrides
    Statistic: {
      colorText:            LIGHT_THEME_COLORS.headerColor,
      colorTextDescription: LIGHT_THEME_COLORS.bodyColor,
    },
    // Typography overrides
    Typography: {
      colorTextHeading:   LIGHT_THEME_COLORS.headerColor,
      colorTextSecondary: LIGHT_THEME_COLORS.bodyColor,
    },
    // List overrides
    List: {
      colorBgContainer:   LIGHT_THEME_COLORS.cardBackground,
      colorText:          LIGHT_THEME_COLORS.headerColor,
      colorTextSecondary: LIGHT_THEME_COLORS.bodyColor,
    },
    // Form overrides
    Form: {
      labelColor:         LIGHT_THEME_COLORS.headerColor,
      itemMarginBottom:   24,
    },
    // Radio & Switch
    Radio: { colorPrimary: LIGHT_THEME_COLORS.chartLine },
    Switch: { colorPrimary: LIGHT_THEME_COLORS.chartLine },
    // Divider & Pagination
    Divider:    { colorSplit: LIGHT_THEME_COLORS.borderColor },
    Pagination: {
      colorPrimary:     LIGHT_THEME_COLORS.chartLine,
      colorBgContainer: LIGHT_THEME_COLORS.cardBackground,
    },
  },
};

/**
 * Ant Design theme configuration for dark mode.
 */
export const darkTheme: ThemeConfig = {
  token: {
    // Core tokens
    colorPrimary:   '#76ABAE',
    colorSuccess:   '#52c41a',
    colorWarning:   '#faad14',
    colorError:     '#f5222d',
    colorInfo:      '#76ABAE',

    // Typography & shape
    fontFamily:     DARK_THEME_COLORS.fontFamily,
    borderRadius:   16,

    // Background & text
    colorBgBase:    DARK_THEME_COLORS.backgroundColor,
    colorTextBase:  DARK_THEME_COLORS.headerColor,
  },
  components: {
    Card: {
      borderRadiusLG:       16,
      colorBgContainer:     DARK_THEME_COLORS.cardBackground,
      boxShadow:            '0 1px 3px rgba(0, 0, 0, 0.3)',
      headerBg:             DARK_THEME_COLORS.cardBackground,
      colorBorderSecondary: DARK_THEME_COLORS.borderColor,
    },
    Button: {
      borderRadius:     8,
      controlOutline:   'rgba(118, 171, 174, 0.2)',
    },
    Layout: {
      bodyBg:           DARK_THEME_COLORS.backgroundColor,
      headerBg:         DARK_THEME_COLORS.cardBackground,
      colorBgContainer: DARK_THEME_COLORS.cardBackground,
    },
    Menu: {
      itemBg:             'transparent',
      itemColor:          DARK_THEME_COLORS.bodyColor,
      itemHoverColor:     DARK_THEME_COLORS.headerColor,
      itemSelectedColor:  DARK_THEME_COLORS.headerColor,
      colorActiveBarBorderSize: 0,
    },
    Table: {
      colorBgContainer:  DARK_THEME_COLORS.cardBackground,
      headerBg:          '#2A2A2A',
      headerColor:       DARK_THEME_COLORS.headerColor,
      headerSortActiveBg:'#333333',
      headerSortHoverBg: '#333333',
      rowHoverBg:        DARK_THEME_COLORS.hoverBackground,
      borderColor:       'rgba(255, 255, 255, 0.08)',
    },
    Input: {
      colorBgContainer:  DARK_THEME_COLORS.cardBackground,
      activeBorderColor: DARK_THEME_COLORS.chartLine,
      hoverBorderColor:  DARK_THEME_COLORS.chartLine,
      colorBorder:       'rgba(255, 255, 255, 0.15)',
    },
    Select: {
      colorBgContainer:  DARK_THEME_COLORS.cardBackground,
      optionSelectedBg:  'rgba(118, 171, 174, 0.2)',
      optionActiveBg:    'rgba(118, 171, 174, 0.2)',
    },
    Modal: {
      contentBg:         DARK_THEME_COLORS.cardBackground,
      headerBg:          DARK_THEME_COLORS.cardBackground,
    },
    Statistic: {
      colorText:            DARK_THEME_COLORS.headerColor,
      colorTextDescription: DARK_THEME_COLORS.bodyColor,
    },
    Typography: {
      colorTextHeading:   DARK_THEME_COLORS.headerColor,
      colorTextSecondary: DARK_THEME_COLORS.bodyColor,
    },
    List: {
      colorBgContainer:   DARK_THEME_COLORS.cardBackground,
      colorText:          DARK_THEME_COLORS.headerColor,
      colorTextSecondary: DARK_THEME_COLORS.bodyColor,
    },
    Form: {
      labelColor:         DARK_THEME_COLORS.headerColor,
      itemMarginBottom:   24,
    },
    Radio:  { colorPrimary: DARK_THEME_COLORS.chartLine },
    Switch: { colorPrimary: DARK_THEME_COLORS.chartLine },
    Divider:    { colorSplit: DARK_THEME_COLORS.borderColor },
    Pagination: {
      colorPrimary:     DARK_THEME_COLORS.chartLine,
      colorBgContainer: DARK_THEME_COLORS.cardBackground,
    },
  },
  // Use Ant Design's built-in dark algorithm
  algorithm: antdTheme.darkAlgorithm,
};
