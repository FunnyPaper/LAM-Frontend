import { Card, CardContent, CardHeader, Chip, Collapse, Divider, IconButton, Stack, Typography } from '@mui/material';
import type { ScriptDto } from '../../../api/queries/script.provider';
import { AddCircle, Delete, DynamicFeed, Edit, ExpandLess, ExpandMore } from '@mui/icons-material';
import { useState } from 'react';
import type { ScriptVersionDto } from 'lam-frontend/api/queries/script-version.provider';
import { useTranslation } from 'react-i18next';
import { useContext, useEffect } from 'react';
import { ApiProvider } from '../../../providers/api.provider';
import { format } from 'date-fns';

export type ScriptsListItemProps = {
  script: ScriptDto;
  onEdit: (data: ScriptDto, lastVersion: ScriptVersionDto) => void;
  onPreview: (data: ScriptDto) => void;
  onDelete: (data: ScriptDto) => void;
};

export function ScriptsListItem({ script, onEdit, onPreview, onDelete }: ScriptsListItemProps) {
  const [expand, setExpand] = useState(false);
  const [lastVersion, setLastVersion] = useState<ScriptVersionDto | null>(null);
  const { t } = useTranslation('scripts');
  const { scriptVersion } = useContext(ApiProvider)!;

  useEffect(() => {
    if (scriptVersion && script.id) {
      const { subscribe } = scriptVersion.getAll(script.id, {
        page: 0,
        limit: 1,
        sort: {
          field: 'createdAt',
          order: 'desc',
        },
      });

      const unsubscribe = subscribe((data) => {
        if (data.data.length > 0) {
          setLastVersion(data.data[0]);
        } else {
          setLastVersion(null);
        }
      });

      return unsubscribe;
    }
  }, [script.id, scriptVersion]);

  return (
    <Card>
      <CardHeader
        action={
          <Stack direction="row">
            {script.description && (
              <IconButton title={!expand ? t('list.expand') : t('list.collapse')} onClick={() => setExpand((p) => !p)}>
                {!expand ? <ExpandMore /> : <ExpandLess />}
              </IconButton>
            )}
            <IconButton title={t('list.edit')} onClick={() => onEdit(script, lastVersion!)}>
              <Edit />
            </IconButton>
            <IconButton title={t('list.showVersions')} onClick={() => onPreview(script)}>
              <DynamicFeed />
            </IconButton>
            <IconButton title={t('list.remove')} onClick={() => onDelete(script)}>
              <Delete />
            </IconButton>
          </Stack>
        }
        title={
          <Stack direction="row" spacing={1} flexWrap="wrap">
            <Typography noWrap={false} sx={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {script.name}
            </Typography>
            {lastVersion && (
              <>
                <Chip
                  label={`${t('lastVersion.astVersion', { version: lastVersion.content.astVersion })}`}
                  size="small"
                  variant="outlined"
                />
                <Chip
                  label={`${t('lastVersion.engineVersion', { version: lastVersion.content.engineVersion })}`}
                  size="small"
                  variant="outlined"
                />
                <Chip label={lastVersion.source.format} size="small" variant="outlined" />
                <Chip
                  label={`${t('lastVersion.versionNumber', { version: lastVersion.versionNumber })}`}
                  size="small"
                  variant="outlined"
                />
                <Chip
                  icon={<AddCircle />}
                  label={format(new Date(lastVersion.createdAt), 'yyyy/MM/dd HH:mm')}
                  size="small"
                  variant="outlined"
                />
              </>
            )}
          </Stack>
        }
        sx={{
          '.MuiCardHeader-content': {
            overflow: 'hidden',
            display: 'grid',
          },
        }}
      />
      {script.description && (
        <Collapse in={expand}>
          <Divider />
          <CardContent sx={{ maxHeight: 200, overflowY: 'auto' }}>
            <Typography variant="body2" textAlign="justify">
              {script.description}
            </Typography>
          </CardContent>
        </Collapse>
      )}
    </Card>
  );
}
