import { getSql } from './_lib/db.js';
import { route } from './_lib/handler.js';

const text = (value) => (typeof value === 'string' ? value.trim() : '');
const TOPICS = ['video', 'ebook', 'webinar', 'general'];

function validate({ name, topic, rating, message }) {
  const errors = {};
  if (name.length > 100) errors.name = 'Please keep this under 100 characters.';
  if (!TOPICS.includes(topic)) errors.topic = 'Please choose what your opinion is about.';
  if (rating !== null && !(Number.isInteger(rating) && rating >= 1 && rating <= 5)) errors.rating = 'Please choose from 1 to 5 stars.';
  if (message.length < 5) errors.message = 'Please write a few words so we can act on it.';
  if (message.length > 2000) errors.message = 'Please keep this under 2000 characters.';
  return errors;
}

/** Saves a message from the Your Opinion tab. Never returns stored feedback. */
export default route({
  POST: async (req, res) => {
    const body = req.body && typeof req.body === 'object' ? req.body : {};

    // Hidden field that people never see. Bots fill it in, and get a normal reply with nothing saved.
    if (text(body.website)) return res.status(201).json({ ok: true });

    const opinion = { name: text(body.name), topic: text(body.topic), rating: body.rating ?? null, message: text(body.message) };
    const errors = validate(opinion);
    if (Object.keys(errors).length) {
      return res.status(400).json({ error: 'validation_failed', message: 'Please check the highlighted fields.', fields: errors });
    }

    const sql = getSql();
    await sql`INSERT INTO learning_feedback (name, topic, rating, message)
              VALUES (${opinion.name}, ${opinion.topic}, ${opinion.rating}, ${opinion.message})`;
    return res.status(201).json({ ok: true });
  },
});
