import * as React from 'react';
import Button, { ButtonProps } from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

type ConfirmationDialogProps = {
  open: boolean;
  onClose?: () => void;
  title?: string;
  message?: string;
  confirmButtonText?: string;
  cancelButtonText?: string;
  confirmationBtnColor?: ButtonProps['color'];
  onConfirm?: () => void;
  onCancel?: () => void;
  loading?: boolean;
};

export default function ConfirmationDialog({
  open,
  onClose,
  title = 'Confirmation',
  message = 'Are you sure you want to do this?',
  confirmButtonText = 'Confirm',
  cancelButtonText = 'Cancel',
  confirmationBtnColor = 'primary',
  onConfirm,
  loading = false,
  onCancel,
}: ConfirmationDialogProps) {
  return (
    <React.Fragment>
      <Dialog
        open={open}
        slots={{
          transition: Transition,
        }}
        keepMounted
        onClose={onClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            {message}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            loading={loading}
            disabled={loading}
            color={confirmationBtnColor}
            onClick={onConfirm}
          >
            {confirmButtonText}
          </Button>
          <Button onClick={onCancel}>{cancelButtonText}</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
