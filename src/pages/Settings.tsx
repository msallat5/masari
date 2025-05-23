import React from 'react';
import { Typography, Card, Switch, Radio, Space } from 'antd';
import { LinkedinFilled, GithubOutlined, BehanceSquareFilled } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { useTheme } from '../hooks/useTheme';
import { useLanguage } from '../hooks/useLanguage';
import type { RadioChangeEvent } from 'antd';

const { Title, Text } = Typography;

/** Full-width page container with padding */
const SettingsContainer = styled.div`
  width: 100%;
  padding: 20px;
`;

/** Card wrapper with custom border-radius and shadow */
const SettingsCard = styled(Card)`
  width: 100%;
  border-radius: 12px;
  box-shadow:
    0 1px 2px rgba(0, 0, 0, 0.03),
    0 1px 6px -1px rgba(0, 0, 0, 0.02);
`;

/** Row for each setting: flex layout, stacks on small screens */
const SettingItem = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 16px 0;

  &:not(:last-child) {
    border-bottom: 1px solid rgba(255,255,255,0.12);
  }

  @media (max-width: 576px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

/** Wraps label and description text */
const TextWrapper = styled.div`
  flex: 1;
  margin-right: 24px;

  @media (max-width: 576px) {
    width: 100%;
    margin-right: 0;
    margin-bottom: 12px;
  }
`;

/** Styled label for each setting */
const SettingLabel = styled(Text)`
  display: block;
  font-weight: 500;
  margin-bottom: 4px;
`;

/** Styled description under each label */
const SettingDescription = styled(Text)`
  display: block;
  opacity: 0.7;
`;

/** Wrapper for each control element */
const ControlWrapper = styled.div`
  display: flex;
  align-items: center;

  @media (max-width: 576px) {
    width: 100%;
    justify-content: flex-start;
  }
`;

/** Footer with separator lines and social links */
const Footer = styled.div`
  margin-top: 32px;
  padding-top: 16px;
  border-top: 1px solid rgba(255,255,255,0.12);
  text-align: center;
  font-size: 18px;

  .line {
    margin: 4px 0;
  }

  .links {
    display: inline-flex;
    justify-content: center;
    gap: 16px;
    margin-top: 12px;
  }

  a {
    color: inherit;
    font-size: 18px;

    svg {
      font-size: 24px;
      vertical-align: middle;
    }
  }
`;

const Settings: React.FC = () => {
  // Translation hook
  const { t } = useTranslation();

  // Theme mode and toggle function from custom hook
  const { themeMode, toggleTheme } = useTheme();

  // Language code and toggle from custom hook
  const { language, toggleLanguage } = useLanguage();

  /**
   * Handle toggling between light and dark mode.
   * Only call toggleTheme if the switch state differs from current mode.
   */
  const handleThemeChange = (checked: boolean) => {
    const shouldBeDark = checked;
    if ((shouldBeDark && themeMode === 'light') || (!shouldBeDark && themeMode === 'dark')) {
      toggleTheme();
    }
  };

  /**
   * Handle switching between English and Arabic.
   * Only call toggleLanguage when the selected value differs from current language.
   */
  const handleLanguageChange = (e: RadioChangeEvent) => {
    const selected = e.target.value as 'en' | 'ar';
    if ((selected === 'ar' && language === 'en') || (selected === 'en' && language === 'ar')) {
      toggleLanguage();
    }
  };

  return (
    <SettingsContainer>
      {/* Page title */}
      <Title level={2} style={{ marginBottom: 24 }}>
        {t('nav.settings')}
      </Title>

      <SettingsCard>

        {/* Theme setting */}
        <SettingItem>
          <TextWrapper>
            <SettingLabel>{t('settings.theme')}</SettingLabel>
            <SettingDescription>
              {t('settings.themeDescription')}
            </SettingDescription>
          </TextWrapper>
          <ControlWrapper>
            <Text style={{ marginRight: language === 'ar' ? 0 : 8, marginLeft: language === 'ar' ? 8 : 0 }}>
              {t('settings.lightMode')}
            </Text>
            <Switch checked={themeMode === 'dark'} onChange={handleThemeChange} />
            <Text style={{ marginLeft: language === 'ar' ? 0 : 8, marginRight: language === 'ar' ? 8 : 0 }}>
              {t('settings.darkMode')}
            </Text>
          </ControlWrapper>
        </SettingItem>

        {/* Language setting */}
        <SettingItem>
          <TextWrapper>
            <SettingLabel>{t('settings.language')}</SettingLabel>
            <SettingDescription>
              {t('settings.languageDescription')}
            </SettingDescription>
          </TextWrapper>
          <ControlWrapper>
            <Radio.Group
              value={language}
              onChange={handleLanguageChange}
              buttonStyle="solid"
              size="large"
            >
              <Radio.Button value="ar" style={{ fontFamily: "'Cairo', sans-serif" }}>
                العربية
              </Radio.Button>
              <Radio.Button value="en">English</Radio.Button>
            </Radio.Group>
          </ControlWrapper>
        </SettingItem>

        {/* Notifications (coming soon) */}
        <SettingItem>
          <TextWrapper>
            <SettingLabel>{t('settings.notifications')}</SettingLabel>
            <SettingDescription>
              {t('settings.notificationsDescription')}
            </SettingDescription>
          </TextWrapper>
          <ControlWrapper>
            <Space align="center">
              <Switch disabled />
              <Text type="secondary">({t('settings.comingSoon')})</Text>
            </Space>
          </ControlWrapper>
        </SettingItem>

      </SettingsCard>

      {/* Footer with credit and social links */}
      <Footer>
        <Text type="secondary" style={{ display: 'block', margin: '4px 0', fontSize: '20px' }}>
          {t('settings.madeWithLove')}
        </Text>
        <Text type="secondary" style={{ display: 'block', margin: '4px 0', fontSize: '20px' }}>
          {t('settings.by')}
        </Text>
        <div className="links">
          <a href="https://www.linkedin.com/in/mustafa-sallat/" target="_blank" rel="noopener noreferrer">
            <LinkedinFilled />
          </a>
          <a href="https://github.com/msallat5" target="_blank" rel="noopener noreferrer">
            <GithubOutlined />
          </a>
          <a href="https://www.behance.net/mustafasallat" target="_blank" rel="noopener noreferrer">
            <BehanceSquareFilled />
          </a>
        </div>
      </Footer>
    </SettingsContainer>
  );
};

export default Settings;