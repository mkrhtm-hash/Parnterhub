import { Info } from 'lucide-react';
import Button from '../components/ui/Button';
import { isBlank, PlaceholderText } from '../components/ui/Primitives';
import { usePageMeta } from '../hooks/usePageMeta';
import { useCookies } from '../context/CookieContext';
import { useCompliance, useSiteData } from '../context/SiteDataContext';
import { useI18n } from '../i18n/I18nContext';

export default function Legal({ page }) {
  const { company, legalPages } = useSiteData().data;
  const compliance = useCompliance();
  const { title, intro, sections } = legalPages[page];
  const { reopen, choice } = useCookies();
  const { t, lang } = useI18n();
  usePageMeta(title);

  return (
    <article className="shell pt-10 md:pt-20">
      <div className="mx-auto max-w-3xl">
        <p className="eyebrow mb-3">{t('Legal')}</p>
        <h1 className="text-4xl font-semibold md:text-5xl">{title}</h1>
        {!isBlank(company.lastLegalUpdate) && <p className="mt-3 text-sm text-faint">{t('Last reviewed:')} <PlaceholderText text={company.lastLegalUpdate} /></p>}
        <p className="mt-6 flex gap-2 rounded-2xl border border-dashed border-green/60 bg-green/8 p-4 text-sm text-green">
          <Info className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
          {intro}
        </p>
        {lang !== 'en' && (
          <p className="mt-3 rounded-2xl border border-line bg-[var(--glass)] p-4 text-sm leading-relaxed text-muted">
            {t('This is a translation for your convenience. The English version is the legally binding one, and it applies if the two versions differ.')}
          </p>
        )}

        {page === 'risk' && (
          <p className="mt-6 leading-relaxed font-medium">
            {compliance.riskWarning}
            {!isBlank(compliance.retailLossPercent) && <> <PlaceholderText text={`${compliance.retailLossPercent}%`} /> {compliance.retailLossSentence}</>}
          </p>
        )}

        <div className="prose-legal">
          {sections.filter(({ body }) => !isBlank(body)).map(({ heading, body }) => (
            <section key={heading}>
              <h2>{heading}</h2>
              <p><PlaceholderText text={body} /></p>
            </section>
          ))}
        </div>

        {page === 'cookies' && (
          <div className="mt-6 flex flex-wrap items-center gap-4">
            <Button variant="ghost" onClick={reopen}>{t('Change cookie choice')}</Button>
            <p className="text-sm text-muted">{t('Current choice:')} {t(choice === 'accepted' ? 'accepted' : choice === 'declined' ? 'declined' : 'none yet')}</p>
          </div>
        )}
      </div>
    </article>
  );
}
