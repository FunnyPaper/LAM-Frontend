import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Close } from '@mui/icons-material';
import { useContext, useState } from 'react';
import type { ScriptDto } from '../../api/queries/script.provider';
import type { EnvDto } from '../../api/queries/env.provider';
import { ApiProvider } from 'lam-frontend/providers/api.provider';

export type CreateScriptRunModalProps = {
  open: boolean;
  onClose: () => void;
  onCreate: (data: { envId?: string; scriptVersionId: string }) => void;
};

// TODO: Split the table inside into distinct component - it can be reusable

export function CreateScriptRunModal({ open, onClose, onCreate }: CreateScriptRunModalProps) {
  const { t } = useTranslation('runs');
  const { script, env } = useContext(ApiProvider)!;

  const [selectedScript, setSelectedScript] = useState<ScriptDto | null>(null);
  const [selectedEnv, setSelectedEnv] = useState<EnvDto | null>(null);

  const [scripts, setScripts] = useState<ScriptDto[]>([]);
  const [envs, setEnvs] = useState<EnvDto[]>([]);

  const [scriptsLoading, setScriptsLoading] = useState(true);
  const [envsLoading, setEnvsLoading] = useState(true);

  if (open) {
    if (scripts.length === 0) {
      const { subscribe: subscribeScripts } = script.getAll();
      subscribeScripts((data) => {
        setScripts(data.data);
        setScriptsLoading(false);
      });
    }

    if (envs.length === 0) {
      const { subscribe: subscribeEnvs } = env.getAll();
      subscribeEnvs((data) => {
        setEnvs(data.data);
        setEnvsLoading(false);
      });
    }
  }

  const handleRun = () => {
    if (selectedScript) {
      onCreate({
        envId: selectedEnv?.id,
        scriptVersionId: selectedScript.id,
      });
      onClose();
    }
  };

  const handleSelectScript = (script: ScriptDto) => {
    if (script == selectedScript) {
      setSelectedScript(null);
    } else {
      setSelectedScript(script);
    }
  };

  const handleSelectEnv = (env: EnvDto) => {
    if (env == selectedEnv) {
      setSelectedEnv(null);
    } else {
      setSelectedEnv(env);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">{t('createModal.title')}</Typography>
          <IconButton onClick={onClose}>
            <Close />
          </IconButton>
        </Stack>
      </DialogTitle>
      <Divider />
      <DialogContent>
        <Stack gap={2}>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid size={{ xs: 6 }}>
              <Typography variant="body1" gutterBottom>
                {t('createModal.scripts')}
              </Typography>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>{t('createModal.name')}</TableCell>
                      <TableCell>{t('createModal.description')}</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {scriptsLoading ? (
                      <TableRow>
                        <TableCell colSpan={2}>
                          <Typography variant="body2">{t('createModal.loading')}</Typography>
                        </TableCell>
                      </TableRow>
                    ) : (
                      scripts.map((script) => (
                        <TableRow
                          key={script.id}
                          onClick={() => handleSelectScript(script)}
                          sx={{
                            cursor: 'pointer',
                            backgroundColor: selectedScript?.id === script.id ? 'primary.light' : 'inherit',
                          }}
                        >
                          <TableCell sx={{ color: selectedScript?.id === script.id ? 'primary.dark' : 'inherit' }}>
                            {script.name}
                          </TableCell>
                          <TableCell sx={{ color: selectedScript?.id === script.id ? 'primary.dark' : 'inherit' }}>
                            {script.description || t('createModal.noDescription')}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
            <Grid size={{ xs: 6 }}>
              <Typography variant="body1" gutterBottom>
                {t('createModal.environments')}
              </Typography>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>{t('createModal.name')}</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {envsLoading ? (
                      <TableRow>
                        <TableCell colSpan={1}>
                          <Typography variant="body2">{t('createModal.loading')}</Typography>
                        </TableCell>
                      </TableRow>
                    ) : (
                      envs.map((env) => (
                        <TableRow
                          key={env.id}
                          onClick={() => handleSelectEnv(env)}
                          sx={{
                            cursor: 'pointer',
                            backgroundColor: selectedEnv?.id === env.id ? 'primary.light' : 'inherit',
                          }}
                        >
                          <TableCell sx={{ color: selectedEnv?.id === env.id ? 'primary.dark' : 'inherit' }}>
                            {env.name}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          </Grid>
          <Stack direction="row" justifyContent="flex-end">
            <Button onClick={onClose}>{t('createModal.cancel')}</Button>
            <Button onClick={handleRun} variant="contained" disabled={!selectedScript}>
              {t('createModal.run')}
            </Button>
          </Stack>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}
