// src/styles/styled.d.ts
import 'styled-components';
import type { ThemeConfig } from 'antd/es/config-provider';

declare module 'styled-components' {
  export interface DefaultTheme {
    // now guaranteed to exist
    token: {
      colorPrimary: string;
      colorSuccess: string;
      colorWarning: string;
      colorError: string;
      colorInfo: string;
      colorBgContainer: string;
      colorText: string;
      borderRadius: number;
      boxShadowSecondary: string;
    };
    // reuse Ant’s own shape for component overrides
    components?: ThemeConfig['components'];
  }
}
