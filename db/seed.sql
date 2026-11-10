-- MKPips starting data. Safe to run repeatedly: rows that already exist are left alone,
-- so re-running this file never creates duplicates or overwrites details you have edited.
-- Every broker here is fictional and marked is_sample = true. Licence numbers are dummies.

INSERT INTO regulator_tiers (id, name, label, summary) VALUES
  (1, 'Tier 1', 'Strict oversight', 'Major financial centres with demanding capital rules, active enforcement and detailed conduct standards.'),
  (2, 'Tier 2', 'Established oversight', 'Recognised regulators with real rules and enforcement. Protections and scope vary, so read the detail.'),
  (3, 'Tier 3', 'Lighter oversight', 'Usually offshore licences. Often fewer retail protections, so you may have less to fall back on if something goes wrong.')
ON CONFLICT (id) DO NOTHING;

INSERT INTO regulators (code, name, jurisdiction, tier, register_url, segregation, negative_balance, compensation) VALUES
  ('FCA', 'Financial Conduct Authority', 'United Kingdom', 1, 'https://register.fca.org.uk/', 'Client money rules apply to authorised firms.', 'Required for retail CFD clients.', 'FSCS may cover eligible claims if a firm fails, subject to limits.'),
  ('ASIC', 'Australian Securities and Investments Commission', 'Australia', 1, 'https://asic.gov.au/online-services/search-asic-registers/', 'Client money must be held in separate trust accounts.', 'Required for retail CFD clients under ASIC product rules.', 'No general scheme for CFD clients. AFCA handles eligible complaints.'),
  ('MAS', 'Monetary Authority of Singapore', 'Singapore', 1, 'https://eservices.mas.gov.sg/fid', 'Customer money must be held in trust accounts.', 'Check with the firm. Do not assume it applies.', 'No general scheme for CFD clients.'),
  ('CySEC', 'Cyprus Securities and Exchange Commission', 'Cyprus (EU)', 2, 'https://www.cysec.gov.cy/en-GB/entities/investment-firms/cypriot/', 'EU MiFID rules require client funds to be safeguarded.', 'Required for retail CFD clients.', 'The Investor Compensation Fund may cover eligible claims, subject to limits.'),
  ('FSCA', 'Financial Sector Conduct Authority', 'South Africa', 2, 'https://www.fsca.co.za/', 'Check how the firm holds client funds.', 'Check with the firm. Do not assume it applies.', 'No general scheme for CFD clients.'),
  ('FSA', 'Financial Services Authority', 'Seychelles', 3, 'https://fsaseychelles.sc/', 'Check how the firm holds client funds.', 'Check with the firm. Do not assume it applies.', 'No general scheme for CFD clients.')
ON CONFLICT (code) DO NOTHING;

INSERT INTO countries (code, name, home_regulator, sort_order) VALUES
  ('GB', 'United Kingdom', 'FCA', 0),
  ('DE', 'Germany', 'CySEC', 1),
  ('FR', 'France', 'CySEC', 2),
  ('ES', 'Spain', 'CySEC', 3),
  ('IT', 'Italy', 'CySEC', 4),
  ('NL', 'Netherlands', 'CySEC', 5),
  ('IE', 'Ireland', 'CySEC', 6),
  ('CY', 'Cyprus', 'CySEC', 7),
  ('PL', 'Poland', 'CySEC', 8),
  ('AU', 'Australia', 'ASIC', 9),
  ('SG', 'Singapore', 'MAS', 10),
  ('ZA', 'South Africa', 'FSCA', 11),
  ('AE', 'United Arab Emirates', NULL, 12),
  ('NG', 'Nigeria', NULL, 13),
  ('KE', 'Kenya', NULL, 14),
  ('MY', 'Malaysia', NULL, 15),
  ('TH', 'Thailand', NULL, 16),
  ('US', 'United States', NULL, 17),
  ('CA', 'Canada', NULL, 18),
  ('JP', 'Japan', NULL, 19),
  ('IN', 'India', NULL, 20),
  ('OTHER', 'My country is not listed', NULL, 21)
ON CONFLICT (code) DO NOTHING;

INSERT INTO brokers (id, name, is_sample, min_deposit, spreads, commission, support, platforms, instruments, available_in, strengths, suited_to, sort_order) VALUES
  ('aster', 'Sample Broker Aster', true, 100, 'EUR/USD from 0.9 pips', 'None on the standard account', 'Named contact, weekdays',
   ARRAY['MT4', 'MT5'], ARRAY['forex', 'indices', 'commodities', 'shares'],
   ARRAY['GB', 'DE', 'FR', 'ES', 'IT', 'NL', 'IE', 'CY', 'PL'],
   ARRAY['regulation', 'support', 'education'], ARRAY['new', 'some'], 0),
  ('birch', 'Sample Broker Birch', true, 200, 'EUR/USD from 0.1 pips', '$7 per lot, round turn', 'Live chat, 24/5',
   ARRAY['MT5', 'cTrader'], ARRAY['forex', 'indices', 'commodities'],
   ARRAY['GB', 'AU', 'SG', 'ZA', 'AE', 'NG', 'KE', 'MY', 'TH'],
   ARRAY['costs', 'execution'], ARRAY['some', 'experienced', 'professional'], 1),
  ('cedar', 'Sample Broker Cedar', true, 1000, 'EUR/USD from 0.0 pips', '$5 per lot, round turn', 'Dedicated desk, 24/5',
   ARRAY['MT5', 'cTrader'], ARRAY['forex', 'indices', 'commodities', 'shares'],
   ARRAY['GB', 'DE', 'FR', 'ES', 'IT', 'NL', 'IE', 'CY', 'PL'],
   ARRAY['regulation', 'costs', 'execution'], ARRAY['experienced', 'professional'], 2),
  ('dune', 'Sample Broker Dune', true, 50, 'EUR/USD from 1.2 pips', 'None on the standard account', 'Email and chat, weekdays',
   ARRAY['MT4'], ARRAY['forex', 'commodities', 'crypto'],
   ARRAY['ZA', 'DE', 'FR', 'ES', 'IT', 'NL', 'IE', 'CY', 'PL', 'AE', 'NG', 'KE', 'MY', 'TH'],
   ARRAY['lowDeposit', 'education'], ARRAY['new', 'some'], 3),
  ('ember', 'Sample Broker Ember', true, 500, 'EUR/USD from 0.6 pips', 'None on the standard account', 'Named contact, 24/5',
   ARRAY['MT4', 'MT5', 'cTrader'], ARRAY['forex', 'indices', 'commodities', 'shares', 'crypto'],
   ARRAY['GB', 'AU', 'SG', 'MY', 'TH'],
   ARRAY['regulation', 'support', 'education'], ARRAY['some', 'experienced'], 4),
  ('fjord', 'Sample Broker Fjord', true, 250, 'EUR/USD from 0.2 pips', '$6 per lot, round turn', 'Live chat, 24/5',
   ARRAY['cTrader'], ARRAY['forex', 'indices', 'crypto'],
   ARRAY['DE', 'FR', 'ES', 'IT', 'NL', 'IE', 'CY', 'PL'],
   ARRAY['execution', 'costs'], ARRAY['some', 'experienced'], 5),
  ('grove', 'Sample Broker Grove', true, 100, 'EUR/USD from 1.0 pips', 'None on the standard account', 'Phone and chat, weekdays',
   ARRAY['MT4', 'MT5'], ARRAY['forex', 'indices', 'commodities', 'shares'],
   ARRAY['ZA', 'AE', 'NG', 'KE', 'MY', 'TH'],
   ARRAY['support', 'lowDeposit', 'education'], ARRAY['new', 'some'], 6),
  ('harbor', 'Sample Broker Harbor', true, 1000, 'EUR/USD from 0.4 pips', '$4 per lot, round turn', 'Dedicated desk, weekdays',
   ARRAY['MT5'], ARRAY['forex', 'indices', 'commodities', 'shares'],
   ARRAY['SG', 'AU', 'MY', 'TH'],
   ARRAY['regulation', 'execution', 'costs'], ARRAY['experienced', 'professional'], 7)
ON CONFLICT (id) DO NOTHING;

INSERT INTO broker_licences (broker_id, regulator_code, licence_number, sort_order) VALUES
  ('aster', 'FCA', 'SAMPLE-FCA-0001', 0),
  ('aster', 'CySEC', 'SAMPLE-CY-0001', 1),
  ('birch', 'FCA', 'SAMPLE-FCA-0002', 0),
  ('birch', 'ASIC', 'SAMPLE-AS-0002', 1),
  ('birch', 'FSCA', 'SAMPLE-ZA-0002', 2),
  ('cedar', 'FCA', 'SAMPLE-FCA-0003', 0),
  ('dune', 'CySEC', 'SAMPLE-CY-0004', 0),
  ('dune', 'FSA', 'SAMPLE-SC-0004', 1),
  ('ember', 'FCA', 'SAMPLE-FCA-0005', 0),
  ('ember', 'ASIC', 'SAMPLE-AS-0005', 1),
  ('fjord', 'CySEC', 'SAMPLE-CY-0006', 0),
  ('grove', 'FSCA', 'SAMPLE-ZA-0007', 0),
  ('grove', 'FSA', 'SAMPLE-SC-0007', 1),
  ('harbor', 'MAS', 'SAMPLE-SG-0008', 0),
  ('harbor', 'ASIC', 'SAMPLE-AS-0008', 1)
ON CONFLICT (broker_id, regulator_code) DO NOTHING;

INSERT INTO site_content (key, value) VALUES ('company', '{
  "name": "MKPips",
  "tagline": "The right broker starts with the right partner.",
  "legalEntityName": "[Legal entity name]",
  "registrationNumber": "[Company registration number]",
  "registeredAddress": "[Registered address]",
  "licenceStatus": "[Licence or authorisation status]",
  "email": "[hello@yourdomain.com]",
  "phone": "[+00 000 000 0000]",
  "whatsappNumber": "10000000000",
  "whatsappMessage": "Hello MKPips, I would like to ask about finding a regulated broker.",
  "yearsExperience": 15,
  "lastLegalUpdate": "[Date of last legal review]"
}'::jsonb)
ON CONFLICT (key) DO NOTHING;

INSERT INTO site_content (key, value) VALUES ('founder', '{
  "name": "Muhammad Kaleem",
  "role": "Founder, MKPips",
  "photo": null,
  "bio": "Muhammad Kaleem has spent more than 15 years on the sales side of FX and CFD brokerage in Dubai, at firms including Neomarkets, SquaredFinancial, ATFX, Hantec Markets, AxiCorp and Alpari. He has looked after retail and high-net-worth traders, and built introducing broker and partner networks across the Middle East and South-East Asia. He set up MKPips to help traders reach regulated brokers with clear information and no pressure.",
  "highlights": [
    "15+ years in Dubai''s FX and CFD industry",
    "Sales leadership across MENA and South-East Asia",
    "Built introducing broker and affiliate networks",
    "Looked after 300+ active traders at ATFX MENA"
  ],
  "timeline": [
    {
      "period": "2008 to 2013",
      "title": "Account management",
      "detail": "Account Manager at Orion Holding Overseas, then Senior Account Manager at One Financial Markets."
    },
    {
      "period": "2013 to 2018",
      "title": "Sales and premium clients",
      "detail": "Sales Manager at Hantec Markets, Senior Sales Associate at Alpari ME, then Premium Client Manager at AxiCorp."
    },
    {
      "period": "2018 to 2023",
      "title": "Regional sales and client relationships",
      "detail": "Regional Sales at Hantec Markets, then Senior Relationship Manager at ATFX MENA, looking after 300+ active traders."
    },
    {
      "period": "2023 to today",
      "title": "Business development leadership",
      "detail": "Head of Business Development SEA at SquaredFinancial, now Sales Director SEA at Neomarkets."
    }
  ]
}'::jsonb)
ON CONFLICT (key) DO NOTHING;

INSERT INTO site_content (key, value) VALUES ('compliance', '{
  "riskWarning": "CFDs are complex instruments and carry a high risk of losing money rapidly due to leverage. Only trade with money you can afford to lose.",
  "retailLossPercent": "[XX]",
  "retailLossSentence": "of retail accounts lose money when trading CFDs.",
  "compensationDisclosure": "MKPips may receive compensation from partner brokers. Ask us about any arrangement that applies to a broker we discuss with you.",
  "notAdvice": "Content on this site is general information, not investment advice. It does not take your personal circumstances into account."
}'::jsonb)
ON CONFLICT (key) DO NOTHING;

INSERT INTO site_content (key, value) VALUES ('legalPages', '{
  "privacy": {
    "title": "Privacy Policy",
    "intro": "Placeholder text. Have this reviewed by a qualified adviser before launch.",
    "sections": [
      {
        "heading": "Who we are",
        "body": "[Legal entity name, registered address and data protection contact.]"
      },
      {
        "heading": "What we collect",
        "body": "The consultation form collects your name, email, phone number, country, experience level and message. We do not ask for passwords, payment details or ID documents on this site. [Confirm this matches your final set-up.]"
      },
      {
        "heading": "How we use it",
        "body": "[Purpose and lawful basis for each use, such as replying to your consultation request.]"
      },
      {
        "heading": "Who we share it with",
        "body": "[Service providers and any partner brokers, and when data is shared with them.]"
      },
      {
        "heading": "How long we keep it",
        "body": "[Retention periods.]"
      },
      {
        "heading": "Your rights",
        "body": "[Access, correction, deletion and complaint rights for the jurisdictions you serve.]"
      }
    ]
  },
  "terms": {
    "title": "Terms of Use",
    "intro": "Placeholder text. Have this reviewed by a qualified adviser before launch.",
    "sections": [
      {
        "heading": "About these terms",
        "body": "[Who the terms are between and when they apply.]"
      },
      {
        "heading": "Our service",
        "body": "MKPips introduces traders to brokers and helps them compare options. We do not manage funds, hold client money, give trading signals or promise returns. [Confirm the wording against your licence status.]"
      },
      {
        "heading": "No investment advice",
        "body": "Content on this site is general information, not investment advice."
      },
      {
        "heading": "Compensation",
        "body": "MKPips may receive compensation from partner brokers. [Describe the arrangements.]"
      },
      {
        "heading": "Liability and governing law",
        "body": "[Limits of liability, governing law and jurisdiction.]"
      }
    ]
  },
  "risk": {
    "title": "Risk Disclosure",
    "intro": "Placeholder text. Have this reviewed by a qualified adviser before launch.",
    "sections": [
      {
        "heading": "Leverage",
        "body": "CFDs are complex instruments and carry a high risk of losing money rapidly due to leverage. Leverage increases both gains and losses, and small price moves can have a large effect on your account."
      },
      {
        "heading": "Only trade what you can afford to lose",
        "body": "Consider whether you understand how CFDs work and whether you can afford the high risk of losing your money."
      },
      {
        "heading": "Foreign exchange and market risk",
        "body": "Prices can move quickly, including when markets are closed or thinly traded. Stop orders may not fill at the price you set."
      },
      {
        "heading": "Past performance",
        "body": "Past performance is not a reliable indicator of future results."
      },
      {
        "heading": "Jurisdiction-specific warnings",
        "body": "[Add the risk wording required where you operate, including the verified percentage of retail accounts that lose money.]"
      }
    ]
  },
  "cookies": {
    "title": "Cookie Policy",
    "intro": "Placeholder text. Have this reviewed by a qualified adviser before launch.",
    "sections": [
      {
        "heading": "What this site stores now",
        "body": "This site saves your theme and your cookie choice in your browser. It does not load analytics or advertising tools at the moment."
      },
      {
        "heading": "Analytics and marketing tools",
        "body": "[List each tool, what it does and how long it keeps data. Load these only after a visitor selects Accept.]"
      },
      {
        "heading": "Changing your choice",
        "body": "Use the button below at any time to reopen the cookie choice."
      }
    ]
  }
}'::jsonb)
ON CONFLICT (key) DO NOTHING;

INSERT INTO site_content (key, value) VALUES ('consultation', '{
  "timeSlots": [
    "09:00",
    "09:45",
    "10:30",
    "11:15",
    "13:00",
    "13:45",
    "14:30",
    "15:15",
    "16:00"
  ],
  "timezoneLabel": "[Your business time zone]",
  "durationMinutes": 30,
  "bookingWindowDays": 45
}'::jsonb)
ON CONFLICT (key) DO NOTHING;

INSERT INTO site_content (key, value) VALUES ('faqs', '[
  {
    "q": "What does MKPips charge?",
    "a": "The first consultation is free. [Confirm whether any later service carries a fee, and list it here.]"
  },
  {
    "q": "How are brokers chosen?",
    "a": "We start with regulation, then look at trading conditions, platforms, instruments, how the firm handles support, and whether it accepts clients in your country. We only work with regulated partners, and you can check every licence yourself on the regulator''s register."
  },
  {
    "q": "Is the service available in my country?",
    "a": "It depends on where you live, because each broker can only accept clients from certain countries. The Broker Match tool shows what is available. If nothing fits, we will tell you plainly."
  },
  {
    "q": "How is MKPips paid?",
    "a": "MKPips may receive compensation from partner brokers. That is a potential conflict of interest, so you should know about it and ask us about it. Always compare the conditions yourself before you decide. [Describe your compensation model.]"
  },
  {
    "q": "Do you give trading advice or manage money?",
    "a": "No. We do not manage funds, hold client money, give trading signals or promise returns. We help you understand your broker options. Any trading decision is yours."
  }
]'::jsonb)
ON CONFLICT (key) DO NOTHING;

INSERT INTO site_content (key, value) VALUES ('options', '{
  "platforms": [
    "MT4",
    "MT5",
    "cTrader"
  ],
  "instruments": [
    {
      "id": "forex",
      "label": "Forex"
    },
    {
      "id": "indices",
      "label": "Indices"
    },
    {
      "id": "commodities",
      "label": "Commodities"
    },
    {
      "id": "shares",
      "label": "Shares"
    },
    {
      "id": "crypto",
      "label": "Crypto"
    }
  ],
  "experienceLevels": [
    {
      "id": "new",
      "label": "New to trading",
      "hint": "I have not traded with real money yet"
    },
    {
      "id": "some",
      "label": "Some experience",
      "hint": "I have traded, but not for long"
    },
    {
      "id": "experienced",
      "label": "Experienced",
      "hint": "I trade regularly and know my costs"
    },
    {
      "id": "professional",
      "label": "Professional",
      "hint": "I qualify, or expect to qualify, as a professional client"
    }
  ],
  "depositRanges": [
    {
      "id": "under250",
      "label": "Under $250",
      "max": 249
    },
    {
      "id": "250-1k",
      "label": "$250 to $1,000",
      "max": 1000
    },
    {
      "id": "1k-5k",
      "label": "$1,000 to $5,000",
      "max": 5000
    },
    {
      "id": "5k-25k",
      "label": "$5,000 to $25,000",
      "max": 25000
    },
    {
      "id": "25k+",
      "label": "Over $25,000",
      "max": null
    }
  ],
  "priorities": [
    {
      "id": "regulation",
      "label": "Strong regulation",
      "hint": "Oversight and protections come first",
      "reason": "its licence profile suits a regulation-first approach"
    },
    {
      "id": "costs",
      "label": "Low trading costs",
      "hint": "Tight spreads and clear commissions",
      "reason": "its pricing is built around low spreads and clear commissions"
    },
    {
      "id": "execution",
      "label": "Execution quality",
      "hint": "Speed and how orders are filled",
      "reason": "execution is one of its listed strengths"
    },
    {
      "id": "support",
      "label": "Human support",
      "hint": "A real person when you need help",
      "reason": "it lists direct, human support as a strength"
    },
    {
      "id": "education",
      "label": "Learning resources",
      "hint": "Guides, webinars and a demo account",
      "reason": "it lists learning resources as a strength"
    },
    {
      "id": "lowDeposit",
      "label": "Low minimum deposit",
      "hint": "Start with a smaller amount",
      "reason": "its minimum deposit is among the lowest in this list"
    }
  ]
}'::jsonb)
ON CONFLICT (key) DO NOTHING;

-- Outlines for the Learning page. Add a video or PDF link to the url column to make one playable.
INSERT INTO learning_resources (id, kind, title, summary, topics, level, sort_order) VALUES
  ('what-a-broker-does', 'video', 'What a broker actually does', 'A plain-English starting point for anyone new to FX and CFD trading.',
   ARRAY['The difference between a broker and an exchange', 'How your order reaches the market', 'Who holds your money, and under which rules'], 'Beginner', 10),
  ('how-cfds-work', 'video', 'How CFDs work', 'What you are really buying when you open a CFD position.',
   ARRAY['What you own, and what you do not', 'How a position gains or loses value', 'Why most of the risk comes from position size'], 'Beginner', 20),
  ('leverage-and-margin', 'video', 'Leverage and margin, including the risks', 'How leverage magnifies both gains and losses, and what a margin call means.',
   ARRAY['How leverage and margin relate', 'What happens during a margin call', 'How negative balance protection works, where it applies'], 'Beginner', 30),
  ('what-trading-costs', 'video', 'What trading really costs', 'The costs that do not appear in a headline spread.',
   ARRAY['Spreads compared with commissions', 'Overnight financing charges', 'How to estimate the full cost of a trade'], 'Intermediate', 40),
  ('verify-a-licence', 'ebook', 'How to verify a broker''s licence', 'A step-by-step guide to checking a broker on a regulator''s own register.',
   ARRAY['Finding the right regulator and register', 'Matching the legal entity to your account', 'Common warning signs of an unlicensed firm'], 'Beginner', 50),
  ('before-your-first-account', 'ebook', 'Before you open your first account', 'What to prepare and what to understand before you deposit any money.',
   ARRAY['Documents brokers usually ask for', 'What suitability questions are for', 'Why practising on a demo account comes first'], 'Beginner', 60)
ON CONFLICT (id) DO NOTHING;

-- Webinar outlines. Set starts_at and url when a session is scheduled.
INSERT INTO learning_resources (id, kind, title, summary, topics, level, sort_order) VALUES
  ('choosing-a-regulated-broker', 'webinar', 'Choosing a regulated broker', 'A live walkthrough of what to compare before you decide.',
   ARRAY['Which regulator is likely to cover you', 'How to compare costs and platforms', 'Questions to ask before opening an account'], 'Beginner', 70),
  ('understanding-the-risks', 'webinar', 'Understanding the risks of CFD trading', 'A live session on how losses happen and how leverage affects them.',
   ARRAY['How leverage can magnify losses', 'What a stop order can and cannot do', 'Questions to ask yourself before you trade'], 'Beginner', 80)
ON CONFLICT (id) DO NOTHING;

-- Brand rename: updates the name in content that already exists, and changes nothing else.
UPDATE site_content
SET value = replace(value::text, 'Partnerhub', 'MKPips')::jsonb
WHERE value::text LIKE '%Partnerhub%';
