import { Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

export default function RunsPage() {
  const { t } = useTranslation('runs');

  return <Typography variant="h1">{t('header')}</Typography>;
}
