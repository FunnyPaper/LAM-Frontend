import { Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

export default function ProfilePage() {
  const { t } = useTranslation('profile');

  return <Typography variant="h1">{t('header')}</Typography>;
}
