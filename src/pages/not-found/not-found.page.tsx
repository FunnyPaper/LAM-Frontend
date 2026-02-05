import { Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

export default function NotFoundPage() {
  const { t } = useTranslation('common');

  return (
    <Stack sx={{ alignItems: 'center' }}>
      <Typography variant="h1">404</Typography>
      <Typography variant="h6">{t('not-found')}</Typography>
    </Stack>
  );
}
