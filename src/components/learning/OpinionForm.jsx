import { useState } from 'react';
import { CircleCheck, Star, TriangleAlert } from 'lucide-react';
import Button from '../ui/Button';
import { useToast } from '../../context/ToastContext';
import { submitOpinion } from '../../services/leads';

const topics = [
  { value: 'video', label: 'Videos' },
  { value: 'ebook', label: 'eBooks' },
  { value: 'webinar', label: 'Webinars' },
  { value: 'general', label: 'Something else' },
];

const empty = { name: '', topic: 'general', rating: null, message: '', website: '' };

function FieldError({ id, text }) {
  if (!text) return null;
  return (
    <p id={id} className="mt-1.5 flex gap-1.5 text-sm text-danger">
      <TriangleAlert className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
      {text}
    </p>
  );
}

export default function OpinionForm() {
  const toast = useToast();
  const [form, setForm] = useState(empty);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle');
  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setStatus('sending');
    setErrors({});
    try {
      await submitOpinion(form);
      setForm(empty);
      setStatus('sent');
      toast('Thank you. Your opinion has been saved.', 'success');
    } catch (error) {
      setErrors(error.fields ?? {});
      setStatus('idle');
      toast(error.fields ? 'Please check the highlighted fields.' : 'We could not save that. Please try again in a moment.', 'error');
    }
  };

  if (status === 'sent') {
    return (
      <div className="glass mx-auto max-w-2xl p-8 text-center md:p-12">
        <CircleCheck className="mx-auto size-10 text-blue" aria-hidden="true" />
        <h2 className="mt-4 text-2xl font-semibold">Thank you for telling us.</h2>
        <p className="mt-2 leading-relaxed text-muted">Your opinion helps us decide what to teach next.</p>
        <Button variant="ghost" className="mt-6" onClick={() => setStatus('idle')}>Share another opinion</Button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} noValidate className="glass mx-auto grid max-w-2xl gap-5 p-5 md:p-7">
      <div>
        <h2 className="text-xl font-semibold">Tell us what you think</h2>
        <p className="mt-1 text-sm leading-relaxed text-muted">What helped, what was unclear, and what would you like to learn next?</p>
      </div>

      <input type="text" name="website" value={form.website} onChange={update('website')} tabIndex={-1} autoComplete="off" aria-hidden="true" className="sr-only" />

      <div>
        <label htmlFor="opinion-topic" className="mb-1.5 block text-sm font-medium">What is your opinion about?</label>
        <select id="opinion-topic" value={form.topic} onChange={update('topic')} className="field">
          {topics.map((t) => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </select>
        <FieldError id="opinion-topic-error" text={errors.topic} />
      </div>

      <fieldset>
        <legend className="mb-1.5 text-sm font-medium">How useful is our learning content? <span className="font-normal text-faint">(optional)</span></legend>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              aria-label={`${n} out of 5`}
              aria-pressed={form.rating === n}
              onClick={() => setForm((f) => ({ ...f, rating: f.rating === n ? null : n }))}
              className="grid size-11 place-items-center rounded-xl text-green transition-colors hover:bg-green/10"
            >
              <Star className={`size-6 ${form.rating >= n ? 'fill-current' : ''}`} aria-hidden="true" />
            </button>
          ))}
        </div>
        <FieldError id="opinion-rating-error" text={errors.rating} />
      </fieldset>

      <div>
        <label htmlFor="opinion-message" className="mb-1.5 block text-sm font-medium">Your opinion</label>
        <textarea
          id="opinion-message"
          rows={5}
          maxLength={2000}
          value={form.message}
          onChange={update('message')}
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? 'opinion-message-error' : undefined}
          className="field"
        />
        <FieldError id="opinion-message-error" text={errors.message} />
      </div>

      <div>
        <label htmlFor="opinion-name" className="mb-1.5 block text-sm font-medium">Your name <span className="font-normal text-faint">(optional)</span></label>
        <input id="opinion-name" type="text" autoComplete="name" maxLength={100} value={form.name} onChange={update('name')} className="field" />
        <FieldError id="opinion-name-error" text={errors.name} />
      </div>

      <p className="text-xs leading-relaxed text-faint">Your opinion goes privately to the MKPips team and is not published. Please do not include account numbers or other sensitive details.</p>

      <Button type="submit" disabled={status === 'sending'} className="w-full">
        {status === 'sending' ? 'Sending...' : 'Send my opinion'}
      </Button>
    </form>
  );
}
