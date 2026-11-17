/**
 * The roadmap ("My Journey") each service gives a client. Used by the site and by the API, so a client can only
 * sign up for a service listed here.
 *
 * When a client signs up for a service, its stops are copied onto their account, each dated `day` days after
 * the start. After that, you set dates and tick stops done in /admin. Editing this file changes the roadmap for
 * new sign-ups only, not for existing clients.
 *
 * id:    saved with the client. Keep it unchanged once clients exist.
 * color: the colour of this service's part of the trail.
 */
export const journeys = [
  {
    id: 'broker-selection',
    title: 'Broker selection consulting',
    color: '#3b82f6',
    stops: [
      { day: 0, title: 'Welcome call and your goals', note: 'We get to know your experience, priorities and where you live.' },
      { day: 3, title: 'Protections that apply to you', note: 'Which regulators cover clients in your country, and what that means for you.' },
      { day: 7, title: 'Licence and legal entity checks', note: 'We check each broker’s licence on the regulator’s own register.' },
      { day: 10, title: 'Your broker short list', note: 'A short list of brokers available to you, with a clear reason for each one.' },
      { day: 14, title: 'Compare costs side by side', note: 'Spreads, commissions and fees laid out so you can compare them yourself.' },
      { day: 17, title: 'Your decision', note: 'You choose, or decide not to go ahead. The decision is always yours.' },
      { day: 30, title: 'Follow-up check-in', note: 'A short call to see how things are going and answer new questions.' },
    ],
  },
  {
    id: 'account-opening',
    title: 'Account opening support',
    color: '#10b981',
    stops: [
      { day: 0, title: 'Kick-off call', note: 'We walk through the account opening steps before you start.' },
      { day: 2, title: 'Documents brokers usually ask for', note: 'Proof of identity and address, and how to get them ready.' },
      { day: 4, title: 'Suitability questions explained', note: 'What the broker’s questions mean, so you can answer them accurately yourself.' },
      { day: 7, title: 'Application sent', note: 'You send your application directly to the broker.' },
      { day: 10, title: 'Verification complete', note: 'The broker has checked your documents. We help if it stalls.' },
      { day: 14, title: 'Platform walkthrough', note: 'A tour of the trading platform’s screens and settings.' },
      { day: 30, title: 'One-month check-in', note: 'A short call to answer anything that has come up.' },
    ],
  },
  {
    id: 'conditions-review',
    title: 'Trading conditions review',
    color: '#8b5cf6',
    stops: [
      { day: 0, title: 'Your trading profile', note: 'What you trade, how often and on which account type.' },
      { day: 3, title: 'Spreads and commissions', note: 'What your trades actually cost, beyond the headline spread.' },
      { day: 6, title: 'Overnight and other charges', note: 'Swap, funding, inactivity and withdrawal fees.' },
      { day: 9, title: 'Leverage limits for your client type', note: 'The limits that apply to you, and the risks that come with leverage.' },
      { day: 12, title: 'Execution and order handling', note: 'How orders are filled, and what slippage and requotes mean.' },
      { day: 15, title: 'Review summary call', note: 'We go through the findings together. Any changes are your decision.' },
    ],
  },
  {
    id: 'ongoing-support',
    title: 'Ongoing relationship support',
    color: '#f59e0b',
    stops: [
      { day: 0, title: 'Welcome and support plan', note: 'How to reach us, and what we can and cannot help with.' },
      { day: 7, title: 'Your broker contacts', note: 'Who to contact at your broker, and how to escalate an issue.' },
      { day: 14, title: 'Complaint routes explained', note: 'The formal complaint and ombudsman routes open to you.' },
      { day: 90, title: 'Three-month check-in', note: 'A call to see whether your needs have changed.' },
      { day: 180, title: 'Six-month review', note: 'We look back at any issues and what is coming up.' },
      { day: 365, title: 'Annual review', note: 'A yearly look at whether your set-up still suits you.' },
    ],
  },
];

export const findJourney = (id) => journeys.find((j) => j.id === id);
