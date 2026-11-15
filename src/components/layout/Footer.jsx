import { Link } from 'react-router-dom';
import { TriangleAlert } from 'lucide-react';
import Logo from '../ui/Logo';
import { isBlank, PlaceholderText } from '../ui/Primitives';
import { useCookies } from '../../context/CookieContext';
import { useCompliance, useSiteData } from '../../context/SiteDataContext';
import { mainLinks } from './Navbar';
import { useT } from '../../i18n/I18nContext';

const legalLinks = [
  { to: '/privacy', label: 'Privacy Policy' },
  { to: '/terms', label: 'Terms' },
  { to: '/risk-disclosure', label: 'Risk Disclosure' },
  { to: '/cookies', label: 'Cookie Policy' },
];

export default function Footer() {
  const { reopen } = useCookies();
  const t = useT();
  const compliance = useCompliance();
  const { data } = useSiteData();
  const company = data?.company;
  const details = company
    ? [
        [t('Legal entity'), company.legalEntityName],
        [t('Registration no.'), company.registrationNumber],
        [t('Registered address'), company.registeredAddress],
        [t('Licence status'), company.licenceStatus],
      ].filter(([, value]) => !isBlank(value))
    : [];
  return (
    <footer className="mt-20 border-t border-line pb-20 lg:pb-0">
      <section aria-label={t('Risk warning')} className="border-b border-line bg-red/8">
        <div className="shell flex gap-3 py-5 text-sm leading-relaxed">
          <TriangleAlert className="mt-0.5 size-5 shrink-0 text-red" aria-hidden="true" />
          <p>
            <strong className="font-semibold">{t('Risk warning:')} </strong>
            {compliance.riskWarning}
            {!isBlank(compliance.retailLossPercent) && (
              <>
                {' '}
                <PlaceholderText text={`${compliance.retailLossPercent}%`} /> {compliance.retailLossSentence}
              </>
            )}
          </p>
        </div>
      </section>

      <div className="shell grid gap-10 py-12 md:grid-cols-12">
        <div className="md:col-span-5">
          <Logo />
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted">{t('The right broker starts with the right partner.')}</p>
          {details.length > 0 && <dl className="mt-6 grid gap-1.5 text-xs text-muted">
            {details.map(([label, value]) => (
              <div key={label} className="flex flex-wrap gap-x-2 gap-y-1">
                <dt className="text-faint">{label}:</dt>
                <dd>
                  <PlaceholderText text={value} />
                </dd>
              </div>
            ))}
          </dl>}
        </div>

        <nav aria-label={t('Footer pages')} className="md:col-span-3">
          <h2 className="mb-3 text-sm font-semibold">{t('Explore')}</h2>
          <ul className="grid text-sm text-muted lg:gap-2">
            {mainLinks.map(({ to, label }) => (
              <li key={to}>
                <Link to={to} className="flex min-h-10 items-center hover:text-ink lg:inline-flex lg:min-h-0">{t(label)}</Link>
              </li>
            ))}
            <li>
              <Link to="/book" className="flex min-h-10 items-center hover:text-ink lg:inline-flex lg:min-h-0">{t('Book a Consultation')}</Link>
            </li>
            <li>
              <Link to="/partner-with-us" className="flex min-h-10 items-center hover:text-ink lg:inline-flex lg:min-h-0">{t('Partner with us')}</Link>
            </li>
          </ul>
        </nav>

        <nav aria-label={t('Legal')} className="md:col-span-4">
          <h2 className="mb-3 text-sm font-semibold">{t('Legal')}</h2>
          <ul className="grid text-sm text-muted lg:gap-2">
            {legalLinks.map(({ to, label }) => (
              <li key={to}>
                <Link to={to} className="flex min-h-10 items-center hover:text-ink lg:inline-flex lg:min-h-0">{t(label)}</Link>
              </li>
            ))}
            <li>
              <button type="button" onClick={reopen} className="flex min-h-10 items-center hover:text-ink lg:inline-flex lg:min-h-0">{t('Cookie settings')}</button>
            </li>
          </ul>
        </nav>
      </div>

      <div className="border-t border-line">
        <div className="shell grid gap-3 py-6 text-xs leading-relaxed text-faint">
          <p>
            <strong className="font-medium text-muted">{t('Compensation disclosure:')} </strong>
            {compliance.compensationDisclosure}
          </p>
          <p>
            <strong className="font-medium text-muted">{t('General information only:')} </strong>
            {compliance.notAdvice}
          </p>
          <p>{t('© {year} MKPips. All rights reserved.', { year: new Date().getFullYear() })}</p>
        </div>
      </div>
    </footer>
  );
}
