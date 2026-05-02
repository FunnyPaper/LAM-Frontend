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
import { useParams, useNavigate, useSearchParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { useCallback, useState, useContext, useMemo } from 'react';
import { ApiProvider } from '../../providers/api.provider';
import { ArrowBack, Delete, Description, Polyline } from '@mui/icons-material';
import '@xyflow/react/dist/style.css';
import { ConfirmModal } from 'lam-frontend/components/modals/confirm.modal';
import { z } from 'zod';
import { ScriptFlow } from 'lam-frontend/components/flow/script.flow';
import { useDataSourceHook } from 'lam-frontend/hooks/use-datasource.hook';
import type { UpdateScriptDto } from 'lam-frontend/api/commands/script/update.script.provider';
import type { PublishScriptVersionDto, ScriptDto, ScriptVersionDto } from 'lam-frontend/api';
import { ScriptEditor } from 'lam-frontend/components/editors/script.editor';

export function ScriptsDetailsPage() {
  const { t } = useTranslation('scripts');
  const { id } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const {
    script: { getOne: getOneScript, remove: removeScript, update: updateScript },
    scriptVersion: {
      getOne: getScriptVersion,
      update: updateScriptVersion,
      create: createScriptVersion,
      archive: archiveScriptVersion,
      publish: publishScriptVersion,
    },
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

  const scriptVersionDataSource = useMemo(() => {
    const versionId = searchParams.get('version');
    return (versionId && getScriptVersion(id!, versionId)) || null;
  }, [searchParams, id, getScriptVersion]);

  const { data: scriptVersionData, invalidate: invalidateScriptVersion } = useDataSourceHook(scriptVersionDataSource);

  const handleSaveScript = useCallback(
    async (content: Record<string, unknown>) => {
      if (!scriptData) return;

      // If there's no script version created or the version is not draft, create a new version
      if (!scriptVersionData || scriptVersionData.status != 'Draft') {
        const { id: newId } = await createScriptVersion(id!, {
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

        // We want to work on newly created version. 
        // Otherwise each save operation will try to create a new version instead of updating the previous one.
        setSearchParams((prev) => (prev.set('version', newId), prev));
      } else {
        // Update version only if it is draft.
        await updateScriptVersion(id!, scriptVersionData.id, {
          content: {
            astJson: content,
            astVersion: scriptVersionData.content.astVersion,
            engineVersion: scriptVersionData.content.engineVersion,
          },
          source: { content: JSON.stringify(content, null, 2), format: 'json' },
        });

        invalidateScriptVersion();
      }
    },
    [createScriptVersion, id, invalidateScriptVersion, scriptData, scriptVersionData, updateScriptVersion, setSearchParams]
  );

  const handleSaveAsScript = useCallback(
    async (content: Record<string, unknown>, data: UpdateScriptDto) => {
      if (!scriptData) return;

      await updateScript(id!, data);
      invalidateScript();

      await handleSaveScript(content);
      invalidateScriptVersion();
    },
    [handleSaveScript, id, invalidateScript, invalidateScriptVersion, scriptData, updateScript]
  );

  const handlePublish = useCallback(async (script: ScriptDto, version: ScriptVersionDto, data: PublishScriptVersionDto) => {
    await publishScriptVersion(script.id, version.id, data);
    invalidateScriptVersion();
  }, [invalidateScriptVersion, publishScriptVersion]);

  const handleArchive = useCallback(async (script: ScriptDto, version: ScriptVersionDto) => {
    await archiveScriptVersion(script.id, version.id);
    invalidateScriptVersion();
  }, [archiveScriptVersion, invalidateScriptVersion])

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
        {(!scriptVersionData || !zodSchema) && <CircularProgress /> }
        {scriptVersionData && viewMode === 'flow' && <ScriptFlow />}
        {scriptVersionData && viewMode === 'editor' && zodSchema &&         
          <ScriptEditor
            script={scriptData}
            scriptVersion={scriptVersionData}
            format={scriptVersionData?.source.format || 'json'}
            initialContent={scriptVersionData?.source?.content || '{}'}
            onArchive={handleArchive}
            onPublish={handlePublish}
            onSave={handleSaveScript}
            onSaveAs={handleSaveAsScript}
            schema={zodSchema}
          />
        }
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
