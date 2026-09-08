import { LOFIBadge, LOFIComponentSet, LOFIText, exampleById } from 'lofi-kit';

export function SetExampleFrame({
  id,
  framed,
}: {
  id: string;
  framed?: boolean;
}) {
  const example = exampleById(id);
  if (!example) {
    return <LOFIText variant="muted">Unknown example: {id}</LOFIText>;
  }
  const isOverlay = example.set.kind === 'modal-editor' || example.set.kind === 'p7-confirm';
  return (
    <div className={framed ? 'set-gallery set-gallery--padded' : 'set-gallery'}>
      <div className="set-gallery__meta">
        <LOFIText as="h2" variant="body">
          {example.title}
        </LOFIText>
        <LOFIText variant="micro">{example.source}</LOFIText>
        <div className="set-gallery__tags">
          {example.ux.map((tag) => (
            <LOFIBadge key={tag} variant="id" label={tag} />
          ))}
          {example.ui.map((tag) => (
            <LOFIBadge key={tag} variant="tag" label={tag} />
          ))}
        </div>
      </div>
      <div className={isOverlay ? undefined : 'set-gallery__view'}>
        <LOFIComponentSet set={example.set} />
      </div>
    </div>
  );
}
