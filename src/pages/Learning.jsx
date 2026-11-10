import { useEffect, useRef, useState } from 'react';
import { Navigate, NavLink, useParams } from 'react-router-dom';
import { BookOpen, CalendarDays, ChartCandlestick, Check, Clock, Download, PlayCircle, Presentation, SearchX, X } from 'lucide-react';
import Button from '../components/ui/Button';
import OpinionForm from '../components/learning/OpinionForm';
import Book from './Book';
import { IconTile, PageHeader, Reveal } from '../components/ui/Primitives';
import { expertSessions } from '../../shared/expertSessions';
import { usePageMeta } from '../hooks/usePageMeta';
import { useCompliance, useSiteData } from '../context/SiteDataContext';

const sections = [
  { slug: 'videos', label: 'Videos', kind: 'video' },
  { slug: 'ebooks', label: 'eBook', kind: 'ebook' },
  { slug: 'webinars', label: 'Webinar', kind: 'webinar' },
  { slug: 'market-expert', label: 'Book with Market Expert' },
  { slug: 'your-opinion', label: 'Your Opinion' },
];

const kinds = {
  video: { label: 'Video', Icon: PlayCircle, tone: 'blue' },
  ebook: { label: 'eBook', Icon: BookOpen, tone: 'green' },
  webinar: { label: 'Webinar', Icon: Presentation, tone: 'red' },
};

const expertTopics = [
  'How a market such as gold, oil or a major currency pair tends to move, and why',
  'Reading an economic calendar and what big announcements can do to prices',
  'Spreads, swaps, leverage and margin, worked through with examples',
  'Questions from your own learning so far',
];

const expertSteps = [
  'Choose a session price, pick a day and time, and tell us what you want to cover.',
  'We email you to confirm the slot and how to pay.',
  'Your slot is booked once payment is received. Nothing is charged on this website.',
];

function ExpertIntro() {
  return (
    <Reveal className="glass mb-5 grid gap-6 p-6 md:grid-cols-[auto_1fr] md:p-8">
      <IconTile icon={ChartCandlestick} tone="green" />
      <div>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <h2 className="text-2xl font-semibold">A paid one-to-one session with a market expert</h2>
          <p className="rounded-full border border-green/50 bg-green/10 px-4 py-1.5 text-sm font-semibold text-green">
            From {expertSessions[0].price} per session
          </p>
        </div>
        <p className="mt-2 leading-relaxed text-muted">Tell us what you want to understand and an experienced member of our team will walk you through it on a call, in plain English.</p>
        <h3 className="mt-5 text-xs font-semibold text-ink">How booking works</h3>
        <ol className="mt-2 grid gap-2 text-sm text-muted sm:grid-cols-3">
          {expertSteps.map((step, i) => (
            <li key={step} className="flex gap-2">
              <span className="bg-brand grid size-5 shrink-0 place-items-center rounded-full text-xs font-semibold">{i + 1}</span>
              {step}
            </li>
          ))}
        </ol>
        <h3 className="mt-5 text-xs font-semibold text-ink">You could cover</h3>
        <ul className="mt-2 grid gap-2 text-sm text-muted sm:grid-cols-2">
          {expertTopics.map((topic) => (
            <li key={topic} className="flex gap-2">
              <Check className="mt-0.5 size-4 shrink-0 text-blue" aria-hidden="true" />
              {topic}
            </li>
          ))}
        </ul>
        <p className="mt-5 rounded-2xl border border-line bg-[var(--glass)] p-4 text-xs leading-relaxed text-muted">Sessions are for education only. We will not tell you what to buy or sell, when to trade or how much to invest, and nothing said on the call is investment advice.</p>
      </div>
    </Reveal>
  );
}

const webinarDate = (value) =>
  new Date(value).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' });

/** Turns a YouTube or Vimeo page link into its embeddable address. Other links play as a video file. */
function embedUrl(link) {
  const url = new URL(link, window.location.origin);
  const host = url.hostname.replace(/^www\./, '');
  if (host === 'youtu.be') return `https://www.youtube-nocookie.com/embed/${url.pathname.slice(1)}`;
  if (host === 'youtube.com' || host === 'm.youtube.com') {
    const id = url.searchParams.get('v') ?? url.pathname.split('/').pop();
    return `https://www.youtube-nocookie.com/embed/${id}`;
  }
  if (host === 'vimeo.com') return `https://player.vimeo.com/video/${url.pathname.split('/').pop()}?dnt=1`;
  return null;
}

function VideoDialog({ video, onClose }) {
  const ref = useRef(null);
  const embed = embedUrl(video.url);

  useEffect(() => {
    ref.current.showModal();
  }, []);

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(e) => e.target === ref.current && onClose()}
      aria-labelledby="video-title"
      className="m-auto w-[min(60rem,calc(100vw-1.5rem))] rounded-3xl border border-line text-ink shadow-2xl backdrop:bg-black/70 backdrop:backdrop-blur-sm"
      style={{ background: 'var(--bg-2)' }}
    >
      <div className="flex items-center justify-between gap-3 p-4 md:p-5">
        <h2 id="video-title" className="text-lg font-semibold md:text-xl">{video.title}</h2>
        <button type="button" onClick={onClose} aria-label="Close video" className="grid size-11 shrink-0 place-items-center rounded-full border border-line hover:border-blue/60">
          <X className="size-4" aria-hidden="true" />
        </button>
      </div>
      <div className="aspect-video bg-black">
        {embed ? (
          <iframe src={embed} title={video.title} className="size-full" allow="encrypted-media; picture-in-picture; fullscreen" />
        ) : (
          <video src={video.url} controls className="size-full" />
        )}
      </div>
    </dialog>
  );
}

function LessonCard({ item, onPlay }) {
  const { label, Icon, tone } = kinds[item.kind];
  const isPast = item.startsAt && new Date(item.startsAt) < new Date();
  const when = item.kind === 'webinar' && item.startsAt ? webinarDate(item.startsAt) : item.lengthLabel;
  return (
    <article className="glass lift flex h-full flex-col p-6">
      <div className="flex items-start justify-between gap-3">
        <IconTile icon={Icon} tone={tone} />
        <p className="text-right text-xs font-medium text-muted">
          {label} · {item.level}
        </p>
      </div>
      <h2 className="mt-5 text-xl font-semibold">{item.title}</h2>
      <p className="mt-2 text-sm leading-relaxed text-muted">{item.summary}</p>

      <h3 className="mt-5 text-xs font-semibold text-ink">What you will learn</h3>
      <ul className="mt-2 mb-6 grid gap-2 text-sm text-muted">
        {item.topics.map((topic) => (
          <li key={topic} className="flex gap-2">
            <Check className="mt-0.5 size-4 shrink-0 text-blue" aria-hidden="true" />
            {topic}
          </li>
        ))}
      </ul>

      <div className="mt-auto flex items-center justify-between gap-3">
        {when ? (
          <span className="inline-flex items-center gap-1.5 text-xs text-muted">
            <Clock className="size-3.5" aria-hidden="true" />
            {when}
          </span>
        ) : (
          <span />
        )}
        {!item.url && (
          <span className="inline-flex min-h-11 items-center rounded-full border border-dashed border-green/60 bg-green/10 px-4 text-xs font-medium text-green">{item.kind === 'webinar' ? 'Date to be announced' : 'Coming soon'}</span>
        )}
        {item.url && item.kind === 'video' && (
          <Button onClick={() => onPlay(item)} className="!min-h-11 !py-2">
            <PlayCircle className="size-4" aria-hidden="true" />
            Watch
          </Button>
        )}
        {item.url && item.kind !== 'video' && (
          <Button href={item.url} className="!min-h-11 !py-2">
            {item.kind === 'ebook' && <Download className="size-4" aria-hidden="true" />}
            {item.kind === 'ebook' ? 'Read eBook' : isPast ? 'Watch recording' : 'Register'}
            <span className="sr-only">(opens in a new tab)</span>
          </Button>
        )}
      </div>
    </article>
  );
}

export default function Learning() {
  const { learning } = useSiteData().data;
  const { notAdvice } = useCompliance();
  const { section: slug } = useParams();
  const section = sections.find((s) => s.slug === slug);
  usePageMeta(section ? `${section.label} | Learning` : 'Learning', 'Educational videos, ebooks and webinars on brokers, CFDs, leverage and trading costs, plus one-to-one sessions with a market expert.');
  const [video, setVideo] = useState(null);

  if (!section) return <Navigate to="/learning/videos" replace />;
  const shown = learning.filter((item) => item.kind === section.kind);

  return (
    <>
      <PageHeader
        eyebrow="Learning"
        title="Understand it before you trade it."
        intro="Short videos, ebooks and webinars in plain English. Each one shows what you will learn before you start."
      />

      <section className="shell">
        <nav aria-label="Learning sections" className="grid max-w-4xl grid-cols-2 gap-1 rounded-2xl border border-line bg-[var(--glass)] p-1.5 sm:grid-cols-3 lg:grid-cols-5">
          {sections.map(({ slug: to, label }) => (
            <NavLink
              key={to}
              to={`/learning/${to}`}
              className={({ isActive }) => `flex min-h-11 items-center justify-center rounded-xl px-2 py-1.5 text-center text-sm leading-tight font-semibold transition-colors ${isActive ? 'bg-brand text-on-accent' : 'text-muted hover:text-ink'}`}
            >
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="mt-6">
          {slug === 'market-expert' ? (
            <>
              <ExpertIntro />
              <Book expert />
            </>
          ) : !section.kind ? (
            <OpinionForm />
          ) : shown.length === 0 ? (
            <div className="glass p-10 text-center md:p-14">
              <SearchX className="mx-auto size-8 text-green" aria-hidden="true" />
              <h2 className="mt-4 text-xl font-semibold">Nothing here yet</h2>
              <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-muted">New lessons will appear here as soon as they are ready.</p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {shown.map((item) => (
                <Reveal key={item.id}>
                  <LessonCard item={item} onPlay={setVideo} />
                </Reveal>
              ))}
            </div>
          )}
        </div>

        <p className="mt-6 text-xs leading-relaxed text-faint">{notAdvice}</p>

        {slug !== 'market-expert' && <Reveal className="glass mt-10 flex flex-col items-start justify-between gap-5 p-7 md:flex-row md:items-center md:p-10">
          <div>
            <h2 className="text-2xl font-semibold">Still unsure where to begin?</h2>
            <p className="mt-2 leading-relaxed text-muted">Tell us your experience and we will point you to the right starting place.</p>
          </div>
          <Button to="/book" className="shrink-0">
            <CalendarDays className="size-4" aria-hidden="true" />
            Book a call
          </Button>
        </Reveal>}
      </section>

      {video && <VideoDialog video={video} onClose={() => setVideo(null)} />}
    </>
  );
}
