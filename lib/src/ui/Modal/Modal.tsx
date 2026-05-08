import * as Dialog from '@radix-ui/react-dialog';
import { Text } from '../Text/Text';
import { LofiCloseIcon } from '../Util/LofiRadixIcons';
import './Modal.scss';

export type ModalSize = 'default' | 'wide';

export interface ModalProps {
  /** If false, nothing is rendered; if true, overlay and dialog show. */
  open:          boolean;
  /** Called when user closes via overlay click, close button, or Escape. */
  onClose:       () => void;
  /** Dialog title in the header. */
  title:         string;
  /** Optional supporting text under the title. */
  description?:  string;
  /** Main modal body below description. */
  children:      React.ReactNode;
  /** Optional action row (buttons) at the bottom. */
  footer?:       React.ReactNode;
  /** Layout width: default | wide. */
  size?:         ModalSize;
}

export function Modal({ open, onClose, title, description, children, footer, size = 'default' }: ModalProps) {
  const dialogCls = ['modal', size === 'wide' ? 'modal--wide' : ''].filter(Boolean).join(' ');

  return (
    <Dialog.Root open={open} onOpenChange={(isOpen) => { if (!isOpen) onClose(); }}>
      <Dialog.Portal>
        <Dialog.Overlay className="modal-overlay" />
        <Dialog.Content
          className={dialogCls}
          aria-modal="true"
          aria-describedby={description ? undefined : undefined}
        >
          <div className="modal__header">
            <Dialog.Title asChild>
              <h2 className="modal__title">
                <Text as="span" variant="inherit">{title}</Text>
              </h2>
            </Dialog.Title>
            <Dialog.Close asChild>
              <button type="button" className="modal__close" aria-label="Close">
                <LofiCloseIcon size={16} />
              </button>
            </Dialog.Close>
          </div>
          {description && (
            <Dialog.Description asChild>
              <p className="modal__description">
                <Text as="span" variant="inherit">{description}</Text>
              </p>
            </Dialog.Description>
          )}
          <div className="modal__body">{children}</div>
          {footer && <div className="modal__footer">{footer}</div>}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
