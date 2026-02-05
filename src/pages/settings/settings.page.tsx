import { Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

export default function SettingsPage() {
  const { t } = useTranslation('settings');

  return <Typography variant="h1">{t('header')}</Typography>;
}
