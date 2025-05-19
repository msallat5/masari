// src/components/Layout.tsx
import React, { useState, useEffect } from 'react';
import { Layout as AntLayout, Menu, Button, theme, Image } from 'antd';
import {
  DashboardOutlined,
  FileOutlined,
  CalendarOutlined,
  SettingOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  MoonOutlined,
  SunOutlined,
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import styled, { createGlobalStyle, ThemeProvider } from 'styled-components';
import { useTheme } from '../hooks/useTheme';
import { useLanguage } from '../hooks/useLanguage';
import { useNavigation } from '../hooks/useNavigation';
import logo from '../assets/masari-logo.svg';

const { Header, Sider, Content } = AntLayout;

const GlobalStyle = createGlobalStyle`
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body, #root { height: 100%; font-family: 'Cairo', sans-serif; background: var(--bg); color: var(--text); }

  @media (max-width: 768px) {
    .mobile-nav-menu .ant-menu-item .ant-menu-title-content { display: none; }
  }
`;

const StyledLayout = styled(AntLayout)<{ dir: 'ltr' | 'rtl' }>`
  min-height: 100vh;
  direction: ${p => p.dir};
  --bg: ${p => p.theme.token.colorBgContainer};
  --card-bg: ${p => p.theme.token.colorBgContainer};
  --shadow-sm: ${p => p.theme.token.boxShadowSecondary || '0 1px 4px rgba(0,0,0,0.1)'};
  --radius-md: ${p => p.theme.token.borderRadius}px;
  --color-primary: ${p => p.theme.token.colorPrimary};
  --text: ${p => p.theme.token.colorText};
`;

const StyledHeader = styled(Header)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1.5rem;
  background: var(--card-bg);
  position: sticky;
  top: 0;
  z-index: 10;
  box-shadow: var(--shadow-sm);
  height: 64px;
`;

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const LogoText = styled.span`
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--color-primary);
  white-space: nowrap;
`;

const MainContent = styled(Content)`
  margin: 2rem;
  padding: 2rem;
  background: var(--card-bg);
  border-radius: var(--radius-md);
  overflow: auto;

  @media (max-width: 768px) {
    margin: 1rem;
    padding: 1.25rem;
    margin-bottom: calc(56px + 1rem);
  }
`;

const HeaderButtons = styled.div<{ dir: 'ltr' | 'rtl' }>`
  display: flex;
  gap: 1rem;

  @media (max-width: 768px) {
    position: absolute;
    ${({ dir }) => (dir === 'ltr' ? 'right: 1.5rem;' : 'left: 1.5rem;')}
  }
`;

const CircleButton = styled(Button)`
  width: 2.5rem !important;
  height: 2.5rem !important;
  border-radius: 50% !important;
  padding: 0 !important;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  border: 2px solid transparent;

  &:hover {
    box-shadow: 0 0 8px var(--color-primary);
    border-color: var(--color-primary);
  }

  & .anticon {
    margin: 0;
    line-height: 1;
    display: block;
  }

  &.theme-toggle-btn:hover {
    transform: rotate(30deg);
  }
`;

const MobileNav = styled.div`
  position: fixed;
  bottom: 0; left: 0; right: 0;
  z-index: 100;
  background: var(--card-bg);
  display: flex;
  justify-content: space-around;
  padding: 0.75rem 0 0.5rem;
  height: 56px;
  border-top-left-radius: var(--radius-md);
  border-top-right-radius: var(--radius-md);
  border-top: 2px solid var(--color-primary);
  box-shadow:
    0 -2px 8px rgba(0, 0, 0, 0.06),
    0 -4px 12px var(--color-primary);
`;

interface LayoutProps { children: React.ReactNode; }

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { t } = useTranslation();
  const { toggleTheme, themeMode } = useTheme();
  const { toggleLanguage, language } = useLanguage();
  const { currentPage, handleMenuClick } = useNavigation();
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const { token } = theme.useToken();

  const styledTheme = {
    token: { ...token, boxShadowSecondary: token.boxShadowSecondary ?? '0 1px 4px rgba(0,0,0,0.1)' }
  };
  const dir = language === 'ar' ? 'rtl' : 'ltr';

  useEffect(() => {
    const onResize = () => {
      const small = window.innerWidth < 768;
      setIsMobile(small);
      if (small) setCollapsed(true);
    };
    window.addEventListener('resize', onResize);
    onResize();
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const menuItems = [
    { key: 'dashboard', icon: <DashboardOutlined style={{ fontSize: '1.2rem' }} />, label: t('nav.dashboard') },
    { key: 'applications', icon: <FileOutlined style={{ fontSize: '1.2rem' }} />, label: t('nav.applications') },
    { key: 'calendar', icon: <CalendarOutlined style={{ fontSize: '1.2rem' }} />, label: t('nav.calendar') },
    { key: 'settings', icon: <SettingOutlined style={{ fontSize: '1.2rem' }} />, label: t('nav.settings') },
  ];

  const mobileLayout = (
    <StyledLayout dir={dir} theme={styledTheme}>
      <GlobalStyle />
      <StyledHeader>
        <LogoContainer>
          <Image
            src={logo}
            alt="Logo"
            width={32}
            preview={false}
            style={{ filter: themeMode === 'dark' ? 'brightness(1.2)' : 'none' }}
          />
          <LogoText>{t('app.title')}</LogoText>
        </LogoContainer>
        <HeaderButtons dir={dir}>
          <CircleButton
            type="text"
            icon={themeMode === 'dark' ? <SunOutlined style={{ fontSize: '1.2rem' }} /> : <MoonOutlined style={{ fontSize: '1.2rem' }} />}
            onClick={toggleTheme}
            className="theme-toggle-btn"
          />
          <CircleButton type="text" onClick={toggleLanguage} className="lang-toggle-btn">
            <i className="bi bi-globe2" style={{ fontSize: '1.2rem' }} />
          </CircleButton>
        </HeaderButtons>
      </StyledHeader>
      <MainContent>{children}</MainContent>
      <MobileNav>
        <Menu
          mode="horizontal"
          items={menuItems}
          selectedKeys={[currentPage]}
          onClick={({ key }) => handleMenuClick(key as string)}
          className="mobile-nav-menu"
          style={{ width: '100%', display: 'flex', justifyContent: 'space-around', background: 'transparent', border: 'none' }}
          disabledOverflow
        />
      </MobileNav>
    </StyledLayout>
  );

  const desktopLayout = (
    <StyledLayout dir={dir} theme={styledTheme}>
      <GlobalStyle />
      <Sider
        collapsible
        collapsed={collapsed}
        trigger={null}
        width={220}
        style={{ background: 'var(--card-bg)', boxShadow: 'var(--shadow-sm)', position: 'fixed', height: '100vh', [dir === 'rtl' ? 'right' : 'left']: 0, zIndex: 20 }}
      >
        <LogoContainer style={{ justifyContent: 'center', padding: '1rem 0', width: '100%' }}>
          <Image
            src={logo}
            alt="Logo"
            width={collapsed ? 32 : 36}
            preview={false}
            style={{ filter: themeMode === 'dark' ? 'brightness(1.2)' : 'none' }}
          />
          {!collapsed && <LogoText>{t('app.title')}</LogoText>}
        </LogoContainer>
        <Menu
          mode="inline"
          items={menuItems}
          selectedKeys={[currentPage]}
          onClick={({ key }) => handleMenuClick(key as string)}
          style={{ fontSize: '1.1rem', borderInlineEnd: 'none' }}
        />
      </Sider>
      <AntLayout style={{ transition: 'margin 0.2s', [dir === 'rtl' ? 'marginRight' : 'marginLeft']: collapsed ? '80px' : '220px' }}>
        <StyledHeader>
          <Button
            type="text"
            onClick={() => setCollapsed(!collapsed)}
            icon={collapsed ? <MenuUnfoldOutlined style={{ fontSize: '1.2rem' }} /> : <MenuFoldOutlined style={{ fontSize: '1.2rem' }} />}
            style={{ transform: dir === 'rtl' ? 'scaleX(-1)' : undefined }}
          />
          <HeaderButtons dir={dir}>
            <CircleButton
              type="text"
              onClick={toggleTheme}
              icon={themeMode === 'dark' ? <SunOutlined style={{ fontSize: '1.2rem' }} /> : <MoonOutlined style={{ fontSize: '1.2rem' }} />}
              className="theme-toggle-btn"
            />
            <CircleButton type="text" onClick={toggleLanguage} className="lang-toggle-btn">
              <i className="bi bi-globe2" style={{ fontSize: '1.2rem' }} />
            </CircleButton>
          </HeaderButtons>
        </StyledHeader>
        <MainContent>{children}</MainContent>
      </AntLayout>
    </StyledLayout>
  );

  return <ThemeProvider theme={styledTheme}>{isMobile ? mobileLayout : desktopLayout}</ThemeProvider>;
};

export default Layout;
