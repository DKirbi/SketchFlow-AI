import { LOFIButton, LOFIModal, LOFIText } from 'lofi-kit';

export interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  message: string;
  confirmLabel: string;
  onConfirm: () => void;
  destructive?: boolean;
}

/** P7 confirmation — only title, message, two actions. */
export function ConfirmDialog({
  open,
  onClose,
  title,
  message,
  confirmLabel,
  onConfirm,
  destructive,
}: ConfirmDialogProps) {
  return (
    <LOFIModal
      open={open}
      onClose={onClose}
      title={title}
      footer={
        <>
          <LOFIButton type="button" variant="dismiss" onClick={onClose}>
            Cancel
          </LOFIButton>
          <LOFIButton
            type="button"
            variant={destructive ? 'dismiss' : 'primary'}
            onClick={() => {
              onConfirm();
              onClose();
            }}
          >
            {confirmLabel}
          </LOFIButton>
        </>
      }
    >
      <LOFIText variant="body">{message}</LOFIText>
      {destructive ? (
        <LOFIText variant="description" className="tmgmt__p7-muted">
          Confirm only if downstream teams accept the mocked irreversible wording.
        </LOFIText>
      ) : null}
    </LOFIModal>
  );
}
