import { AppBar, Box, Stack, Typography, Divider, ToggleButtonGroup, ToggleButton } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useThemeStore, type ThemeMode } from 'lam-frontend/stores/theme.store';
import { DarkMode, LightMode, SettingsBrightness } from '@mui/icons-material';
import { LanguageTypes, useLanguageStore, type LanguageType } from 'lam-frontend/stores/language.store';
import React from 'react';

export function SettingsPage() {
  const { t } = useTranslation('settings');
  const { themeMode, setThemeMode } = useThemeStore();
  const { language, setLanguage } = useLanguageStore();

  const handleLanguageChange = (event: React.MouseEvent<HTMLElement>, newLanguages: LanguageType) => {
    if (newLanguages.length) {
      setLanguage(newLanguages);
    }
  };

  const handleModeChange = (event: React.MouseEvent<HTMLElement>, newModes: ThemeMode) => {
    if (newModes.length) {
      setThemeMode(newModes);
    }
  };

  return (
    <Stack>
      <AppBar
        position="relative"
        sx={{
          p: 2,
          backgroundColor: 'background.paper',
          color: 'text.primary',
        }}
      >
        <Typography variant="h4">{t('header')}</Typography>
      </AppBar>
      <Box sx={{ p: 2 }}>
        <Stack spacing={3}>
          <Box>
            <Typography variant="h6" sx={{ mb: 1 }}>
              {t('languageSettings')}
            </Typography>

            <ToggleButtonGroup size="small" value={language} onChange={handleLanguageChange} exclusive>
              {LanguageTypes.map((lang) => (
                <ToggleButton key={lang} value={lang}>
                  {lang}
                </ToggleButton>
              ))}
            </ToggleButtonGroup>
          </Box>

          <Divider />

          <Box>
            <Typography variant="h6" sx={{ mb: 1 }}>
              {t('themeSettings')}
            </Typography>
            <ToggleButtonGroup size="small" value={themeMode} onChange={handleModeChange} exclusive>
              <ToggleButton value="light">
                <LightMode />
              </ToggleButton>
              <ToggleButton value="dark">
                <DarkMode />
              </ToggleButton>
              <ToggleButton value="system">
                <SettingsBrightness />
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>
        </Stack>
      </Box>
    </Stack>
  );
}
