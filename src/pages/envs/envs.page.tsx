import { Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

export default function EnvsPage() {
  const { t } = useTranslation('envs');

  return <Typography variant="h1">{t('header')}</Typography>;
}
