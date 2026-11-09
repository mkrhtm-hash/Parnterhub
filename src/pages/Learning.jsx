import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { BookOpen, CalendarDays, Check, Clock, Download, PlayCircle, SearchX, X } from 'lucide-react';
import Button from '../components/ui/Button';
import { IconTile, PageHeader, Reveal } from '../components/ui/Primitives';
import { usePageMeta } from '../hooks/usePageMeta';
import { useCompliance, useSiteData } from '../context/SiteDataContext';

const filters = [
  { id: 'all', label: 'All' },
  { id: 'video', label: 'Videos' },
  { id: 'ebook', label: 'Ebooks' },
];

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
        <button type="button" onClick={onClose} aria-label="Close video" className="grid size-11 shrink-0 place-items-center rounded-full border border-line hover:border-emerald/60">
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
  const isVideo = item.kind === 'video';
  return (
    <article className="glass lift flex h-full flex-col p-6">
      <div className="flex items-start justify-between gap-3">
        <IconTile icon={isVideo ? PlayCircle : BookOpen} tone={isVideo ? 'emerald' : 'gold'} />
        <p className="text-right text-xs font-medium text-muted">
          {isVideo ? 'Video' : 'Ebook'} · {item.level}
        </p>
      </div>
      <h2 className="mt-5 text-xl font-semibold">{item.title}</h2>
      <p className="mt-2 text-sm leading-relaxed text-muted">{item.summary}</p>

      <h3 className="mt-5 text-xs font-semibold text-ink">What you will learn</h3>
      <ul className="mt-2 mb-6 grid gap-2 text-sm text-muted">
        {item.topics.map((topic) => (
          <li key={topic} className="flex gap-2">
            <Check className="mt-0.5 size-4 shrink-0 text-emerald" aria-hidden="true" />
            {topic}
          </li>
        ))}
      </ul>

      <div className="mt-auto flex items-center justify-between gap-3">
        {item.lengthLabel ? (
          <span className="inline-flex items-center gap-1.5 text-xs text-muted">
            <Clock className="size-3.5" aria-hidden="true" />
            {item.lengthLabel}
          </span>
        ) : (
          <span />
        )}
        {!item.url && (
          <span className="inline-flex min-h-11 items-center rounded-full border border-dashed border-gold/60 bg-gold/10 px-4 text-xs font-medium text-gold">Coming soon</span>
        )}
        {item.url && isVideo && (
          <Button onClick={() => onPlay(item)} className="!min-h-11 !py-2">
            <PlayCircle className="size-4" aria-hidden="true" />
            Watch
          </Button>
        )}
        {item.url && !isVideo && (
          <Button href={item.url} className="!min-h-11 !py-2">
            <Download className="size-4" aria-hidden="true" />
            Read ebook
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
  usePageMeta('Learning', 'Educational videos and ebooks on brokers, CFDs, leverage and trading costs, each showing what you will learn.');
  const [filter, setFilter] = useState('all');
  const [video, setVideo] = useState(null);
  const shown = learning.filter((item) => filter === 'all' || item.kind === filter);

  return (
    <>
      <PageHeader
        eyebrow="Learning"
        title="Understand it before you trade it."
        intro="Short videos and ebooks in plain English. Each one shows what you will learn before you start."
      />

      <section className="shell">
        <div role="group" aria-label="Filter by format" className="grid max-w-md grid-cols-3 gap-1 rounded-2xl border border-line bg-[var(--glass)] p-1.5">
          {filters.map(({ id, label }) => {
            const active = id === filter;
            return (
              <button
                key={id}
                type="button"
                aria-pressed={active}
                onClick={() => setFilter(id)}
                className={`relative min-h-11 rounded-xl px-2 text-sm font-semibold transition-colors ${active ? 'text-on-accent' : 'text-muted hover:text-ink'}`}
              >
                {active && <motion.span layoutId="learning-pill" className="bg-brand absolute inset-0 rounded-xl" transition={{ type: 'spring', stiffness: 340, damping: 30 }} />}
                <span className="relative">{label}</span>
              </button>
            );
          })}
        </div>

        {shown.length === 0 ? (
          <div className="glass mt-6 p-10 text-center md:p-14">
            <SearchX className="mx-auto size-8 text-gold" aria-hidden="true" />
            <h2 className="mt-4 text-xl font-semibold">Nothing here yet</h2>
            <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-muted">New lessons will appear here as soon as they are ready.</p>
          </div>
        ) : (
          <motion.div layout className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence initial={false}>
              {shown.map((item) => (
                <motion.div key={item.id} layout initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.97 }} transition={{ duration: 0.22 }}>
                  <LessonCard item={item} onPlay={setVideo} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        <p className="mt-6 text-xs leading-relaxed text-faint">{notAdvice}</p>

        <Reveal className="glass mt-10 flex flex-col items-start justify-between gap-5 p-7 md:flex-row md:items-center md:p-10">
          <div>
            <h2 className="text-2xl font-semibold">Still unsure where to begin?</h2>
            <p className="mt-2 leading-relaxed text-muted">Tell us your experience and we will point you to the right starting place.</p>
          </div>
          <Button to="/book" className="shrink-0">
            <CalendarDays className="size-4" aria-hidden="true" />
            Book a call
          </Button>
        </Reveal>
      </section>

      {video && <VideoDialog video={video} onClose={() => setVideo(null)} />}
    </>
  );
}
