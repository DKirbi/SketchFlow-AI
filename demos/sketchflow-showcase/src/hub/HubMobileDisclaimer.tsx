import { LOFIButton, LOFIModal, LOFIText } from 'lofi-kit';
import { useAppearance } from '../appearance/AppearanceProvider';

interface HubMobileDisclaimerProps {
  open: boolean;
  onProceed: () => void;
  onGoHome: () => void;
}

export function HubMobileDisclaimer({ open, onProceed, onGoHome }: HubMobileDisclaimerProps) {
  const { chrome } = useAppearance();
  return (
    <LOFIModal
      open={open}
      onClose={onProceed}
      className="hub-disclaimer"
      title={chrome.disclaimerTitle}
      footer={
        <>
          <LOFIButton variant="primary" onClick={onProceed}>
            {chrome.disclaimerProceed}
          </LOFIButton>
          <LOFIButton variant="dismiss" onClick={onGoHome}>
            {chrome.disclaimerHome}
          </LOFIButton>
        </>
      }
    >
      <LOFIText as="p" variant="body">
        {chrome.disclaimerBody}
      </LOFIText>
    </LOFIModal>
  );
}
