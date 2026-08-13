import { LOFICard, LOFIText } from 'lofi-kit';
import { getDefaultExample, getExampleBySlug, listExamples } from './examples/registry';
import { ShowcaseShell } from './runtime/ShowcaseShell';

function resolveSlug(): string {
  const params = new URLSearchParams(window.location.search);
  return params.get('slug') ?? getDefaultExample().config.slug;
}

export function App() {
  const slug = resolveSlug();
  const example = getExampleBySlug(slug);

  if (!example) {
    const available = listExamples()
      .map((entry) => entry.slug)
      .join(', ');
    return (
      <div className="showcase-shell">
        <LOFICard title="Example not found">
          <LOFIText variant="body">
            Unknown slug &quot;{slug}&quot;. Available examples: {available}.
          </LOFIText>
        </LOFICard>
      </div>
    );
  }

  return <ShowcaseShell example={example} />;
}
