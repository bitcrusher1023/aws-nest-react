import { gql, useMutation } from '@apollo/client';
import DatePicker from '@mui/lab/DatePicker';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import Container from '@mui/material/Container';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { PropsWithoutRef, useCallback, useMemo, useState } from 'react';
import {
  Control,
  Controller,
  SubmitHandler,
  useController,
  useForm,
} from 'react-hook-form';

import { useGameList } from './GameList.provider';
import userId from './user';

interface AddGameFormInput {
  boxArtImageUrl: string;
  genre: string;
  name: string;
  numberOfPlayers: string;
  platform: string;
  publisher: string;
  releaseDate: string | null;
}

const ADD_GAME_TO_LIST = gql`
  mutation addGameToLibrary($data: AddGameToLibraryArgs!) {
    addGameToLibrary(data: $data) {
      id
    }
  }
`;

const PREPARE_UPLOAD_GAME_BOX_ART = gql`
  mutation uploadBoxArt($fileName: String!) {
    prepareUploadGameBoxArt(fileName: $fileName) {
      id
      resultPublicUrl
      uploadUrl
    }
  }
`;

export function GameBoxArtUploadField({
  control,
  disabled = false,
}: PropsWithoutRef<{
  control: Control<AddGameFormInput>;
  disabled?: boolean;
}>) {
  const [prePareUploadGameBoxArt] = useMutation(PREPARE_UPLOAD_GAME_BOX_ART);
  const {
    field: { name, onBlur, onChange, ref, value },
    fieldState: { error },
  } = useController({
    control: control,
    name: 'boxArtImageUrl',
    rules: {
      required: { message: 'box art must be provided', value: true },
    },
  });

  const handleFileUpload = useCallback(
    async event => {
      const [sourceFile] = event.target.files;
      const { data, errors } = await prePareUploadGameBoxArt({
        variables: { fileName: sourceFile.name },
      });
      if (errors) return;
      await fetch(data.prepareUploadGameBoxArt.uploadUrl, {
        body: sourceFile,
        method: 'PUT',
      });
      onChange(data.prepareUploadGameBoxArt.resultPublicUrl);
    },
    [prePareUploadGameBoxArt, onChange],
  );

  const hasError = !!error;

  return (
    <FormControl error={hasError} fullWidth>
      {value && (
        <Box
          component={'img'}
          data-testid="game-box-art-image"
          src={value}
          sx={{ height: '32rem', mb: 1, objectFit: 'contain' }}
        />
      )}
      {!disabled && (
        <label htmlFor="boxArt">
          <input
            accept="image/*"
            data-testid={'game-box-art-upload-input'}
            id="boxArt"
            name={name}
            onBlur={onBlur}
            onChange={handleFileUpload}
            ref={ref}
            style={{ display: 'none' }}
            type="file"
          />
          <Button
            color="info"
            component="span"
            sx={{ width: 1 }}
            variant="contained"
          >
            Upload Box Art{value && ' Again'}
          </Button>
        </label>
      )}
      {hasError && (
        <FormHelperText data-testid={'game-box-art-upload-error'}>
          {error.message}
        </FormHelperText>
      )}
    </FormControl>
  );
}

function GameReleaseDateField({
  control,
  disabled = false,
}: PropsWithoutRef<{
  control: Control<AddGameFormInput>;
  disabled?: boolean;
}>) {
  const {
    field: { name, onBlur, onChange, ref, value },
  } = useController({
    control: control,
    name: 'releaseDate',
  });
  return (
    <DatePicker
      disabled={disabled}
      label="Release Date"
      onChange={value => {
        onChange(value?.toString());
      }}
      renderInput={params => (
        <TextField
          {...params}
          data-testid={'release-date-input'}
          name={name}
          onBlur={onBlur}
          ref={ref}
        />
      )}
      value={value}
    />
  );
}

function GameNumberOfPlayersField({
  control,
  disabled = false,
}: PropsWithoutRef<{
  control: Control<AddGameFormInput>;
  disabled?: boolean;
}>) {
  const {
    field: { name, onBlur, onChange, ref, value },
    fieldState: { error },
  } = useController({
    control: control,
    name: 'numberOfPlayers',
    rules: {
      min: {
        message: "number of players can't less than 0",
        value: 0,
      },
      required: {
        message: 'number of players must be provided',
        value: true,
      },
    },
  });

  const onValueChange = useCallback(
    event => {
      const numberValue = parseInt(event.target.value, 10);
      if (!isNaN(numberValue)) return onChange(numberValue);
      return onChange('');
    },
    [onChange],
  );

  const hasError = !!error;

  return (
    <FormControl error={hasError} fullWidth>
      <InputLabel htmlFor="numberOfPlayers">Number of players</InputLabel>
      <Input
        aria-describedby="number-of-players-error"
        data-testid={'number-of-players-input'}
        disabled={disabled}
        id="numberOfPlayers"
        inputProps={{ min: 0, type: 'number' }}
        name={name}
        onBlur={onBlur}
        onChange={onValueChange}
        ref={ref}
        value={value}
      />
      {hasError && (
        <FormHelperText data-testid={'number-of-players-error'}>
          {error.message}
        </FormHelperText>
      )}
    </FormControl>
  );
}

export default function AddGameLibraryForm({
  cancelSubmit,
  finishSubmit,
}: {
  cancelSubmit: () => void;
  finishSubmit: () => void;
}) {
  const { control, handleSubmit } = useForm<AddGameFormInput>({
    defaultValues: {
      boxArtImageUrl: '',
      genre: 'FIGHTING',
      name: '',
      numberOfPlayers: '',
      platform: 'PS5',
      publisher: '',
      releaseDate: null,
    },
    mode: 'onBlur',
  });
  const [createGameMutation, { data, error }] = useMutation(ADD_GAME_TO_LIST);
  const createGameMutationError = useMemo<null | {
    code: string;
    message: string;
  }>(() => {
    if (error) {
      const [mutationError] = error.graphQLErrors;
      return {
        code: mutationError.extensions['code'] as string,
        message: mutationError.message as string,
      };
    }
    return null;
  }, [error]);

  const { setFilter } = useGameList();
  const onSubmit: SubmitHandler<AddGameFormInput> = useCallback(
    async data => {
      await createGameMutation({
        variables: {
          data: {
            ...data,
            userId: userId,
          },
        },
      });
      await setFilter?.(null, data.platform);
      finishSubmit();
    },
    [createGameMutation, finishSubmit, setFilter],
  );
  return (
    <Container fixed sx={{ py: 2 }}>
      <Typography data-testid={'created-game-id'} sx={{ display: 'none' }}>
        {data?.addGameToLibrary.id}
      </Typography>
      <Stack
        component={'form'}
        data-testid={'add-game-form'}
        onSubmit={handleSubmit(onSubmit)}
        spacing={2}
      >
        <GameBoxArtUploadField control={control} />

        <Controller
          control={control}
          name="name"
          render={({ field }) => (
            <FormControl fullWidth>
              <InputLabel htmlFor="name">Name</InputLabel>
              <Input data-testid={'game-name-input'} id="name" {...field} />
            </FormControl>
          )}
        />
        <Controller
          control={control}
          name="publisher"
          render={({ field }) => (
            <FormControl fullWidth>
              <InputLabel htmlFor="publisher">Publisher</InputLabel>
              <Input
                data-testid={'game-publisher-input'}
                id="publisher"
                {...field}
              />
            </FormControl>
          )}
        />

        <Controller
          control={control}
          name={'platform'}
          render={({ field }) => (
            <FormControl fullWidth>
              <InputLabel id="platform-input-label">Platform</InputLabel>
              <Select
                data-testid={'game-platform-input'}
                id="platform-input-id"
                label="Platform"
                labelId="platform-input-label"
                {...field}
              >
                <MenuItem data-testid={'game-platform-input-ps4'} value={'PS4'}>
                  PS4
                </MenuItem>
                <MenuItem data-testid={'game-platform-input-ps5'} value={'PS5'}>
                  PS5
                </MenuItem>
              </Select>
            </FormControl>
          )}
        />

        <GameNumberOfPlayersField control={control} />

        <Controller
          control={control}
          name={'genre'}
          render={({ field }) => (
            <FormControl fullWidth>
              <InputLabel id="genre-input-label">Genre</InputLabel>
              <Select
                data-testid={'genre-input'}
                id="genre-input-id"
                label="Genre"
                labelId="genre-input-label"
                {...field}
              >
                <MenuItem
                  data-testid={'genre-input-ps4-fighting'}
                  value={'FIGHTING'}
                >
                  Fighting
                </MenuItem>
                <MenuItem data-testid={'genre-input-ps5'} value={'FPS'}>
                  FPS
                </MenuItem>
                <MenuItem data-testid={'genre-input-rpg'} value={'RPG'}>
                  RPG
                </MenuItem>
                <MenuItem data-testid={'genre-input-srpg'} value={'SRPG'}>
                  SRPG
                </MenuItem>
                <MenuItem data-testid={'genre-input-action'} value={'ACTION'}>
                  Action
                </MenuItem>
              </Select>
            </FormControl>
          )}
        />
        <GameReleaseDateField control={control} />
        {createGameMutationError && (
          <Alert severity="error">
            <AlertTitle data-testid={'alert-error-title'}>
              {createGameMutationError.code}
            </AlertTitle>
            {createGameMutationError.message}
          </Alert>
        )}
        <ButtonGroup disableElevation fullWidth={true} sx={{ columnGap: 1 }}>
          <Button
            color={'primary'}
            data-testid={'submit-add-new-game-form'}
            type={'submit'}
            variant="contained"
          >
            Submit
          </Button>
          <Button
            color={'primary'}
            data-testid={'cancel-add-new-game-form'}
            onClick={cancelSubmit}
            variant="contained"
          >
            Cancel
          </Button>
        </ButtonGroup>
      </Stack>
    </Container>
  );
}

export function AddGameLibraryFormDialog() {
  const [open, setOpen] = useState(false);

  const handleClickOpen = useCallback(() => {
    setOpen(true);
  }, []);

  const handleClose = useCallback(() => {
    setOpen(false);
  }, []);
  return (
    <>
      <Button color={'primary'} onClick={handleClickOpen} variant="contained">
        Add game to library
      </Button>
      <Dialog onClose={handleClose} open={open}>
        <DialogTitle>Add game to your library</DialogTitle>
        <DialogContent>
          <AddGameLibraryForm
            cancelSubmit={handleClose}
            finishSubmit={handleClose}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
