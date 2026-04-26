import { AppBar, Box, Button, Grid, Skeleton, Stack, Typography } from '@mui/material';
import { useContext, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { ApiProvider } from '../../providers/api.provider';
import { ProfileForm } from '../../components/forms/profile.form';
import { useDataSourceHook } from 'lam-frontend/hooks/use-datasource.hook';
import { Logout } from '@mui/icons-material';

export function ProfilePage() {
  const { t } = useTranslation('profile');
  const { user, auth } = useContext(ApiProvider)!;

  const me = useMemo(() => user.me(), [user]);
  const { data: profile } = useDataSourceHook(me);

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
        <Stack direction="row" gap={2} alignItems="center">
          <Typography variant="h4">{t('header')}</Typography>
          <Box flexGrow={1} />
          <Button color="secondary" variant="outlined" endIcon={<Logout />} onClick={auth.logout}>
            {t('form.fields.logout')}
          </Button>
        </Stack>
      </AppBar>
      <Grid container spacing={2} p={2}>
        <Grid size={{ xs: 12, sm: 6, md: 4 }} mt={2} sx={{ mx: 'auto' }}>
          <Typography>{t('form.fields.details')}</Typography>
          {profile ? (
            <ProfileForm defaultValues={profile} onSubmit={user.update} />
          ) : (
            <Skeleton sx={{ mt: 1 }} variant="rounded" height={48} />
          )}
        </Grid>
      </Grid>
    </Stack>
  );
}
