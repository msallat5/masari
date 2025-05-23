import 'styled-components';
import type { ThemeConfig } from 'antd/es/config-provider';

/**
 * Augment the DefaultTheme interface from styled-components
 * to include Ant Design theme tokens and optional component overrides.
 */
declare module 'styled-components' {
  export interface DefaultTheme {
    /**
     * Ant Design design tokens—always present on the theme.
     */
    token: {
      /** Primary brand color */
      colorPrimary: string;
      /** Success state color */
      colorSuccess: string;
      /** Warning state color */
      colorWarning: string;
      /** Error state color */
      colorError: string;
      /** Informational color (e.g. for tooltips) */
      colorInfo: string;
      /** Background color for containers */
      colorBgContainer: string;
      /** Default text color */
      colorText: string;
      /** Standard border radius applied to components */
      borderRadius: number;
      /** Secondary box-shadow style for elevated elements */
      boxShadowSecondary: string;
    };
    
    /**
     * Optional per-component theme overrides.
     * Reuses Ant Design's ThemeConfig['components'] structure.
     */
    components?: ThemeConfig['components'];
  }
}
