import { LOFIModal, LOFIButton, LOFIText } from 'lofi-kit';

interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  message: string;
  confirmLabel: string;
  onConfirm: () => void;
  /** If true, confirm button uses dismiss variant (destructive). */
  destructive?: boolean;
}

export function ConfirmDialog({
  open,
  onClose,
  title,
  message,
  confirmLabel,
  onConfirm,
  destructive = false,
}: ConfirmDialogProps) {
  return (
    <LOFIModal
      open={open}
      onClose={onClose}
      title={title}
      footer={
        <>
          <LOFIButton variant="dismiss" onClick={onClose}>Cancel</LOFIButton>
          <LOFIButton
            variant={destructive ? 'dismiss' : 'primary'}
            onClick={() => { onConfirm(); onClose(); }}
          >
            {confirmLabel}
          </LOFIButton>
        </>
      }
    >
      <LOFIText variant="body">{message}</LOFIText>
    </LOFIModal>
  );
}
