import { AppBar, Grid, Skeleton, Stack, Typography } from '@mui/material';
import { Suspense, useContext, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { ApiProvider } from '../../api/api.provider';
import ProfileForm from '../../components/forms/profile.form';

export default function ProfilePage() {
  const { t } = useTranslation('profile');
  const { getProfile, updateProfile } = useContext(ApiProvider);
  const profile = useMemo(() => getProfile(), [getProfile]);

  return (
    <Stack>
      <AppBar position="relative" sx={{ p: 2 }}>
        <Typography variant="h5">{t('header')}</Typography>
      </AppBar>
      <Grid container spacing={2} p={2}>
        <Grid size={{ xs: 12, sm: 6, md: 4 }} mt={2} sx={{ mx: 'auto' }}>
          <Typography>Details</Typography>
          <Suspense
            fallback={<Skeleton sx={{ mt: 1 }} variant="rounded" height={48} />}
          >
            <ProfileForm defaultValues={profile} onSubmit={updateProfile} />
          </Suspense>
        </Grid>
      </Grid>
    </Stack>
  );
}
