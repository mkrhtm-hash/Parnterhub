/**
 * The eBooks on the Learning page, written for MKPips. Each one is read on the site at
 * /learning/ebooks/<id>, one short page at a time, and can be printed or saved as a PDF.
 *
 * Block types: p (paragraph), h (small heading), list (bullets), steps (numbered),
 * note (highlighted key point), warn (risk callout), example (worked example: title + lines).
 * Worked examples use round, made-up numbers to show the arithmetic. They are not prices or forecasts.
 */

export const ebooks = [
  {
    id: 'fx-cfd-basics',
    title: 'FX and CFD basics',
    subtitle: 'The words, numbers and risks every beginner should understand before placing a trade.',
    pages: [
      {
        title: 'What FX and CFD trading is',
        blocks: [
          { p: 'Foreign exchange, usually shortened to FX or forex, is the buying of one currency with another. Banks, companies, travellers and investors all do it, which makes it one of the busiest markets in the world. Prices move all day on weekdays as supply and demand shift.' },
          { p: 'Most retail traders do not swap currencies the way a traveller does. They use a broker to open a position that gains or loses value as the exchange rate moves. Very often that position is a CFD.' },
          { h: 'What a CFD is' },
          { p: 'A CFD, or contract for difference, is an agreement between you and your broker. You never own the thing you are trading. Instead, the broker pays you the difference if the price moves your way, and you pay the broker the difference if it moves against you.' },
          { p: 'CFDs are not limited to currencies. Brokers offer them on stock indices, individual shares, gold, oil and other markets. The same idea applies to all of them: you are exposed to price changes without owning the underlying asset.' },
          { h: 'Going long and going short' },
          { list: ['Buying, or going long, means you gain if the price rises and lose if it falls.', 'Selling, or going short, means you gain if the price falls and lose if it rises.', 'Being able to sell first is one reason CFDs are popular, and also one reason they need care.'] },
          { warn: 'CFDs are complex and most retail accounts lose money trading them. This guide explains how they work. It does not suggest that you should trade.' },
        ],
      },
      {
        title: 'Currency pairs and how prices are quoted',
        blocks: [
          { p: 'Currencies are always priced in pairs, because you are measuring one against another. In the pair EUR/USD, the euro is the base currency and the US dollar is the quote currency.' },
          { p: 'A price of 1.0850 for EUR/USD means one euro costs 1.0850 US dollars. If the price rises to 1.0900, the euro has strengthened against the dollar. If it falls to 1.0800, the euro has weakened.' },
          { h: 'Majors, minors and exotics' },
          { list: ['Major pairs include the US dollar and another widely traded currency, such as EUR/USD, GBP/USD and USD/JPY.', 'Minor pairs, sometimes called crosses, leave out the US dollar, such as EUR/GBP or AUD/JPY.', 'Exotic pairs combine a major currency with one from a smaller or emerging economy. They often cost more to trade and can move sharply.'] },
          { h: 'Two prices, not one' },
          { p: 'A broker shows two prices for every market. The bid is the price at which you can sell. The ask, sometimes called the offer, is the price at which you can buy. The ask is always a little higher than the bid.' },
          { example: { title: 'Reading a quote', lines: ['EUR/USD bid 1.0850, ask 1.0851', 'You buy at 1.0851 and could sell straight back at 1.0850.', 'That gap of 0.0001 is the spread, and it is the first cost of every trade.'] } },
        ],
      },
      {
        title: 'Pips, lots and position size',
        blocks: [
          { p: 'Price moves in FX are measured in pips. For most pairs a pip is the fourth decimal place, or 0.0001. For pairs that include the Japanese yen it is the second decimal place, or 0.01. Many platforms show one more digit, called a fractional pip or pipette.' },
          { h: 'Lot sizes' },
          { p: 'Trade size is measured in lots. Brokers differ, but these sizes are common:' },
          { list: ['A standard lot is 100,000 units of the base currency.', 'A mini lot, or 0.1 lots, is 10,000 units.', 'A micro lot, or 0.01 lots, is 1,000 units.'] },
          { h: 'What a pip is worth' },
          { p: 'The value of one pip depends on the pair and the size of your trade. For a pair where the US dollar is the quote currency, such as EUR/USD, one pip on a standard lot is worth 10 US dollars. On a mini lot it is 1 dollar, and on a micro lot 10 cents.' },
          { example: { title: 'A worked example', lines: ['You buy 0.1 lots of EUR/USD at 1.0850.', 'The price rises to 1.0880, a move of 30 pips.', '30 pips × 1 dollar per pip = a gain of 30 dollars, before costs.', 'If the price had fallen 30 pips instead, you would have lost 30 dollars, plus costs.'] } },
          { note: 'Position size controls how much each pip moves your account. Choosing a smaller size is the simplest way to keep any single trade from doing serious damage.' },
        ],
      },
      {
        title: 'Leverage and margin',
        blocks: [
          { p: 'Leverage lets you control a large position with a smaller deposit. The deposit is called margin. With leverage of 1:30, you put up one thirtieth of the position value, and the broker lets you control the full amount.' },
          { example: { title: 'How margin is worked out', lines: ['You open 0.1 lots of EUR/USD at 1.0850, a position worth about 10,850 dollars.', 'At 1:30 leverage, the margin is about 10,850 ÷ 30 = 362 dollars.', 'Every pip still moves your account by 1 dollar, as if you had paid the full 10,850.'] } },
          { p: 'This is the important part: leverage does not change how much a pip is worth. It only changes how much money you must put aside to open the trade. Gains and losses are calculated on the full position, so they can be large compared with the margin you used.' },
          { h: 'Margin calls and stop outs' },
          { list: ['Your equity is your balance plus or minus any open gains and losses.', 'If losses push your equity close to the margin you are using, the broker may send a margin call, which is a warning.', 'If equity falls further, the broker can close your positions automatically. This is called a stop out, and it can happen quickly in a fast market.'] },
          { p: 'Regulators in several regions limit retail leverage, for example to 1:30 on major currency pairs. Some also require negative balance protection, which stops a retail account falling below zero. Check what applies to the broker entity you would use.' },
          { warn: 'Higher leverage means losses arrive faster. You can choose lower leverage than the maximum your broker offers.' },
        ],
      },
      {
        title: 'What trading costs you',
        blocks: [
          { p: 'Every trade has costs, and they are charged whether the trade gains or loses. Knowing them before you start makes it easier to compare brokers fairly.' },
          { h: 'The main costs' },
          { list: ['Spread: the gap between the bid and the ask. You pay it each time you open a trade.', 'Commission: some account types charge a fixed fee per lot and offer a narrower spread in return.', 'Overnight financing, often called a swap: a charge, or occasionally a credit, for positions held past the broker\'s daily cut-off time.', 'Other fees: some brokers charge for currency conversion, inactive accounts or certain withdrawal methods.'] },
          { example: { title: 'Comparing two accounts', lines: ['Account A: spread of 1.2 pips, no commission.', 'Account B: spread of 0.2 pips plus 7 dollars commission per standard lot for the round trip.', 'On one standard lot, A costs 1.2 × 10 = 12 dollars. B costs 0.2 × 10 + 7 = 9 dollars.', 'The cheaper account depends on how much and how often you trade, so do the sum for your own size.'] } },
          { h: 'Spreads can change' },
          { p: 'Spreads are often narrow when a market is busy and wider when it is quiet, such as late at night, or during major news. A spread quoted on a website is usually a typical or minimum figure, not a promise.' },
          { note: 'Ask each broker for its full list of charges, in writing, and check how swaps are calculated if you might hold positions for more than a day.' },
        ],
      },
      {
        title: 'Orders and how trades are filled',
        blocks: [
          { p: 'An order is an instruction to your broker. Knowing the main types helps you control when you enter and when you leave a position.' },
          { list: ['Market order: buy or sell straight away at the best price available.', 'Limit order: buy below the current price, or sell above it, only if the market reaches your level.', 'Stop order: buy above the current price, or sell below it, once the market moves through your level.', 'Stop-loss: an order attached to a trade that closes it if the price moves a set distance against you.', 'Take-profit: an order that closes a trade once it reaches a gain you chose in advance.'] },
          { h: 'Slippage and gaps' },
          { p: 'Your order may be filled at a slightly different price from the one you saw. This is called slippage, and it is more likely in fast markets. Prices can also jump between one level and the next with no trading in between, for example after a weekend or a major announcement. That is called a gap.' },
          { warn: 'A standard stop-loss is not a guarantee. If the market gaps past your level, the trade closes at the next available price, which can mean a bigger loss than you planned. Some brokers offer guaranteed stops for an extra charge.' },
          { note: 'Decide where you would exit before you enter. Writing it down makes it easier to stick to when the price is moving.' },
        ],
      },
      {
        title: 'Managing risk',
        blocks: [
          { p: 'Nobody can control where a price goes next. What you can control is how much each trade can cost you, and how much of your money is exposed at any one time.' },
          { h: 'Habits that limit damage' },
          { steps: ['Only trade with money you can afford to lose completely, kept separate from savings and bills.', 'Decide the most you are willing to lose on one trade, for example a small share of your account, and size the position to match.', 'Set a stop-loss when you open the trade, not after the price has started moving against you.', 'Avoid opening several positions that all depend on the same thing, such as many trades against the US dollar.', 'Keep a simple journal: why you entered, where you planned to exit, and what actually happened.'] },
          { example: { title: 'Sizing a trade from your stop', lines: ['Account: 2,000 dollars. You decide to risk no more than 20 dollars on this trade.', 'Your stop-loss is 25 pips away on EUR/USD.', '20 dollars ÷ 25 pips = 0.80 dollars per pip, which is 0.08 lots.', 'The size comes from the risk you chose, not from how confident you feel.'] } },
          { h: 'Practise first' },
          { p: 'A demo account uses virtual money on a real platform. It is the place to learn the order screens, test how costs add up and make your first mistakes. Remember that demo trading feels calmer than real trading, and fills can differ.' },
        ],
      },
      {
        title: 'Glossary and next steps',
        blocks: [
          { h: 'Words to know' },
          { list: ['Ask: the price at which you can buy.', 'Base currency: the first currency in a pair.', 'Bid: the price at which you can sell.', 'CFD: a contract that pays the difference in price between opening and closing.', 'Equity: your balance plus or minus open gains and losses.', 'Leverage: controlling a position larger than the money you put up.', 'Lot: a unit of trade size, with a standard lot being 100,000 units.', 'Margin: the money set aside to keep a leveraged position open.', 'Pip: the standard unit of price movement in FX.', 'Spread: the difference between the bid and the ask.', 'Stop out: when a broker closes positions because equity has fallen too low.', 'Swap: the overnight financing charge or credit on an open position.'] },
          { h: 'Where to go from here' },
          { steps: ['Read our guide on how to verify a broker\'s licence, so you know who you would be dealing with.', 'Read our guide on what to do before you open your first account.', 'Practise on a demo account until the platform and the numbers feel familiar.'] },
          { warn: 'This eBook is general education, not investment advice. It does not take your circumstances into account. CFDs carry a high risk of losing money rapidly due to leverage.' },
        ],
      },
    ],
  },
  {
    id: 'verify-a-licence',
    title: 'How to verify a broker\'s licence',
    subtitle: 'A step-by-step guide to checking a broker on a regulator\'s own register.',
    pages: [
      {
        title: 'Why a licence matters',
        blocks: [
          { p: 'A licence means a financial regulator has authorised a company to offer certain services, and expects it to follow rules while it does. Those rules usually cover how client money is held, how complaints are handled, how much capital the firm keeps and how it describes risk.' },
          { h: 'What regulation does not do' },
          { list: ['It does not protect you from trading losses.', 'It does not mean a regulator recommends the broker.', 'Protection differs from one regulator to another, and some offer far more than others.'] },
          { p: 'Even so, checking the licence is the single most useful thing you can do before sending money. It takes about fifteen minutes, and it rules out many of the firms that cause the worst problems.' },
          { note: 'Check the licence yourself, on the regulator\'s own website. A logo or licence number on a broker\'s site is a claim, not proof.' },
        ],
      },
      {
        title: 'Find the right regulator',
        blocks: [
          { p: 'A broker brand often runs several companies in different countries, each with its own licence. What matters is the company that would actually hold your account, and the regulator that supervises that company.' },
          { h: 'Where to look' },
          { list: ['The legal pages of the broker\'s website, usually at the very bottom of each page, should name each company, its registered address and its regulator.', 'The client agreement names the company you are contracting with.', 'Examples of well-known regulators include the FCA in the United Kingdom, ASIC in Australia, CySEC in Cyprus and the DFSA in the Dubai International Financial Centre.'] },
          { p: 'Once you know the regulator, go to its official website by typing the address yourself or using a search engine. Avoid links sent to you by the broker or by anyone promoting it.' },
          { warn: 'Some companies are registered in places that do very little supervision. A registration number is not always a licence to deal with retail clients. Read what the register says the firm is allowed to do.' },
        ],
      },
      {
        title: 'Search the register step by step',
        blocks: [
          { steps: ['Open the regulator\'s public register, sometimes called a financial services register or licensee search.', 'Search by the company\'s legal name or licence number, not the brand name alone.', 'Check the firm\'s status says authorised, licensed or similar. Words such as revoked, cancelled or expired are a stop sign.', 'Read the permissions. Look for dealing in investments or derivatives with retail clients, or wording that matches the service you want.', 'Compare the registered address, phone number and website domain with the ones you are using. They should match.', 'Note any trading names listed. A brand you are using that does not appear may not be covered.'] },
          { example: { title: 'Writing down what you found', lines: ['Company: the legal name shown on the register', 'Regulator and licence number', 'Status and the date you checked', 'Permitted activities', 'Website domains listed'] } },
          { note: 'Save a screenshot of the register entry. If something goes wrong later, it shows what you relied on.' },
        ],
      },
      {
        title: 'Match the company to your account',
        blocks: [
          { p: 'It is common for one brand to send clients from different countries to different companies. A visitor in one region may sign up with a strongly regulated company, while a visitor elsewhere is placed with an offshore one under the same name and logo.' },
          { h: 'How to check which company you are joining' },
          { list: ['Read the name of the company in the client agreement before you accept it.', 'Look at the account opening screens, emails and deposit pages for a company name.', 'Ask support in writing: which legal company will hold my account, and which regulator supervises it?'] },
          { h: 'Why it matters' },
          { p: 'Leverage limits, negative balance protection, compensation schemes and complaint routes all depend on the company and the regulator, not the brand. Two people using the same app can have very different protection.' },
          { note: 'If the answer is a company other than the one you checked, check that one too before depositing.' },
        ],
      },
      {
        title: 'Warning signs',
        blocks: [
          { p: 'Some warning signs suggest a firm is unlicensed, or is pretending to be a licensed one. That trick is known as a clone firm.' },
          { list: ['Claims of guaranteed or very high returns, or of trading with no risk.', 'Pressure to deposit quickly, or a bonus that disappears unless you add more money today.', 'Requests to send money to a personal bank account, an unrelated company or a crypto wallet.', 'An account manager who offers to trade on your behalf, or asks for remote access to your computer.', 'Contact details that differ from those on the regulator\'s register.', 'Fees, taxes or penalties that must be paid before a withdrawal is released.', 'A website that appeared recently, or that copies wording and pictures from a known broker.'] },
          { p: 'Many regulators publish warning lists of firms they believe are operating without permission. Search the firm\'s name and website on those lists as part of your check.' },
          { warn: 'Clone firms copy the name and licence number of a real broker. Contact the broker using the details shown on the register, not the details you were given, to confirm you are dealing with the real firm.' },
        ],
      },
      {
        title: 'Checklist and what to do if something is wrong',
        blocks: [
          { h: 'Before you deposit' },
          { steps: ['I know the legal name of the company that will hold my account.', 'I found that company on its regulator\'s own register, and its status is active.', 'Its permissions cover the service I am using.', 'The website and contact details match the register.', 'The firm does not appear on a regulator\'s warning list.', 'I have saved screenshots of what I found.'] },
          { h: 'If something does not add up' },
          { list: ['Stop. Do not send more money, even if you are told it will unlock a withdrawal.', 'Keep every email, message and payment record.', 'Contact your bank or payment provider quickly. They may be able to help with recent payments.', 'Report the firm to the regulator it claims to be licensed by, and to your local authorities.', 'Be wary of anyone who contacts you offering to recover lost money for a fee. This is a common follow-up scam.'] },
          { warn: 'This eBook is general education, not legal or investment advice. Rules differ by country, so check what applies where you live.' },
        ],
      },
    ],
  },
  {
    id: 'before-your-first-account',
    title: 'Before you open your first account',
    subtitle: 'What to prepare and what to understand before you deposit any money.',
    pages: [
      {
        title: 'Start with your reasons',
        blocks: [
          { p: 'Opening a trading account takes minutes. Deciding whether you should takes longer, and it is worth doing first. A few honest answers now can save you money and stress later.' },
          { h: 'Questions to answer for yourself' },
          { list: ['Why do I want to trade, and what do I expect from it?', 'How much money could I lose completely without it affecting my bills, savings or family?', 'How much time can I give to learning and to watching open positions?', 'How do I usually react when I lose money?'] },
          { p: 'If the honest answer to the second question is very little or nothing, trading leveraged products is probably not right for you at the moment. That is a perfectly sensible conclusion.' },
          { warn: 'Never trade with borrowed money, emergency savings or money set aside for essentials.' },
        ],
      },
      {
        title: 'Documents brokers usually ask for',
        blocks: [
          { p: 'Regulated brokers must confirm who their clients are and where their money comes from. This is often called KYC, short for know your customer, and it is part of rules against fraud and money laundering. Expect to provide:' },
          { list: ['Proof of identity: a passport or national identity card, in date and clearly readable.', 'Proof of address: a recent utility bill or bank statement, usually from the last three to six months, showing your name and address.', 'Sometimes, information about your job, income and the source of the money you plan to deposit.'] },
          { h: 'Keep your details safe' },
          { list: ['Upload documents only through the broker\'s own secure website or app.', 'Never send passwords or one-time codes to anyone, including people who say they work for the broker.', 'Be cautious if someone asks for documents over a messaging app or social media.'] },
          { note: 'A broker that asks for no documents at all is a warning sign, not a convenience.' },
        ],
      },
      {
        title: 'Why brokers ask about your experience',
        blocks: [
          { p: 'During sign-up, many brokers ask about your knowledge of trading, your past experience and your finances. In several regions this is a legal requirement, sometimes called an appropriateness or suitability test.' },
          { p: 'The questions exist to check whether a complex product such as a CFD is appropriate for you. If your answers suggest it may not be, the broker may warn you, limit your leverage or decline the application.' },
          { h: 'Answer honestly' },
          { list: ['Overstating your experience to pass the test removes a protection designed for you.', 'Some brokers reach out to clients whose answers show limited experience, which can be useful support.', 'If the broker warns you that a product may not suit you, take the warning seriously.'] },
          { note: 'Nobody else should fill in this form for you, or tell you which answers to give.' },
        ],
      },
      {
        title: 'Choose an account and platform',
        blocks: [
          { p: 'Brokers usually offer a few account types. The differences are mostly about how you pay for trades and what you can access.' },
          { list: ['Standard accounts usually build costs into a wider spread, with no separate commission.', 'Raw or ECN-style accounts usually have narrower spreads plus a commission per lot.', 'Some accounts have higher minimum deposits, or are only available to professional clients.'] },
          { h: 'Other choices you will make' },
          { list: ['Base currency: choosing the currency you deposit in can avoid conversion fees.', 'Leverage: if you can choose, start with a low setting. You can always change it later.', 'Platform: try the desktop and mobile versions to see which you find clear and comfortable.'] },
          { note: 'The cheapest account on paper is not always the best fit. Pick the one you understand and can check easily.' },
        ],
      },
      {
        title: 'Practise on a demo account',
        blocks: [
          { p: 'Most brokers offer a free demo account with virtual money. Use it before you deposit. It is the cheapest place to make mistakes.' },
          { h: 'What to practise' },
          { steps: ['Opening and closing a trade, and changing its size.', 'Setting a stop-loss and a take-profit, and moving them.', 'Finding the spread, the swap and the margin for a trade before you place it.', 'Reading your account screen: balance, equity, margin used and free margin.', 'Following a written plan for a few weeks and recording every trade.'] },
          { h: 'What a demo cannot teach you' },
          { p: 'Real money changes how people behave. Fear and hope feel much stronger when a loss is real. Fills and spreads can also differ between demo and live accounts. If you move to a live account, starting with a small size helps you adjust.' },
        ],
      },
      {
        title: 'Deposits, withdrawals and a final check',
        blocks: [
          { h: 'Moving money in and out' },
          { list: ['Pay from an account in your own name. Brokers usually return money to the same method it came from.', 'Check deposit and withdrawal fees, processing times and any minimum amounts before you pay.', 'Make a small test withdrawal early, so you know how the process works.', 'Keep records of every payment and every withdrawal request.'] },
          { h: 'Final checklist' },
          { steps: ['I have checked the broker\'s licence on the regulator\'s own register.', 'I know which legal company holds my account.', 'I have read the client agreement and the list of charges.', 'I have practised on a demo account.', 'I am only depositing money I can afford to lose.', 'I know how I would make a complaint if I needed to.'] },
          { warn: 'This eBook is general education, not investment advice. CFDs carry a high risk of losing money rapidly due to leverage. Only trade if you understand how they work and can afford the risk.' },
        ],
      },
    ],
  },
];

export const findEbook = (id) => ebooks.find((book) => book.id === id);
