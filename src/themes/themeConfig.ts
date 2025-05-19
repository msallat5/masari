// src/themes/themeConfig.ts
import type { ThemeConfig } from 'antd';
import { theme } from 'antd';
import type { ApplicationStatus } from '../types/application';

// Define status colors for consistent usage throughout the app
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

// Light theme specific values for charts, cards, etc.
export const LIGHT_THEME_COLORS = {
  // Base colors
  backgroundColor: '#F8FAFC',
  cardBackground:   '#FFFFFF',
  headerColor:      '#2C3E50',
  bodyColor:        '#4A5568',
  borderColor:      '#E2E8F0',
  
  // Chart specific
  chartBackground:  '#FFFFFF',
  chartText:        '#2C3E50',
  chartGrid:        '#E2E8F0',
  chartLine:        '#76A9FA',
  tooltipBackground:'#FFFFFF',
  tooltipText:      '#2C3E50',
  
  // Typography
  titleFontWeight:  600,
  fontFamily:       "'Helvetica Neue', sans-serif",
  fontFamilyArabic: "'Cairo', sans-serif",
  
  // Borders and shapes
  borderRadius:     '10px',
  
  // Hover states
  hoverBackground:  '#EBF8FF',
  hoverBorder:      '#76A9FA',
};

// Dark theme specific values for charts, cards, etc.
export const DARK_THEME_COLORS = {
  // Base colors
  backgroundColor: '#121212',
  cardBackground:   '#1E1E1E',
  headerColor:      '#FFFFFF',
  bodyColor:        '#CCCCCC',
  borderColor:      '#333333',
  
  // Chart specific
  chartBackground:  '#1E1E1E',
  chartText:        '#EEEEEE',
  chartGrid:        '#333333',
  chartLine:        '#76ABAE',
  tooltipBackground:'#242424',
  tooltipText:      '#EEEEEE',
  
  // Typography
  titleFontWeight:  600,
  fontFamily:       "'Helvetica Neue', sans-serif",
  fontFamilyArabic: "'Cairo', sans-serif",
  
  // Borders and shapes
  borderRadius:     '10px',
  
  // Hover states
  hoverBackground:  '#333333',
  hoverBorder:      '#76ABAE',
};

export const lightTheme: ThemeConfig = {
  token: {
    colorPrimary:   '#76A9FA',
    colorSuccess:   '#52c41a',
    colorWarning:   '#faad14',
    colorError:     '#f5222d',
    colorInfo:      '#76A9FA',
    borderRadius:   16,
    wireframe:      false,
    colorBgBase:    '#F8FAFC',
    colorTextBase:  '#2C3E50',
    fontFamily:     LIGHT_THEME_COLORS.fontFamily,
  },
  components: {
    Card: {
      borderRadiusLG:        16,
      colorBgContainer:      '#FFFFFF',
      boxShadow:             '0 1px 3px rgba(0, 0, 0, 0.05)',
      colorBorderSecondary:  LIGHT_THEME_COLORS.borderColor,
    },
    Button: {
      borderRadius:      8,
      controlOutline:    'rgba(118, 169, 250, 0.2)',
    },
    Layout: {
      bodyBg:            '#F8FAFC',  // ← renamed from colorBgBody
      headerBg:          '#FFFFFF',  // ← renamed from colorBgHeader
      colorBgContainer:  '#FFFFFF',  // ← stays the same
    },
    Menu: {
      itemBg:            'transparent', // ← renamed from colorItemBg
      colorActiveBarBorderSize: 0,      // ← unchanged
      itemColor:         '#4A5568',     // ← renamed from colorItemText
      itemHoverColor:    '#2C3E50',     // ← renamed from colorItemTextHover
      itemSelectedColor: '#2C3E50',     // ← renamed from colorItemTextSelected
    },
    Table: {
      colorBgContainer:  '#FFFFFF',
      headerBg:          '#F1F7FD',
      headerColor:       '#2C3E50',
      headerSortActiveBg:'#D9EAFD',
      headerSortHoverBg: '#D9EAFD',
      rowHoverBg:        '#EBF8FF',
      borderColor:       '#E2E8F0',
    },
    Input: {
      colorBgContainer:  '#FFFFFF',
      activeBorderColor: '#76A9FA',
      hoverBorderColor:  '#76A9FA',
      colorBorder:       '#E2E8F0',
    },
    Select: {
      colorBgContainer:  '#FFFFFF',
      optionSelectedBg:  'rgba(118, 169, 250, 0.1)',
      optionActiveBg:    'rgba(118, 169, 250, 0.1)',
    },
    Modal: {
      contentBg:         '#FFFFFF',
      headerBg:          '#FFFFFF',
    },
    Statistic: {
      colorText:              '#2C3E50',
      colorTextDescription:   '#4A5568',
    },
    Typography: {
      colorTextHeading:   '#2C3E50',
      colorTextSecondary: '#4A5568',
    },
    List: {
      colorBgContainer:   '#FFFFFF',
      colorText:          '#2C3E50',
      colorTextSecondary:'#4A5568',
    },
    Form: {
      labelColor:         '#2C3E50',
      itemMarginBottom:   24,
    },
    Radio: {
      colorPrimary:       '#76A9FA',
    },
    Switch: {
      colorPrimary:       '#76A9FA',
    },
    Divider: {
      colorSplit:         '#E2E8F0',
    },
    Pagination: {
      colorPrimary:       '#76A9FA',
      colorBgContainer:   '#FFFFFF',
    },
  },
};

export const darkTheme: ThemeConfig = {
  token: {
    colorPrimary:   '#76ABAE',
    colorSuccess:   '#52c41a',
    colorWarning:   '#faad14',
    colorError:     '#f5222d',
    colorInfo:      '#76ABAE',
    borderRadius:   16,
    wireframe:      false,
    colorBgBase:    '#121212',
    colorTextBase:  '#EEEEEE',
    fontFamily:     DARK_THEME_COLORS.fontFamily,
  },
  components: {
    Card: {
      borderRadiusLG:        16,
      colorBgContainer:      DARK_THEME_COLORS.cardBackground,
      boxShadow:             '0 1px 3px rgba(0, 0, 0, 0.3)',
      headerBg:              DARK_THEME_COLORS.cardBackground,
      colorBorderSecondary:  DARK_THEME_COLORS.borderColor,
    },
    Button: {
      borderRadius:      8,
      controlOutline:    'rgba(118, 171, 174, 0.2)',
    },
    Layout: {
      bodyBg:            DARK_THEME_COLORS.backgroundColor, // ← was colorBgBody
      headerBg:          DARK_THEME_COLORS.cardBackground,  // ← was colorBgHeader
      colorBgContainer:  DARK_THEME_COLORS.cardBackground,
    },
    Menu: {
      itemBg:            'transparent',    // ← was colorItemBg
      colorActiveBarBorderSize: 0,
      itemColor:         '#CCCCCC',        // ← was colorItemText
      itemHoverColor:    '#FFFFFF',        // ← was colorItemTextHover
      itemSelectedColor: '#FFFFFF',        // ← was colorItemTextSelected
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
      activeBorderColor: '#76ABAE',
      hoverBorderColor:  '#76ABAE',
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
      colorText:              DARK_THEME_COLORS.headerColor,
      colorTextDescription:   DARK_THEME_COLORS.bodyColor,
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
    Radio: {
      colorPrimary:       '#76ABAE',
    },
    Switch: {
      colorPrimary:       '#76ABAE',
    },
    Divider: {
      colorSplit:         '#333333',
    },
    Pagination: {
      colorPrimary:       '#76ABAE',
      colorBgContainer:   DARK_THEME_COLORS.cardBackground,
    },
  },
  algorithm: theme.darkAlgorithm,
};
