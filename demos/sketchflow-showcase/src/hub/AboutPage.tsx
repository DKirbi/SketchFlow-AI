import { LOFIText } from 'lofi-kit';
import { ABOUT_COPY } from '../appearance/aboutCopy';
import { useAppearance } from '../appearance/AppearanceProvider';
import './AboutPage.scss';

export function AboutPage() {
  const { locale } = useAppearance();
  const copy = ABOUT_COPY[locale];

  return (
    <article className="hub-about">
      {copy.sections.map((section, index) => (
        <section key={section.heading} className="hub-about__section">
          <LOFIText
            as={index === 0 ? 'h1' : 'h2'}
            variant="strong"
            className="hub-about__heading"
          >
            {section.heading}
          </LOFIText>
          <div className="hub-about__body">
            {section.paragraphs.map((paragraph) => (
              <LOFIText
                key={paragraph}
                as="p"
                variant="body"
                className="hub-about__paragraph"
              >
                {paragraph}
              </LOFIText>
            ))}
          </div>
        </section>
      ))}
    </article>
  );
}
