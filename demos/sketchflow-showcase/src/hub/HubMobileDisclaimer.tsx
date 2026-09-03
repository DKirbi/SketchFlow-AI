import { LOFIButton, LOFIModal, LOFIText } from 'lofi-kit';

interface HubMobileDisclaimerProps {
  open: boolean;
  onProceed: () => void;
  onGoHome: () => void;
}

export function HubMobileDisclaimer({ open, onProceed, onGoHome }: HubMobileDisclaimerProps) {
  return (
    <LOFIModal
      open={open}
      onClose={onProceed}
      className="hub-disclaimer"
      title="Showcase of AI Examples works best on Desktop"
      footer={
        <>
          <LOFIButton variant="primary" onClick={onProceed}>
            Proceed in Desktop view
          </LOFIButton>
          <LOFIButton variant="dismiss" onClick={onGoHome}>
            Go back home
          </LOFIButton>
        </>
      }
    >
      <LOFIText as="p" variant="body">
        Showcase contains a lot of AI Examples featuring corporate desktop applications, which were
        originally meant for desktop interfaces. There are no current mobile showcases available yet.
      </LOFIText>
    </LOFIModal>
  );
}
