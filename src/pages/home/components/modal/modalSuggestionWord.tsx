import { Box, Modal, TextField } from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import { useStore } from '../../../../store/useStore';

interface ModalSuggestionWordProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const initialValuesModal = {
  name: '',
};

const ModalSuggestionWord = ({ open, setOpen }: ModalSuggestionWordProps) => {
  const { addSuggestedName } = useStore();

  const {
    control: modalControl,
    handleSubmit: handleModalSubmit,
    formState: { errors: modalErrors },
  } = useForm<{
    name: string;
  }>({
    defaultValues: { ...initialValuesModal },
    mode: 'all',
  });

  const onSubmit02 = (data: { name: string }) => {
    addSuggestedName(data.name);
  };

  return (
    <Modal
      open={open}
      onClose={() => setOpen(false)}
      aria-labelledby='modal-modal-title'
      aria-describedby='modal-modal-description'
    >
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          border: '2px solid #000',
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
        }}
      >
        <form onSubmit={handleModalSubmit(onSubmit02)}>
          <Controller
            control={modalControl}
            name='name'
            render={({ field }) => (
              <TextField
                {...field}
                label='Nome'
                variant='outlined'
                error={!!modalErrors.name}
                helperText={modalErrors.name?.message}
              />
            )}
          />
        </form>
      </Box>
    </Modal>
  );
};

export { ModalSuggestionWord };
