import {
  Typography,
  Box,
  Button,
  Stack,
  AppBar,
  ToggleButton,
  ToggleButtonGroup,
  CircularProgress,
} from '@mui/material';
import { useParams, useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { useCallback, useState, useContext, useMemo } from 'react';
import { ApiProvider } from '../../providers/api.provider';
import { ArrowBack, Delete, Description, Polyline } from '@mui/icons-material';
import { ScriptEditor } from '../../components/editors/script.editor';
import '@xyflow/react/dist/style.css';
import { ConfirmModal } from 'lam-frontend/components/modals/confirm.modal';
import { z } from 'zod';
import { ScriptFlow } from 'lam-frontend/components/flow/script.flow';
import { useDataSourceHook } from 'lam-frontend/hooks/use-datasource.hook';
import type { UpdateScriptDto } from 'lam-frontend/api/commands/script/update.script.provider';

export function ScriptsDetailsPage() {
  const { t } = useTranslation('scripts');
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    script: { getOne: getOneScript, remove: removeScript, update: updateScript },
    scriptVersion: { getAll: getScriptVersion, update: updateScriptVersion, create: createScriptVersion },
    script: { getJsonSchema },
  } = useContext(ApiProvider)!;

  const [viewMode, setViewMode] = useState<'flow' | 'editor'>('editor');
  const [openRemoveConfirmModal, setOpenRemoveConfirmModal] = useState(false);

  const jsonSchemaDataSource = useMemo(() => getJsonSchema('1.0'), [getJsonSchema]);
  const { data: jsonSchema } = useDataSourceHook(jsonSchemaDataSource);
  const zodSchema = useMemo(() => jsonSchema && z.fromJSONSchema(jsonSchema), [jsonSchema]);

  const scriptDataSource = useMemo(() => (id && getOneScript(id)) || null, [id, getOneScript]);
  const {
    data: scriptData,
    isLoading: isScriptLoading,
    error: scriptError,
    invalidate: invalidateScript,
  } = useDataSourceHook(scriptDataSource);

  const scriptVersionDataSource = useMemo(
    () =>
      getScriptVersion(id!, {
        limit: 1,
        sort: { field: 'createdAt', order: 'desc' },
      }),
    [id, getScriptVersion]
  );
  const { data: scriptVersionData, invalidate: invalidateScriptVersion } = useDataSourceHook(scriptVersionDataSource);

  const handleSaveScript = useCallback(
    async (content: Record<string, unknown>) => {
      if (!scriptData || !scriptVersionData) return;

      // If there's no script version created, create one - it can be treated as a dumb optimization for now
      // (no script versions are created until users decides to write a first version - it follows the user intuition behind the scene)
      if (scriptVersionData?.metadata.totalItems == 0) {
        await createScriptVersion(id!, {
          content: {
            astJson: content,
            astVersion: 1,
            engineVersion: 1,
          },
          source: {
            format: 'json',
            content: JSON.stringify(content, null, 2),
          },
        });
      } else {
        await updateScriptVersion(scriptData.id, scriptVersionData.data[0].id, {
          content: {
            astJson: content,
            ...scriptVersionData.data[0].content,
            engineVersion: 1,
          },
          source: { content: JSON.stringify(content, null, 2), format: 'json' },
        });
      }

      invalidateScriptVersion();
    },
    [createScriptVersion, id, invalidateScriptVersion, scriptData, scriptVersionData, updateScriptVersion]
  );

  const handleSaveAsScript = useCallback(
    async (content: Record<string, unknown>, data: UpdateScriptDto) => {
      if (!scriptData) return;

      await updateScript(id!, data);
      invalidateScript();
      await handleSaveScript(content);
    },
    [handleSaveScript, id, invalidateScript, scriptData, updateScript]
  );

  const handleRemove = useCallback(() => setOpenRemoveConfirmModal(true), [setOpenRemoveConfirmModal]);

  const handleBackToList = useCallback(() => navigate('/scripts'), [navigate]);
  const handleSwitchView = useCallback((newView: 'flow' | 'editor') => setViewMode(newView), []);

  const handleConfirmRemove = async () => {
    if (!scriptData) return;

    await removeScript(scriptData.id);
    setOpenRemoveConfirmModal(false);
    navigate('/scripts', { replace: true });
  };

  if (isScriptLoading) {
    return <CircularProgress />;
  }

  if (scriptError || !scriptData) {
    return (
      <Box p={2} height="100%" width="100%">
        <Typography variant="h4" color="error">
          {scriptError || t('notFound')}
        </Typography>
        <Button onClick={() => navigate('/scripts', { replace: true })} sx={{ mt: 2 }}>
          {t('backToList')}
        </Button>
      </Box>
    );
  }

  return (
    <Stack height="100%">
      <AppBar
        position="relative"
        sx={{
          p: 2,
          backgroundColor: 'background.paper',
          color: 'text.primary',
        }}
      >
        <Stack direction="row" gap={2} alignItems="center">
          <Button
            size="small"
            variant="outlined"
            sx={{ minWidth: '40px', height: '40px', alignSelf: 'center' }}
            onClick={handleBackToList}
          >
            <ArrowBack />
          </Button>
          <Typography variant="h4">{t('details.header')}</Typography>
          <Box sx={{ flexGrow: 1 }} />
          <ToggleButtonGroup
            size="small"
            value={viewMode}
            onChange={(_, v) => handleSwitchView(v as 'flow' | 'editor')}
            exclusive
            disabled
          >
            <ToggleButton value="flow" aria-label="flow view">
              <Polyline />
            </ToggleButton>
            <ToggleButton value="editor" aria-label="editor view">
              <Description />
            </ToggleButton>
          </ToggleButtonGroup>

          <Button variant="outlined" color="error" startIcon={<Delete />} onClick={handleRemove}>
            {t('details.remove')}
          </Button>
        </Stack>
      </AppBar>
      <Box p={2} height="100%">
        {viewMode === 'flow' ? (
          <ScriptFlow />
        ) : (
          <ScriptEditor
            script={scriptData}
            format={scriptVersionData?.data?.[0].source.format || 'json'}
            initialContent={scriptVersionData?.data?.[0].source?.content || '{}'}
            onSave={handleSaveScript}
            onSaveAs={handleSaveAsScript}
            schema={zodSchema}
          />
        )}
      </Box>
      <ConfirmModal
        open={openRemoveConfirmModal}
        title={t('confirm.delete.title')}
        content={t('confirm.delete.content')}
        onConfirm={handleConfirmRemove}
        onCancel={() => setOpenRemoveConfirmModal(false)}
        confirmButtonText={t('confirm.delete.confirm')}
        cancelButtonText={t('confirm.delete.cancel')}
        confirmButtonColor="error"
      />
    </Stack>
  );
}
