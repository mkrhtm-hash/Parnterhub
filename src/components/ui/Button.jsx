import { Link } from 'react-router-dom';

const base =
  'inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition duration-300 disabled:cursor-not-allowed disabled:opacity-50';

const variants = {
  primary: 'bg-brand shadow-[0_10px_34px_-12px_var(--blue)] hover:-translate-y-0.5 hover:shadow-[0_16px_40px_-10px_var(--blue)]',
  ghost: 'border border-line bg-[var(--glass)] text-ink backdrop-blur hover:-translate-y-0.5 hover:border-blue/60',
  quiet: 'text-muted hover:text-ink',
};

/** Renders a router link with `to`, an outside link with `href`, or a button otherwise. */
export default function Button({ to, href, variant = 'primary', className = '', children, ...props }) {
  const classes = `${base} ${variants[variant]} ${className}`;
  if (to) {
    return (
      <Link to={to} className={classes} {...props}>
        {children}
      </Link>
    );
  }
  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={classes} {...props}>
        {children}
      </a>
    );
  }
  return (
    <button type="button" className={classes} {...props}>
      {children}
    </button>
  );
}
