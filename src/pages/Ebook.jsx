import { Link, Navigate, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, BookOpen, CalendarDays, Check, Lightbulb, Printer, TriangleAlert } from 'lucide-react';
import Button from '../components/ui/Button';
import { usePageMeta } from '../hooks/usePageMeta';
import { useCompliance } from '../context/SiteDataContext';
import { findEbook } from '../data/ebooks';

function Block({ block }) {
  if (block.h) return <h3 className="mt-7 text-lg font-semibold">{block.h}</h3>;
  if (block.p) return <p className="mt-4 leading-relaxed text-muted">{block.p}</p>;
  if (block.list) {
    return (
      <ul className="mt-4 grid gap-2.5 text-muted">
        {block.list.map((item) => (
          <li key={item} className="flex gap-2.5 leading-relaxed">
            <Check className="mt-1 size-4 shrink-0 text-blue" aria-hidden="true" />
            {item}
          </li>
        ))}
      </ul>
    );
  }
  if (block.steps) {
    return (
      <ol className="mt-4 grid gap-3 text-muted">
        {block.steps.map((item, i) => (
          <li key={item} className="flex gap-3 leading-relaxed">
            <span className="bg-brand mt-0.5 grid size-6 shrink-0 place-items-center rounded-full text-xs font-semibold">{i + 1}</span>
            {item}
          </li>
        ))}
      </ol>
    );
  }
  if (block.example) {
    return (
      <figure className="mt-5 rounded-2xl border border-green/40 bg-green/8 p-5">
        <figcaption className="text-xs font-semibold tracking-wide text-green uppercase">{block.example.title}</figcaption>
        <ul className="mt-3 grid gap-1.5 text-sm leading-relaxed text-ink tabular-nums">
          {block.example.lines.map((line) => <li key={line}>{line}</li>)}
        </ul>
      </figure>
    );
  }
  if (block.note) {
    return (
      <p className="mt-5 flex gap-3 rounded-2xl border border-blue/40 bg-blue/8 p-4 text-sm leading-relaxed text-ink">
        <Lightbulb className="mt-0.5 size-4 shrink-0 text-blue" aria-hidden="true" />
        <span><strong className="font-semibold">Key point: </strong>{block.note}</span>
      </p>
    );
  }
  if (block.warn) {
    return (
      <p className="mt-5 flex gap-3 rounded-2xl border border-red/40 bg-red/8 p-4 text-sm leading-relaxed text-ink">
        <TriangleAlert className="mt-0.5 size-4 shrink-0 text-red" aria-hidden="true" />
        <span>{block.warn}</span>
      </p>
    );
  }
  return null;
}

function PageBody({ page, number }) {
  return (
    <>
      <p className="eyebrow">Page {number}</p>
      <h2 className="mt-2 text-2xl font-semibold md:text-3xl">{page.title}</h2>
      {page.blocks.map((block, i) => <Block key={i} block={block} />)}
    </>
  );
}

/** Reads one eBook a page at a time, at /learning/ebooks/:bookId/:page. */
export default function Ebook() {
  const { bookId, page: pageParam = '1' } = useParams();
  const book = findEbook(bookId);
  const { notAdvice } = useCompliance();
  const index = Number(pageParam) - 1;
  const page = book?.pages[index];
  usePageMeta(book ? `${book.title}${page ? `, page ${index + 1}` : ''} | eBook` : 'eBook', book?.subtitle);

  if (!book) return <Navigate to="/learning/ebooks" replace />;
  if (!page) return <Navigate to={`/learning/ebooks/${book.id}`} replace />;
  const total = book.pages.length;
  const href = (i) => `/learning/ebooks/${book.id}/${i + 1}`;

  return (
    <article className="shell pt-10 md:pt-20">
      <div className="print:hidden">
        <Link to="/learning/ebooks" className="inline-flex min-h-11 items-center gap-2 text-sm font-medium text-muted hover:text-ink">
          <ArrowLeft className="size-4" aria-hidden="true" />
          All eBooks
        </Link>
      </div>

      <div className="mt-4 max-w-3xl">
        <p className="eyebrow flex items-center gap-2"><BookOpen className="size-4" aria-hidden="true" />MKPips eBook</p>
        <h1 className="mt-3 text-4xl font-semibold md:text-5xl">{book.title}</h1>
        <p className="mt-4 text-lg leading-relaxed text-muted">{book.subtitle}</p>
      </div>

      <div className="mt-10 grid items-start gap-6 lg:grid-cols-[16rem_1fr] print:hidden">
        <nav aria-label="Contents" className="glass p-4 lg:sticky lg:top-24">
          <p className="px-2 pb-2 text-xs font-semibold tracking-wide text-faint uppercase">Contents</p>
          <ol className="grid gap-0.5">
            {book.pages.map((p, i) => (
              <li key={p.title}>
                <Link
                  to={href(i)}
                  aria-current={i === index ? 'page' : undefined}
                  className={`flex min-h-11 items-center gap-2.5 rounded-xl px-2 py-1.5 text-sm leading-snug transition-colors ${i === index ? 'bg-blue/12 font-semibold text-blue' : 'text-muted hover:text-ink'}`}
                >
                  <span className="w-4 shrink-0 text-right tabular-nums">{i + 1}</span>
                  {p.title}
                </Link>
              </li>
            ))}
          </ol>
          <button type="button" onClick={() => window.print()} className="mt-3 flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-line text-sm font-medium hover:border-blue/60">
            <Printer className="size-4" aria-hidden="true" />
            Print or save as PDF
          </button>
        </nav>

        <div>
          <div className="mb-3 flex items-center gap-3 text-xs text-muted">
            <span className="tabular-nums">Page {index + 1} of {total}</span>
            <span className="h-1 flex-1 overflow-hidden rounded-full bg-line" aria-hidden="true">
              <span className="bg-brand block h-full rounded-full transition-[width] duration-500" style={{ width: `${((index + 1) / total) * 100}%` }} />
            </span>
          </div>
          <section className="glass p-6 md:p-10">
            <PageBody page={page} number={index + 1} />
          </section>

          <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
            {index > 0 ? (
              <Button to={href(index - 1)} variant="ghost">
                <ArrowLeft className="size-4" aria-hidden="true" />
                Previous
              </Button>
            ) : <span />}
            {index < total - 1 ? (
              <Button to={href(index + 1)}>
                Next: {book.pages[index + 1].title}
                <ArrowRight className="size-4" aria-hidden="true" />
              </Button>
            ) : (
              <Button to="/learning/market-expert">
                <CalendarDays className="size-4" aria-hidden="true" />
                Ask a market expert
              </Button>
            )}
          </div>
          <p className="mt-6 text-xs leading-relaxed text-faint">{notAdvice}</p>
        </div>
      </div>

      {/* The whole book, shown only when printing or saving as PDF. */}
      <div className="hidden print:block">
        {book.pages.map((p, i) => (
          <section key={p.title} className="mt-10 break-inside-avoid-page">
            <PageBody page={p} number={i + 1} />
          </section>
        ))}
        <p className="mt-10 text-xs">{notAdvice} © MKPips. Written for MKPips readers.</p>
      </div>
    </article>
  );
}
