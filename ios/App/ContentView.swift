import SwiftUI
import StoreKit
import AVFoundation

// MARK: - Models
struct BookSummary: Identifiable, Hashable {
    let id: String
    let title: String
    let subtitle: String
    let author: String
    let year: String
    let category: String
    let readTime: String
    let rating: Double
    let coverUrl: String
    let executiveThesis: String
    let bottomLine: String
    let goldenRules: [String]
    let chapters: [BookChapter]
    let dialecticCritique: String
    let keyQuote: String
}

struct BookChapter: Hashable {
    let number: Int
    let title: String
    let breakdown: String
    let keyInsight: String
}

// MARK: - Main ContentView
struct ContentView: View {
    @Environment(\.requestReview) private var requestReview
    @StateObject private var audio = AudioPlayerEngine.shared
    @State private var selectedBook: BookSummary? = nil
    @State private var showSynthesizeSheet: Bool = false
    @State private var selectedCategory: String = "All"
    @State private var searchText: String = ""
    
    // Default Curated Library
    @State private var books: [BookSummary] = [
        BookSummary(
            id: "good-to-great",
            title: "Good to Great",
            subtitle: "Why Some Companies Make the Leap... and Others Don't",
            author: "Jim Collins",
            year: "2001",
            category: "Leadership & Strategy",
            readTime: "14 min",
            rating: 4.88,
            coverUrl: "https://covers.openlibrary.org/b/id/14389659-L.jpg",
            executiveThesis: "Greatness is not a function of circumstance or luck; it is a conscious discipline. Transforming an organization requires Level 5 Leadership, First Who Then What, confronting brutal facts, and turning the relentless Flywheel.",
            bottomLine: "Good is the enemy of great. Eliminate superficial charisma; build quiet, relentless momentum through cumulative flywheel turns aligned with your core Hedgehog Concept.",
            goldenRules: [
                "Level 5 Leadership: Paradoxical blend of personal humility and ferocious professional will.",
                "First Who, Then What: Get the right people on the bus and wrong people off before steering.",
                "The Stockdale Paradox: Retain unwavering faith you will prevail while confronting brutal present facts."
            ],
            chapters: [
                BookChapter(number: 1, title: "Level 5 Leadership", breakdown: "Leaders who built sustained greatness channel ambition into the institution rather than personal ego.", keyInsight: "When things succeed they look out the window; when things fail they look in the mirror."),
                BookChapter(number: 2, title: "First Who... Then What", breakdown: "Great companies begin with assembling the right talent before deciding on strategy.", keyInsight: "The right people do not need tight management; they are self-motivated toward mastery."),
                BookChapter(number: 3, title: "The Hedgehog Concept", breakdown: "Focus strictly at the intersection of passion, world-class capability, and unit economic denominator.", keyInsight: "If you cannot be the best in the world at your core business, it cannot sustain greatness."),
                BookChapter(number: 4, title: "The Flywheel Effect", breakdown: "No single breakthrough causes greatness; it is the compounding effect of patient pushes on a heavy flywheel.", keyInsight: "Avoid the Doom Loop of reactive restructuring and erratic pivots.")
            ],
            dialecticCritique: "Collins relied heavily on retrospective matching; subsequent disruption caused several case studies (like Circuit City and Fannie Mae) to collapse, proving discipline alone cannot stop structural shifts.",
            keyQuote: "Good is the enemy of great. And that is one of the key reasons why we have so little that becomes great."
        ),
        BookSummary(
            id: "thinking-fast-and-slow",
            title: "Thinking, Fast and Slow",
            subtitle: "The Architecture of Human Judgement & Cognitive Illusions",
            author: "Daniel Kahneman",
            year: "2011",
            category: "Psychology & Mind",
            readTime: "14 min",
            rating: 4.89,
            coverUrl: "https://covers.openlibrary.org/b/id/13290711-L.jpg",
            executiveThesis: "Human judgment is divided between System 1 (fast, emotional, automatic heuristics) and System 2 (slow, deliberate, metabolically costly logic). Most errors occur when lazy System 2 endorses intuitive System 1 biases.",
            bottomLine: "Do not trust unfiltered intuition for complex statistical or high-stakes decisions. Deploy algorithmic checklists and reference class forecasting to tame cognitive illusions.",
            goldenRules: [
                "System 1 substitutes hard questions for easy ones (WYSIATI: What You See Is All There Is).",
                "Loss Aversion: The psychological pain of losing $100 is twice as intense as the pleasure of gaining $100.",
                "Anchoring Effect: Any arbitrary initial number introduced into negotiation warps subsequent valuations."
            ],
            chapters: [
                BookChapter(number: 1, title: "Two Systems: Fast & Lazy", breakdown: "System 1 operates effortlessly without voluntary control. System 2 allocates attention to effortful mental operations.", keyInsight: "Cognitive strain activates System 2; cognitive ease invites heuristic errors."),
                BookChapter(number: 2, title: "Heuristics & Biases", breakdown: "When evaluating probability, we substitute availability and representativeness for base-rate statistics.", keyInsight: "Hindsight bias makes past outcomes appear inevitable, punishing sound decision processes."),
                BookChapter(number: 3, title: "Prospect Theory", breakdown: "Decisions under risk are evaluated relative to a subjective reference point rather than absolute wealth.", keyInsight: "People are risk-averse for gains but risk-seeking to avoid losses.")
            ],
            dialecticCritique: "The replication crisis impacted several priming studies cited in early chapters, though core Prospect Theory and anchoring remain Nobel-validated and robust.",
            keyQuote: "We can be blind to the obvious, and we are also blind to our blindness."
        ),
        BookSummary(
            id: "atomic-habits",
            title: "Atomic Habits",
            subtitle: "An Easy & Proven Way to Build Good Habits & Break Bad Ones",
            author: "James Clear",
            year: "2018",
            category: "Productivity & Focus",
            readTime: "12 min",
            rating: 4.92,
            coverUrl: "https://covers.openlibrary.org/b/id/12539702-L.jpg",
            executiveThesis: "Outcomes are a lagging measure of your habits. True behavioral transformation does not come from sheer willpower or heroic motivation; it comes from continuous 1% systemic improvements and identity shifts.",
            bottomLine: "You do not rise to the level of your goals; you fall to the level of your systems. Focus on shaping your environment and proving your new identity to yourself with small wins.",
            goldenRules: [
                "The 4 Laws of Behavior Change: Make it Obvious, Attractive, Easy, and Satisfying.",
                "Identity-Based Habits: Decide who you want to be, then prove it to yourself with small daily actions.",
                "The 2-Minute Rule: When starting a new habit, it should take less than two minutes to do."
            ],
            chapters: [
                BookChapter(number: 1, title: "The Compounding of 1%", breakdown: "Getting 1% better each day compounds into 37x annual improvement. Small choices compound invisibly.", keyInsight: "Habits are the compound interest of self-improvement."),
                BookChapter(number: 2, title: "The Four Laws", breakdown: "To build a habit: make cue obvious, craving attractive, response easy, and reward satisfying.", keyInsight: "Environment design is more powerful than internal willpower."),
                BookChapter(number: 3, title: "The Goldilocks Rule", breakdown: "Humans experience peak motivation when working on tasks right on the edge of current ability.", keyInsight: "Boredom, not failure, is the greatest threat to sustained mastery.")
            ],
            dialecticCritique: "Over-emphasizes individual behavioral optimization while downplaying severe structural, economic, and health inequities that constrain personal agency.",
            keyQuote: "You do not rise to the level of your goals. You fall to the level of your systems."
        ),
        BookSummary(
            id: "principles-dalio",
            title: "Principles: Life and Work",
            subtitle: "Radical Truth, Radical Transparency & Algorithmic Decision-Making",
            author: "Ray Dalio",
            year: "2017",
            category: "Leadership & Strategy",
            readTime: "15 min",
            rating: 4.84,
            coverUrl: "https://covers.openlibrary.org/b/id/8315355-L.jpg",
            executiveThesis: "Reality operates like a perpetual-motion machine with cause-effect principles. By adopting radical truth, radical transparency, and believability-weighted decision-making, an organization converts painful mistakes into algorithmic wisdom.",
            bottomLine: "Pain + Reflection = Progress. Separate your ego from truth, seek out the smartest thoughtful dissenters, and systematize principles into repeatable operational recipes.",
            goldenRules: [
                "Radical Open-Mindedness: Genuinely appreciate that you might not know the best path.",
                "Idea Meritocracy: Believability-weight decision making based on track records rather than titles.",
                "The 5-Step Process: Set Goals, Identify Problems, Diagnose Root Causes, Design Plans, Push Through."
            ],
            chapters: [
                BookChapter(number: 1, title: "Embrace Reality & Deal With It", breakdown: "Truth is the essential foundation for producing good outcomes. Never confuse what you wish were true with what is actually true.", keyInsight: "Look at yourself objectively as a machine operating within another machine."),
                BookChapter(number: 2, title: "The 5-Step Evolutionary Loop", breakdown: "Every personal or organizational breakthrough follows the disciplined 5-step diagnostic cycle.", keyInsight: "Never mix diagnosing problems with designing solutions; keep steps distinct."),
                BookChapter(number: 3, title: "Believability Weighting", breakdown: "Not all opinions are equal. Give greater weight to those who have repeatedly succeeded and can explain their logic.", keyInsight: "Democracy in decision-making leads to mediocrity; believability weighting leads to truth.")
            ],
            dialecticCritique: "Radical transparency creates intense social friction and executive turnover when applied without deep psychological safety, requiring specific personality profiles.",
            keyQuote: "Pain plus reflection equals progress."
        ),
        BookSummary(
            id: "deep-work",
            title: "Deep Work",
            subtitle: "Rules for Focused Success in a Distracted World",
            author: "Cal Newport",
            year: "2016",
            category: "Productivity & Focus",
            readTime: "11 min",
            rating: 4.82,
            coverUrl: "https://covers.openlibrary.org/b/id/7988607-L.jpg",
            executiveThesis: "The ability to perform deep, distraction-free cognitive work is becoming increasingly rare at the exact moment it is becoming increasingly valuable in our knowledge economy.",
            bottomLine: "Drain the shallows. Eliminate cognitive residue by scheduling structured blocks of uncompromising focus, quitting dopamine-driven network tools, and embracing productive boredom.",
            goldenRules: [
                "The Deep Work Hypothesis: High-Value Output = Time Spent × Intensity of Focus.",
                "Attention Residue: Switching tasks leaves a cognitive penalty that degrades subsequent brain performance.",
                "Bimodal / Time-Block Scheduling: Treat deep work sessions like strict appointments with yourself."
            ],
            chapters: [
                BookChapter(number: 1, title: "The Deep Work Hypothesis", breakdown: "Knowledge workers mistakenly equate busyness with productivity, drowning in shallow communication.", keyInsight: "To thrive in the new economy, you must master hard things quickly and produce at an elite level."),
                BookChapter(number: 2, title: "Embrace Boredom", breakdown: "If every bored moment is filled with phone scrolling, the brain is permanently wired for distraction.", keyInsight: "Train your concentration muscles by practicing resisting the urge to switch tasks."),
                BookChapter(number: 3, title: "Drain the Shallows", breakdown: "Ruthlessly measure and cap shallow work (emails, meetings, status updates) to under 30% of your day.", keyInsight: "Clarity about what matters provides clarity about what does not.")
            ],
            dialecticCritique: "Newport's monastic model works well for tenured academics and solo creators, but proves difficult for operational managers whose core role is asynchronous cross-functional coordination.",
            keyQuote: "Clarity about what matters provides clarity about what does not."
        ),
        BookSummary(
            id: "psychology-of-money",
            title: "The Psychology of Money",
            subtitle: "Timeless Lessons on Wealth, Greed, and Happiness",
            author: "Morgan Housel",
            year: "2020",
            category: "Wealth & Economics",
            readTime: "12 min",
            rating: 4.89,
            coverUrl: "https://covers.openlibrary.org/b/id/10389354-L.jpg",
            executiveThesis: "Doing well with money has a little to do with how smart you are and a lot to do with how you behave. Financial success is not a hard science; it is a soft skill where your psychology and relationship with risk dictate outcomes.",
            bottomLine: "Getting wealthy requires taking risk and optimism. Staying wealthy requires paranoia, humility, and accepting that room for error is what allows compounding to run undisturbed.",
            goldenRules: [
                "Compounding is Not Intuitive: 99% of Warren Buffett's wealth was accumulated after age 50.",
                "Reasonable > Rational: Build a financial strategy that lets you sleep at night rather than pure spreadsheet optimization.",
                "Freedom is the Highest Dividend: The ability to do what you want, when you want, is the ultimate ROI."
            ],
            chapters: [
                BookChapter(number: 1, title: "No One's Crazy", breakdown: "People make financial decisions based on their unique generational experiences and birth cohorts.", keyInsight: "Your personal history with money makes up maybe 0.00000001% of what's happened in the world."),
                BookChapter(number: 2, title: "Getting Wealthy vs Staying Wealthy", breakdown: "Survival is the only metric that matters because it allows the magic of compounding to unfold.", keyInsight: "Having room for error is the only way to safely navigate future unknowns."),
                BookChapter(number: 3, title: "Tails, You Win", breakdown: "A small number of rare events account for the majority of financial and venture outcomes.", keyInsight: "You can be wrong half the time and still make an immense fortune.")
            ],
            dialecticCritique: "Advocates an ultra-conservative cash and index fund posture that can lead to significant inflation drag and under-allocation for high-risk entrepreneurs.",
            keyQuote: "Spending money to show people how much money you have is the fastest way to have less money."
        ),
        BookSummary(
            id: "antifragile",
            title: "Antifragile",
            subtitle: "Things That Gain from Disorder, Volatility, and Stress",
            author: "Nassim Nicholas Taleb",
            year: "2012",
            category: "Wealth & Economics",
            readTime: "16 min",
            rating: 4.86,
            coverUrl: "https://covers.openlibrary.org/b/id/9180157-L.jpg",
            executiveThesis: "The resilient resists shocks and stays the same; the antifragile gets better. Complex systems, economies, and bodies thrive on stressors and small errors, while top-down optimization and artificial stability create catastrophic fragility.",
            bottomLine: "Embrace the Barbell Strategy: pair extreme conservatism on downside with uncapped asymmetric upside. Eliminate fragility by removing fragilizers (Via Negativa).",
            goldenRules: [
                "The Triad: Fragile (hates volatility), Robust (indifferent), Antifragile (loves volatility).",
                "Skin in the Game: Never trust opinions from those who do not bear the downside consequences of their advice.",
                "Via Negativa: Subtraction adds more value than addition; remove vulnerabilities before adding optimizations."
            ],
            chapters: [
                BookChapter(number: 1, title: "The Antifragile: An Introduction", breakdown: "Wind extinguishes a candle and energizes a fire. You want to be the fire and wish for the wind.", keyInsight: "Suppressing randomness creates hidden systemic fragility."),
                BookChapter(number: 2, title: "The Barbell Strategy", breakdown: "Avoid the middle. Place 90% in bulletproof riskless assets and 10% in highly speculative, asymmetric bets.", keyInsight: "A bimodal strategy eliminates the risk of total ruin."),
                BookChapter(number: 3, title: "Skin in the Game", breakdown: "Agency problems arise when bureaucrats and executives transfer risk to society while privatizing bonuses.", keyInsight: "Decentralized systems survive because errors are localized.")
            ],
            dialecticCritique: "Taleb's pugnacious rhetoric and wholesale dismissal of formal academic econometrics can obscure practical corporate forecasting needs.",
            keyQuote: "Wind extinguishes a candle and energizes fire. You want to be the fire and wish for the wind."
        ),
        BookSummary(
            id: "high-output-management",
            title: "High Output Management",
            subtitle: "A Practical Handbook for the Most Important Managerial Skill",
            author: "Andrew S. Grove",
            year: "1983",
            category: "Leadership & Strategy",
            readTime: "13 min",
            rating: 4.90,
            coverUrl: "https://covers.openlibrary.org/b/id/421244-L.jpg",
            executiveThesis: "A manager's output is the output of the organizational units under his or her supervision. Management is an operational science governed by principles of production, leverage, and task-relevant maturity.",
            bottomLine: "Focus ruthlessly on managerial leverage: activities that exert high multiplier effects on the output of others. Use 1-on-1s for coaching and indicators for bottleneck management.",
            goldenRules: [
                "Managerial Output = Output of your organization + Output of neighboring organizations you influence.",
                "Managerial Leverage: The measure of output generated per unit of time invested.",
                "Task-Relevant Maturity (TRM): Tailor management style (directive vs coaching vs delegating) strictly to the subordinate's task familiarity."
            ],
            chapters: [
                BookChapter(number: 1, title: "The Breakfast Factory", breakdown: "All manufacturing and business processes share the same primitives: limiting steps, inventory, quality control, and bottlenecks.", keyInsight: "Find the limiting step and construct the entire process around it."),
                BookChapter(number: 2, title: "Managerial Leverage", breakdown: "High leverage activities: influencing many people at once, coaching a critical decision, or establishing organizational culture.", keyInsight: "A 90-minute 1-on-1 influences a subordinate's work for two full weeks."),
                BookChapter(number: 3, title: "Task-Relevant Maturity", breakdown: "Treating a senior engineer like a novice on a new task is offensive; leaving a novice unguided is negligent.", keyInsight: "Leadership style is not personal preference; it is dictated by the employee's TRM.")
            ],
            dialecticCritique: "The heavy engineering/factory mindset can feel rigid in fluid creative or research-driven environments where outputs cannot be reduced to physical assembly lines.",
            keyQuote: "A manager's output = the output of his organization + the output of the neighboring organizations under his influence."
        ),
        BookSummary(
            id: "essentialism",
            title: "Essentialism",
            subtitle: "The Disciplined Pursuit of Less",
            author: "Greg McKeown",
            year: "2014",
            category: "Productivity & Focus",
            readTime: "11 min",
            rating: 4.81,
            coverUrl: "https://covers.openlibrary.org/b/id/7285986-L.jpg",
            executiveThesis: "The way of the Essentialist is the relentless pursuit of less, but better. It is not about getting more things done in less time; it is about getting only the right things done.",
            bottomLine: "If you do not prioritize your life, someone else will. Apply the 90% rule: if an opportunity is not a clear 90/100, it is a definitive zero.",
            goldenRules: [
                "Less But Better: Distinguish the vital few from the trivial many.",
                "The 90% Rule: Evaluate options against the single most strict criterion; if it is not a definite yes, it is a no.",
                "Protect the Asset: Sleep and cognitive renewal are non-negotiable operational assets."
            ],
            chapters: [
                BookChapter(number: 1, title: "The Disciplined Pursuit of Less", breakdown: "Success often leads to failure through the paradox of success: more options create distraction.", keyInsight: "You cannot do it all; trade-offs are an inescapable reality."),
                BookChapter(number: 2, title: "Explore: The 90% Rule", breakdown: "Systematically explore only options that meet elite standards. Eliminate mediocrity before it starts.", keyInsight: "Saying yes to one thing means saying no to everything else."),
                BookChapter(number: 3, title: "Eliminate: The Courage of Saying No", breakdown: "Master the art of the graceful, unequivocal 'No' to preserve focus for what truly compounds.", keyInsight: "A clear 'No' earns respect; an ambiguous 'Maybe' invites regret.")
            ],
            dialecticCritique: "The luxury of saying 'no' is disproportionately available to senior executives and established authors, whereas junior professionals must often take broad opportunities to build initial leverage.",
            keyQuote: "If you don't prioritize your life, someone else will."
        ),
        BookSummary(
            id: "sapiens",
            title: "Sapiens",
            subtitle: "A Brief History of Humankind",
            author: "Yuval Noah Harari",
            year: "2014",
            category: "Psychology & Mind",
            readTime: "15 min",
            rating: 4.88,
            coverUrl: "https://covers.openlibrary.org/b/id/8634250-L.jpg",
            executiveThesis: "Homo sapiens conquered planet Earth because we are the only species capable of creating and believing in shared intersubjective fictions: money, corporations, human rights, nations, and religions.",
            bottomLine: "Cooperation at mass scale requires mythical frameworks. The Cognitive Revolution gave humans narrative power; the Agricultural Revolution traded freedom for calories; the Scientific Revolution married ignorance with capital.",
            goldenRules: [
                "The Cognitive Revolution: Language evolved to transmit fiction, enabling flexible cooperation among millions.",
                "Intersubjective Reality: Money and legal corporations exist solely in our collective imagination.",
                "The Ignorance Revolution: Modern science advanced only when humans admitted: 'We do not know everything.'"
            ],
            chapters: [
                BookChapter(number: 1, title: "The Cognitive Revolution", breakdown: "Around 70,000 years ago, genetic mutations allowed Sapiens to communicate things that do not physically exist.", keyInsight: "You can never convince a chimpanzee to give you a banana by promising him infinite bananas in monkey heaven."),
                BookChapter(number: 2, title: "History's Biggest Fraud", breakdown: "The Agricultural Revolution did not offer a better life; it created backbreaking labor, population explosions, and malnutrition.", keyInsight: "We did not domesticate wheat; wheat domesticated us."),
                BookChapter(number: 3, title: "The Unification of Humankind", breakdown: "Three universal orders unified the planet: money, empires, and universal religions.", keyInsight: "Money is the most universal and efficient system of mutual trust ever devised.")
            ],
            dialecticCritique: "Professional anthropologists argue Harari paints with overly broad anthropological brushstrokes, oversimplifying complex hunter-gatherer societies.",
            keyQuote: "Homo sapiens rules the world because it is the only animal that can believe in things that exist purely in its imagination."
        ),
        BookSummary(
            id: "meditations-aurelius",
            title: "Meditations",
            subtitle: "The Inward Citadel and the Stoic Philosophy of Sovereign Reason",
            author: "Marcus Aurelius",
            year: "c. 170 CE",
            category: "Ancient Classics",
            readTime: "14 min",
            rating: 4.93,
            coverUrl: "https://covers.openlibrary.org/b/id/13202688-L.jpg",
            executiveThesis: "You have power over your mind, not outside events. Realize this, and you will find sovereign strength. The Roman Emperor's personal journal is the definitive manual of Stoic governance, emotional temperance, and cosmic perspective.",
            bottomLine: "The obstacle in the path becomes the path. Never waste time arguing what a good leader should be; simply be one.",
            goldenRules: [
                "Dichotomy of Control: Separate what is in your power (judgments, desires, aversions) from what is not.",
                "Amor Fati: Accept whatever happens as necessary and interwoven with the fabric of the universe.",
                "Memento Mori: Keep your impermanence constantly in mind to eliminate pettiness and false pride."
            ],
            chapters: [
                BookChapter(number: 1, title: "The Morning Armor", breakdown: "Begin each day anticipating deceit, selfishness, and hostility, recognizing that offenders act out of ignorance of good and evil.", keyInsight: "None of them can hurt you, for none can trap you in wickedness."),
                BookChapter(number: 2, title: "The Inward Citadel", breakdown: "External circumstances cannot touch the soul. Distress comes not from things, but from the judgment you form about things.", keyInsight: "Wipe out impressions. Restrain impulse. Keep reason in command."),
                BookChapter(number: 3, title: "The Cosmic Perspective", breakdown: "View all human endeavors from above. Alexander the Great and his mule driver ended in the exact same dust.", keyInsight: "Time is a river of passing events, a violent current.")
            ],
            dialecticCritique: "Strict Stoicism can veer into emotional detachment and fatalistic acceptance of societal injustice rather than proactive reform.",
            keyQuote: "You have power over your mind - not outside events. Realize this, and you will find strength."
        ),
        BookSummary(
            id: "art-of-war-sun-tzu",
            title: "The Art of War",
            subtitle: "The Ancient Strategic Treatise on Asymmetric Leverage & Deception",
            author: "Sun Tzu",
            year: "c. 500 BCE",
            category: "Leadership & Strategy",
            readTime: "12 min",
            rating: 4.87,
            coverUrl: "https://covers.openlibrary.org/b/id/4849549-L.jpg",
            executiveThesis: "Supreme excellence consists in breaking the enemy's resistance without fighting. Warfare and high-stakes strategy are matters of life and death, governed by thorough calculations, deception, and exploiting structural asymmetry.",
            bottomLine: "If you know the enemy and know yourself, you need not fear the result of a hundred battles. Flow like water: avoid strength, attack weakness, and adapt to circumstances.",
            goldenRules: [
                "All warfare is based on deception: when capable, feign incapacity; when near, make them believe you are far.",
                "Win Before Fighting: Victorious warriors win first and then go to war, while defeated warriors go to war first and seek to win.",
                "Speed & Adaptability: Water shapes its course according to the nature of the ground; an executive works out victory in relation to the competitor."
            ],
            chapters: [
                BookChapter(number: 1, title: "Calculations & Foreknowledge", breakdown: "The general who wins makes many calculations in his temple before the battle is fought.", keyInsight: "Do not move unless you see an advantage; do not act unless you have sovereign reason."),
                BookChapter(number: 2, title: "Energy & Timing", breakdown: "The onset of troops is like the rush of a torrent which will even roll stones along in its course.", keyInsight: "Direct methods join battle; indirect methods achieve victory."),
                BookChapter(number: 3, title: "The Flow of Water", breakdown: "Military tactics are like unto water; avoid the heights and hasten to the hollows.", keyInsight: "In strategy there are no constant conditions; he who can modify tactics achieves victory.")
            ],
            dialecticCritique: "Ruthless focus on deception and zero-sum conflict can damage long-term collaborative trust in modern creative ecosystems.",
            keyQuote: "In the midst of chaos, there is also opportunity."
        ),
        BookSummary(
            id: "thinking-in-systems",
            title: "Thinking in Systems",
            subtitle: "A Primer on Feedback Loops, Stocks, Flows & Leverage Points",
            author: "Donella H. Meadows",
            year: "2008",
            category: "Systems & Science",
            readTime: "14 min",
            rating: 4.90,
            coverUrl: "https://covers.openlibrary.org/b/id/14420637-L.jpg",
            executiveThesis: "Complex systems behave in non-linear, counter-intuitive ways because of feedback delays, stocks, and flows. Interventions aimed at obvious symptoms frequently produce policy resistance or make problems worse.",
            bottomLine: "To change a system, look beyond events to the structural rules, information flows, and mental paradigms that govern how elements interact.",
            goldenRules: [
                "Stocks & Flows: A stock is an accumulation of material or information; flows change the stock over time.",
                "Balancing & Reinforcing Loops: Balancing loops stabilize; reinforcing loops drive exponential growth or collapse.",
                "Leverage Points: The highest leverage points are not parameter tweaks, but changing the paradigm from which the system arises."
            ],
            chapters: [
                BookChapter(number: 1, title: "System Basics", breakdown: "A system is more than the sum of its parts; it possesses resilience, self-organization, and hierarchy.", keyInsight: "Information delays are primary causes of economic volatility and inventory bullwhips."),
                BookChapter(number: 2, title: "Why Systems Surprise Us", breakdown: "Linear thinking fails in non-linear worlds with non-negotiable physical boundaries.", keyInsight: "Bounded rationality: individuals make decisions based on localized information, leading to macro tragedy."),
                BookChapter(number: 3, title: "Leverage Points", breakdown: "Twelve places to intervene in a system, ranked from least effective (numbers) to most effective (transcending paradigms).", keyInsight: "The power to transcend paradigms and keep unattached to mindsets is ultimate mastery.")
            ],
            dialecticCritique: "Systems modeling can lead to analysis paralysis when practitioners delay decisive action waiting for complete loop specifications.",
            keyQuote: "Remember, always, that everything you know, and everything everyone knows, is only a model."
        ),
        BookSummary(
            id: "structure-scientific-revolutions",
            title: "The Structure of Scientific Revolutions",
            subtitle: "Epistemic Ruptures, Normal Science & Paradigm Shifts",
            author: "Thomas S. Kuhn",
            year: "1962",
            category: "Systems & Science",
            readTime: "15 min",
            rating: 4.85,
            coverUrl: "https://covers.openlibrary.org/b/id/6566386-L.jpg",
            executiveThesis: "Scientific progress does not evolve smoothly toward objective truth. It proceeds through long periods of conservative 'normal science' punctuated by intellectually violent revolutions and paradigm shifts.",
            bottomLine: "A paradigm shift occurs not when opponents are convinced, but when anomalies accumulate to crisis and a new framework replaces the old epistemic worldview.",
            goldenRules: [
                "Paradigm: A shared set of assumptions, theories, and standards that defines legitimate research.",
                "Incommensurability: Competing paradigms see different worlds and speak mutually untranslatable languages.",
                "Crisis & Rupture: Paradigms only fall when anomalies accumulate and an alternative worldview is ready."
            ],
            chapters: [
                BookChapter(number: 1, title: "The Nature of Normal Science", breakdown: "Normal science is puzzle-solving under an accepted paradigm, actively suppressing foundational debate.", keyInsight: "Normal science does not aim to produce novelties of fact or theory."),
                BookChapter(number: 2, title: "Anomaly & Emergence", breakdown: "Discoveries begin with awareness of anomaly: nature violating paradigm-induced expectations.", keyInsight: "Crises are a necessary prerequisite for the emergence of novel theories."),
                BookChapter(number: 3, title: "The Response to Crisis", breakdown: "Scientists never renounce an accepted paradigm until another candidate is ready to take its place.", keyInsight: "The decision to reject one paradigm is always simultaneously the decision to accept another.")
            ],
            dialecticCritique: "Kuhn's incommensurability thesis was criticized by Karl Popper for bordering on epistemic relativism.",
            keyQuote: "Scientific progress is not cumulative; it is a succession of peaceful interludes punctuated by intellectually violent revolutions."
        )
    ]
    
    let categories = ["All", "Leadership & Strategy", "Psychology & Mind", "Productivity & Focus", "Wealth & Economics", "Ancient Classics", "Systems & Science"]
    
    var filteredBooks: [BookSummary] {
        books.filter { book in
            let matchesCategory = (selectedCategory == "All") || (book.category == selectedCategory)
            let matchesSearch = searchText.isEmpty ||
                book.title.localizedCaseInsensitiveContains(searchText) ||
                book.author.localizedCaseInsensitiveContains(searchText) ||
                book.category.localizedCaseInsensitiveContains(searchText) ||
                book.subtitle.localizedCaseInsensitiveContains(searchText)
            return matchesCategory && matchesSearch
        }
    }
    
    var body: some View {
        NavigationStack {
            ZStack {
                Color(red: 9/255, green: 10/255, blue: 15/255).ignoresSafeArea()
                
                ScrollView {
                    VStack(alignment: .leading, spacing: 20) {
                        
                        // Header Bar
                        HStack(alignment: .center) {
                            VStack(alignment: .leading, spacing: 4) {
                                Text("MINDSPRINT")
                                    .font(.system(size: 13, weight: .black, design: .serif))
                                    .tracking(3)
                                    .foregroundColor(Color(red: 229/255, green: 193/255, blue: 125/255))
                                
                                Text("Executive Synthesis")
                                    .font(.system(size: 26, weight: .heavy, design: .serif))
                                    .foregroundColor(.white)
                            }
                            
                            Spacer()
                            
                            // Working Synthesize Button
                            Button(action: {
                                showSynthesizeSheet = true
                            }) {
                                HStack(spacing: 6) {
                                    Image(systemName: "sparkles")
                                    Text("Synthesize")
                                }
                                .font(.system(size: 13, weight: .bold))
                                .padding(.horizontal, 14)
                                .padding(.vertical, 8)
                                .background(Color(red: 229/255, green: 193/255, blue: 125/255))
                                .foregroundColor(.black)
                                .cornerRadius(20)
                                .shadow(color: Color(red: 229/255, green: 193/255, blue: 125/255).opacity(0.3), radius: 8, x: 0, y: 2)
                            }
                        }
                        .padding(.horizontal)
                        .padding(.top, 12)
                        
                        // Search Input
                        HStack(spacing: 10) {
                            Image(systemName: "magnifyingglass")
                                .foregroundColor(.gray)
                            
                            TextField("Search books, authors, mental models...", text: $searchText)
                                .foregroundColor(.white)
                                .font(.system(size: 14))
                            
                            if !searchText.isEmpty {
                                Button(action: { searchText = "" }) {
                                    Image(systemName: "xmark.circle.fill")
                                        .foregroundColor(.gray)
                                }
                            }
                        }
                        .padding(12)
                        .background(Color.white.opacity(0.06))
                        .cornerRadius(12)
                        .padding(.horizontal)
                        
                        // Categories Horizontal Scroll Filter
                        ScrollView(.horizontal, showsIndicators: false) {
                            HStack(spacing: 8) {
                                ForEach(categories, id: \.self) { cat in
                                    Button(action: {
                                        selectedCategory = cat
                                    }) {
                                        Text(cat)
                                            .font(.system(size: 12, weight: selectedCategory == cat ? .bold : .medium))
                                            .padding(.horizontal, 14)
                                            .padding(.vertical, 7)
                                            .background(selectedCategory == cat ? Color(red: 229/255, green: 193/255, blue: 125/255) : Color.white.opacity(0.06))
                                            .foregroundColor(selectedCategory == cat ? .black : .white.opacity(0.8))
                                            .cornerRadius(20)
                                    }
                                }
                            }
                            .padding(.horizontal)
                        }
                        
                        // Featured Cornerstone Canon (Carousel)
                        if selectedCategory == "All" && searchText.isEmpty {
                            VStack(alignment: .leading, spacing: 12) {
                                HStack {
                                    Text("CORNERSTONE CANON")
                                        .font(.system(size: 11, weight: .bold))
                                        .tracking(2)
                                        .foregroundColor(Color(red: 229/255, green: 193/255, blue: 125/255))
                                    
                                    Spacer()
                                    
                                    Text("1-Min • 15-Min • 40-Min")
                                        .font(.system(size: 10))
                                        .foregroundColor(.gray)
                                }
                                .padding(.horizontal)
                                
                                ScrollView(.horizontal, showsIndicators: false) {
                                    HStack(spacing: 16) {
                                        ForEach(books.prefix(5)) { book in
                                            Button(action: {
                                                selectedBook = book
                                            }) {
                                                CornerstoneCardView(book: book)
                                            }
                                            .buttonStyle(.plain)
                                        }
                                    }
                                    .padding(.horizontal)
                                }
                            }
                        }
                        
                        // Library Grid of All Books
                        VStack(alignment: .leading, spacing: 12) {
                            HStack {
                                Text("\(selectedCategory.uppercased()) (\(filteredBooks.count))")
                                    .font(.system(size: 11, weight: .bold))
                                    .tracking(2)
                                    .foregroundColor(.gray)
                                Spacer()
                            }
                            .padding(.horizontal)
                            
                            LazyVGrid(columns: [GridItem(.flexible(), spacing: 16), GridItem(.flexible(), spacing: 16)], spacing: 18) {
                                ForEach(filteredBooks) { book in
                                    Button(action: {
                                        selectedBook = book
                                    }) {
                                        GridBookCardView(book: book)
                                    }
                                    .buttonStyle(.plain)
                                }
                            }
                            .padding(.horizontal)
                        }
                        
                        // App Store Rating Banner (Rule 7 Standard)
                        HStack(spacing: 12) {
                            Image(systemName: "star.fill")
                                .foregroundColor(Color(red: 229/255, green: 193/255, blue: 125/255))
                                .font(.system(size: 18))
                            
                            VStack(alignment: .leading, spacing: 2) {
                                Text("Enjoying MindSprint?")
                                    .font(.system(size: 13, weight: .bold))
                                    .foregroundColor(.white)
                                Text("Un-gated review on the App Store")
                                    .font(.system(size: 11))
                                    .foregroundColor(.gray)
                            }
                            Spacer()
                            Button("Rate App") {
                                requestReview()
                            }
                            .font(.system(size: 11, weight: .bold))
                            .padding(.horizontal, 12)
                            .padding(.vertical, 6)
                            .background(Color.white.opacity(0.12))
                            .foregroundColor(Color(red: 229/255, green: 193/255, blue: 125/255))
                            .cornerRadius(10)
                        }
                        .padding(12)
                        .background(Color.white.opacity(0.04))
                        .cornerRadius(14)
                        .padding(.horizontal)
                        .padding(.top, 10)
                        
                    }
                    .padding(.bottom, 60)
                }
            }
            .navigationBarHidden(true)
            // MARK: - Working Reader Sheet
            .sheet(item: $selectedBook) { book in
                BookReaderSheetView(
                    book: book,
                    allBooks: filteredBooks,
                    onNavigate: { newBook in
                        selectedBook = newBook
                    }
                )
            }
            // MARK: - Working Synthesize Sheet
            .sheet(isPresented: $showSynthesizeSheet) {
                SynthesizeSheetView(
                    onBookCreated: { newBook in
                        books.insert(newBook, at: 0)
                        showSynthesizeSheet = false
                        selectedBook = newBook
                    }
                )
            }
        }
    }
}

// MARK: - Cornerstone Card View
struct CornerstoneCardView: View {
    let book: BookSummary
    
    var body: some View {
        VStack(alignment: .leading, spacing: 10) {
            ZStack(alignment: .bottomLeading) {
                RoundedRectangle(cornerRadius: 12)
                    .fill(Color(red: 20/255, green: 22/255, blue: 30/255))
                    .frame(width: 160, height: 230)
                
                // Real Book Cover Image via AsyncImage
                AsyncImage(url: URL(string: book.coverUrl)) { phase in
                    switch phase {
                    case .success(let image):
                        image
                            .resizable()
                            .aspectRatio(contentMode: .fill)
                            .frame(width: 160, height: 230)
                            .clipped()
                            .cornerRadius(12)
                            .overlay(
                                // 3D Realistic Spine Crease Shadow
                                HStack {
                                    LinearGradient(colors: [Color.black.opacity(0.75), Color.black.opacity(0.2), Color.clear], startPoint: .leading, endPoint: .trailing)
                                        .frame(width: 14)
                                    Spacer()
                                }
                            )
                            .overlay(
                                VStack {
                                    Spacer()
                                    LinearGradient(colors: [Color.clear, Color.black.opacity(0.85)], startPoint: .top, endPoint: .bottom)
                                        .frame(height: 70)
                                }
                                .cornerRadius(12)
                            )
                    default:
                        VStack {
                            Spacer()
                            Text(book.title)
                                .font(.system(size: 13, weight: .bold, design: .serif))
                                .foregroundColor(.white)
                                .multilineTextAlignment(.center)
                                .padding()
                            Spacer()
                        }
                    }
                }
                
                VStack(alignment: .leading, spacing: 2) {
                    Text(book.year)
                        .font(.system(size: 9, weight: .bold))
                        .padding(.horizontal, 5)
                        .padding(.vertical, 2)
                        .background(Color.black.opacity(0.7))
                        .foregroundColor(.white)
                        .cornerRadius(4)
                    
                    Text(book.title)
                        .font(.system(size: 13, weight: .bold, design: .serif))
                        .foregroundColor(.white)
                        .lineLimit(2)
                    
                    Text(book.author)
                        .font(.system(size: 10, weight: .medium))
                        .foregroundColor(Color(red: 229/255, green: 193/255, blue: 125/255))
                        .lineLimit(1)
                }
                .padding(10)
            }
            .shadow(color: Color.black.opacity(0.4), radius: 6, x: 0, y: 3)
            
            Text(book.bottomLine)
                .font(.system(size: 10))
                .foregroundColor(.gray)
                .lineLimit(2)
                .frame(width: 160, alignment: .leading)
        }
    }
}

// MARK: - Grid Book Card View
struct GridBookCardView: View {
    let book: BookSummary
    
    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            ZStack(alignment: .bottomLeading) {
                RoundedRectangle(cornerRadius: 10)
                    .fill(Color(red: 20/255, green: 22/255, blue: 30/255))
                    .aspectRatio(2/3, contentMode: .fit)
                
                AsyncImage(url: URL(string: book.coverUrl)) { phase in
                    switch phase {
                    case .success(let image):
                        image
                            .resizable()
                            .aspectRatio(contentMode: .fill)
                            .clipped()
                            .cornerRadius(10)
                            .overlay(
                                HStack {
                                    LinearGradient(colors: [Color.black.opacity(0.7), Color.clear], startPoint: .leading, endPoint: .trailing)
                                        .frame(width: 10)
                                    Spacer()
                                }
                            )
                    default:
                        VStack {
                            Spacer()
                            Text(book.title)
                                .font(.system(size: 11, weight: .bold, design: .serif))
                                .foregroundColor(.white)
                                .multilineTextAlignment(.center)
                                .padding(6)
                            Spacer()
                        }
                    }
                }
            }
            .shadow(color: Color.black.opacity(0.3), radius: 5, x: 0, y: 2)
            
            Text(book.title)
                .font(.system(size: 12, weight: .bold, design: .serif))
                .foregroundColor(.white)
                .lineLimit(1)
            
            Text(book.author)
                .font(.system(size: 10))
                .foregroundColor(Color(red: 229/255, green: 193/255, blue: 125/255))
                .lineLimit(1)
            
            HStack {
                Text(book.readTime)
                    .font(.system(size: 9, weight: .medium))
                    .foregroundColor(.gray)
                Spacer()
                HStack(spacing: 2) {
                    Image(systemName: "star.fill")
                        .font(.system(size: 8))
                        .foregroundColor(Color(red: 229/255, green: 193/255, blue: 125/255))
                    Text(String(format: "%.1f", book.rating))
                        .font(.system(size: 9, weight: .bold))
                        .foregroundColor(.white)
                }
            }
        }
    }
}

// MARK: - Book Reader Sheet View
struct BookReaderSheetView: View {
    let book: BookSummary
    let allBooks: [BookSummary]
    let onNavigate: (BookSummary) -> Void
    @Environment(\.dismiss) private var dismiss
    
    @State private var selectedDepth: Int = 0 // 0: Spark (1 min), 1: Core (15 min), 2: Masterclass (40 min)
    @ObservedObject private var audio = AudioPlayerEngine.shared
    
    private var currentIndex: Int {
        allBooks.firstIndex(where: { $0.id == book.id }) ?? 0
    }
    
    private var hasPrevious: Bool {
        currentIndex > 0
    }
    
    private var hasNext: Bool {
        currentIndex < (allBooks.count - 1)
    }
    
    var body: some View {
        NavigationStack {
            ZStack {
                Color(red: 12/255, green: 14/255, blue: 20/255).ignoresSafeArea()
                
                ScrollView {
                    VStack(alignment: .leading, spacing: 20) {
                        
                        // Header with 3D Cover & Metadata
                        HStack(alignment: .top, spacing: 16) {
                            AsyncImage(url: URL(string: book.coverUrl)) { phase in
                                if let image = phase.image {
                                    image
                                        .resizable()
                                        .aspectRatio(contentMode: .fill)
                                        .frame(width: 110, height: 160)
                                        .clipped()
                                        .cornerRadius(8)
                                        .shadow(color: .black.opacity(0.5), radius: 8, x: 0, y: 4)
                                } else {
                                    RoundedRectangle(cornerRadius: 8)
                                        .fill(Color.white.opacity(0.1))
                                        .frame(width: 110, height: 160)
                                }
                            }
                            
                            VStack(alignment: .leading, spacing: 6) {
                                Text(book.category.uppercased())
                                    .font(.system(size: 10, weight: .bold))
                                    .foregroundColor(Color(red: 229/255, green: 193/255, blue: 125/255))
                                    .tracking(1)
                                
                                Text(book.title)
                                    .font(.system(size: 20, weight: .bold, design: .serif))
                                    .foregroundColor(.white)
                                    .lineLimit(3)
                                
                                Text("By \(book.author) • \(book.year)")
                                    .font(.system(size: 12, weight: .medium))
                                    .foregroundColor(.gray)
                                
                                HStack(spacing: 10) {
                                    Label(book.readTime, systemImage: "clock")
                                        .font(.system(size: 11))
                                        .foregroundColor(.gray)
                                    
                                    Label(String(format: "%.1f", book.rating), systemImage: "star.fill")
                                        .font(.system(size: 11, weight: .bold))
                                        .foregroundColor(Color(red: 229/255, green: 193/255, blue: 125/255))
                                }
                                .padding(.top, 4)
                            }
                        }
                        .padding(.horizontal)
                        .padding(.top, 16)
                        
                        // Audio Narration Controls (Single-Voice, Pause/Resume/Stop Guaranteed)
                        HStack(spacing: 10) {
                            if audio.isPlaying && !audio.isPaused {
                                Button(action: {
                                    audio.pauseSpeech()
                                }) {
                                    HStack {
                                        Image(systemName: "pause.fill")
                                        Text("Pause")
                                    }
                                    .font(.system(size: 13, weight: .bold))
                                    .frame(maxWidth: .infinity)
                                    .padding(.vertical, 12)
                                    .background(Color.yellow.opacity(0.85))
                                    .foregroundColor(.black)
                                    .cornerRadius(12)
                                }
                                
                                Button(action: {
                                    audio.stop()
                                }) {
                                    HStack {
                                        Image(systemName: "square.fill")
                                        Text("Stop")
                                    }
                                    .font(.system(size: 13, weight: .bold))
                                    .frame(maxWidth: .infinity)
                                    .padding(.vertical, 12)
                                    .background(Color.red.opacity(0.8))
                                    .foregroundColor(.white)
                                    .cornerRadius(12)
                                }
                            } else if audio.isPaused {
                                Button(action: {
                                    audio.resumeSpeech()
                                }) {
                                    HStack {
                                        Image(systemName: "play.fill")
                                        Text("Resume")
                                    }
                                    .font(.system(size: 13, weight: .bold))
                                    .frame(maxWidth: .infinity)
                                    .padding(.vertical, 12)
                                    .background(Color(red: 229/255, green: 193/255, blue: 125/255))
                                    .foregroundColor(.black)
                                    .cornerRadius(12)
                                }
                                
                                Button(action: {
                                    audio.stop()
                                }) {
                                    HStack {
                                        Image(systemName: "square.fill")
                                        Text("Stop")
                                    }
                                    .font(.system(size: 13, weight: .bold))
                                    .frame(maxWidth: .infinity)
                                    .padding(.vertical, 12)
                                    .background(Color.red.opacity(0.8))
                                    .foregroundColor(.white)
                                    .cornerRadius(12)
                                }
                            } else {
                                Button(action: {
                                    let narrationText = "\(book.title) by \(book.author). Executive Thesis: \(book.executiveThesis). Bottom Line: \(book.bottomLine)"
                                    audio.playSpeech(text: narrationText, title: book.title, author: book.author)
                                }) {
                                    HStack {
                                        Image(systemName: "play.fill")
                                        Text("Listen to Studio Narration")
                                    }
                                    .font(.system(size: 13, weight: .bold))
                                    .frame(maxWidth: .infinity)
                                    .padding(.vertical, 12)
                                    .background(Color(red: 229/255, green: 193/255, blue: 125/255))
                                    .foregroundColor(.black)
                                    .cornerRadius(12)
                                }
                            }
                        }
                        .padding(.horizontal)
                        
                        // 3-Tier Depth Switcher
                        Picker("Depth", selection: $selectedDepth) {
                            Text("Spark (1m)").tag(0)
                            Text("Core (15m)").tag(1)
                            Text("Masterclass (40m)").tag(2)
                        }
                        .pickerStyle(.segmented)
                        .padding(.horizontal)
                        
                        // Depth Content Display
                        VStack(alignment: .leading, spacing: 18) {
                            if selectedDepth == 0 {
                                // SPARK TAB
                                VStack(alignment: .leading, spacing: 14) {
                                    SectionBox(title: "EXECUTIVE THESIS", icon: "bolt.fill") {
                                        Text(book.executiveThesis)
                                            .font(.system(size: 15, design: .serif))
                                            .foregroundColor(.white.opacity(0.95))
                                            .lineSpacing(5)
                                    }
                                    
                                    SectionBox(title: "30-SECOND BOTTOM LINE", icon: "checkmark.circle.fill") {
                                        Text(book.bottomLine)
                                            .font(.system(size: 14, weight: .medium))
                                            .foregroundColor(Color(red: 229/255, green: 193/255, blue: 125/255))
                                            .lineSpacing(4)
                                    }
                                    
                                    SectionBox(title: "THREE GOLDEN RULES", icon: "star.fill") {
                                        VStack(alignment: .leading, spacing: 10) {
                                            ForEach(Array(book.goldenRules.enumerated()), id: \.offset) { idx, rule in
                                                HStack(alignment: .top, spacing: 10) {
                                                    Text("\(idx + 1).")
                                                        .font(.system(size: 13, weight: .bold))
                                                        .foregroundColor(Color(red: 229/255, green: 193/255, blue: 125/255))
                                                    Text(rule)
                                                        .font(.system(size: 13))
                                                        .foregroundColor(.white.opacity(0.85))
                                                }
                                            }
                                        }
                                    }
                                }
                            } else if selectedDepth == 1 {
                                // CORE TAB (Chapters Breakdown)
                                VStack(alignment: .leading, spacing: 16) {
                                    ForEach(book.chapters, id: \.number) { chapter in
                                        VStack(alignment: .leading, spacing: 8) {
                                            Text("CHAPTER \(chapter.number): \(chapter.title.uppercased())")
                                                .font(.system(size: 11, weight: .bold))
                                                .tracking(1)
                                                .foregroundColor(Color(red: 229/255, green: 193/255, blue: 125/255))
                                            
                                            Text(chapter.breakdown)
                                                .font(.system(size: 14, design: .serif))
                                                .foregroundColor(.white.opacity(0.9))
                                                .lineSpacing(4)
                                            
                                            HStack(alignment: .top, spacing: 8) {
                                                Image(systemName: "lightbulb.fill")
                                                    .font(.system(size: 12))
                                                    .foregroundColor(Color(red: 229/255, green: 193/255, blue: 125/255))
                                                Text(chapter.keyInsight)
                                                    .font(.system(size: 12, weight: .medium))
                                                    .foregroundColor(.white.opacity(0.8))
                                            }
                                            .padding(10)
                                            .frame(maxWidth: .infinity, alignment: .leading)
                                            .background(Color.white.opacity(0.04))
                                            .cornerRadius(8)
                                        }
                                        .padding()
                                        .background(Color.white.opacity(0.03))
                                        .cornerRadius(12)
                                    }
                                }
                            } else {
                                // MASTERCLASS TAB
                                VStack(alignment: .leading, spacing: 16) {
                                    SectionBox(title: "DIALECTIC CRITIQUE & COUNTERPOINTS", icon: "shield.lefthalf.filled") {
                                        Text(book.dialecticCritique)
                                            .font(.system(size: 14, design: .serif))
                                            .foregroundColor(.white.opacity(0.9))
                                            .lineSpacing(5)
                                    }
                                    
                                    SectionBox(title: "EXECUTIVE QUOTE STUDIO", icon: "quote.opening") {
                                        VStack(alignment: .leading, spacing: 8) {
                                            Text("\"\(book.keyQuote)\"")
                                                .font(.system(size: 15, weight: .medium, design: .serif))
                                                .foregroundColor(Color(red: 229/255, green: 193/255, blue: 125/255))
                                                .italic()
                                            
                                            Text("— \(book.author)")
                                                .font(.system(size: 12, weight: .bold))
                                                .foregroundColor(.gray)
                                        }
                                    }
                                }
                            }
                        }
                        .padding(.horizontal)
                        
                        // Previous / Next Navigation Arrows Bar
                        HStack {
                            Button(action: {
                                if hasPrevious {
                                    onNavigate(allBooks[currentIndex - 1])
                                }
                            }) {
                                HStack {
                                    Image(systemName: "chevron.left")
                                    Text("Previous Book")
                                }
                                .font(.system(size: 12, weight: .bold))
                                .foregroundColor(hasPrevious ? .white : .gray.opacity(0.4))
                                .padding(.horizontal, 14)
                                .padding(.vertical, 8)
                                .background(Color.white.opacity(hasPrevious ? 0.08 : 0.02))
                                .cornerRadius(10)
                            }
                            .disabled(!hasPrevious)
                            
                            Spacer()
                            
                            Button(action: {
                                if hasNext {
                                    onNavigate(allBooks[currentIndex + 1])
                                }
                            }) {
                                HStack {
                                    Text("Next Book")
                                    Image(systemName: "chevron.right")
                                }
                                .font(.system(size: 12, weight: .bold))
                                .foregroundColor(hasNext ? .white : .gray.opacity(0.4))
                                .padding(.horizontal, 14)
                                .padding(.vertical, 8)
                                .background(Color.white.opacity(hasNext ? 0.08 : 0.02))
                                .cornerRadius(10)
                            }
                            .disabled(!hasNext)
                        }
                        .padding(.horizontal)
                        .padding(.top, 10)
                        
                    }
                    .padding(.bottom, 40)
                }
            }
            .navigationTitle("Synthesis Reader")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button("Done") {
                        AudioPlayerEngine.shared.stop()
                        dismiss()
                    }
                    .font(.system(size: 14, weight: .bold))
                    .foregroundColor(Color(red: 229/255, green: 193/255, blue: 125/255))
                }
            }
        }
    }
}

// MARK: - Section Box Helper
struct SectionBox<Content: View>: View {
    let title: String
    let icon: String
    let content: Content
    
    init(title: String, icon: String, @ViewBuilder content: () -> Content) {
        self.title = title
        self.icon = icon
        self.content = content()
    }
    
    var body: some View {
        VStack(alignment: .leading, spacing: 10) {
            HStack(spacing: 6) {
                Image(systemName: icon)
                    .font(.system(size: 11))
                    .foregroundColor(Color(red: 229/255, green: 193/255, blue: 125/255))
                Text(title)
                    .font(.system(size: 11, weight: .bold))
                    .tracking(1)
                    .foregroundColor(Color(red: 229/255, green: 193/255, blue: 125/255))
            }
            content
        }
        .padding(14)
        .frame(maxWidth: .infinity, alignment: .leading)
        .background(Color.white.opacity(0.04))
        .cornerRadius(12)
    }
}

// MARK: - Synthesize Sheet View
struct SynthesizeSheetView: View {
    let onBookCreated: (BookSummary) -> Void
    @Environment(\.dismiss) private var dismiss
    
    @State private var bookTitle: String = ""
    @State private var bookAuthor: String = ""
    @State private var selectedGenre: String = "Biographies & History"
    @State private var customGenre: String = ""
    @State private var isSynthesizing: Bool = false
    @State private var errorMessage: String? = nil
    
    let genres = [
        "Leadership & Strategy",
        "Psychology & Mind",
        "Productivity & Focus",
        "Wealth & Economics",
        "Ancient Classics",
        "Systems & Science",
        "Biographies & History",
        "Philosophy & Ethics",
        "Science & Technology",
        "Other"
    ]
    
    let quickSuggestions = [
        ("You Learn by Living", "Eleanor Roosevelt"),
        ("Good to Great", "Jim Collins"),
        ("Thinking, Fast and Slow", "Daniel Kahneman"),
        ("Meditations", "Marcus Aurelius"),
        ("Man's Search for Meaning", "Viktor Frankl")
    ]
    
    var effectiveCategory: String {
        if selectedGenre == "Other" && !customGenre.trimmingCharacters(in: .whitespaces).isEmpty {
            return customGenre.trimmingCharacters(in: .whitespaces)
        }
        return selectedGenre
    }
    
    var body: some View {
        NavigationStack {
            ZStack {
                Color(red: 10/255, green: 11/255, blue: 17/255).ignoresSafeArea()
                
                ScrollView {
                    VStack(alignment: .leading, spacing: 20) {
                        
                        VStack(alignment: .leading, spacing: 6) {
                            Text("SYNTHESIZE ANY BOOK")
                                .font(.system(size: 11, weight: .bold))
                                .tracking(2)
                                .foregroundColor(Color(red: 229/255, green: 193/255, blue: 125/255))
                            
                            Text("Live Cloudflare Edge + Gemini AI")
                                .font(.system(size: 22, weight: .heavy, design: .serif))
                                .foregroundColor(.white)
                            
                            Text("Queries Google Gemini 3.8 Flash via encrypted serverless edge proxy. Real academic and biographical grounding.")
                                .font(.system(size: 13))
                                .foregroundColor(.gray)
                        }
                        .padding(.top, 10)
                        
                        // Error banner if any
                        if let error = errorMessage {
                            HStack(alignment: .top, spacing: 8) {
                                Image(systemName: "exclamationmark.triangle.fill")
                                    .foregroundColor(.red)
                                Text(error)
                                    .font(.system(size: 12))
                                    .foregroundColor(.white)
                            }
                            .padding(12)
                            .frame(maxWidth: .infinity, alignment: .leading)
                            .background(Color.red.opacity(0.2))
                            .cornerRadius(10)
                        }
                        
                        // Inputs
                        VStack(alignment: .leading, spacing: 14) {
                            VStack(alignment: .leading, spacing: 6) {
                                Text("BOOK TITLE")
                                    .font(.system(size: 10, weight: .bold))
                                    .foregroundColor(.gray)
                                TextField("e.g. You Learn by Living or Thinking in Systems", text: $bookTitle)
                                    .padding(12)
                                    .background(Color.white.opacity(0.06))
                                    .foregroundColor(.white)
                                    .cornerRadius(10)
                            }
                            
                            VStack(alignment: .leading, spacing: 6) {
                                Text("AUTHOR (RECOMMENDED)")
                                    .font(.system(size: 10, weight: .bold))
                                    .foregroundColor(.gray)
                                TextField("e.g. Eleanor Roosevelt or Donella Meadows", text: $bookAuthor)
                                    .padding(12)
                                    .background(Color.white.opacity(0.06))
                                    .foregroundColor(.white)
                                    .cornerRadius(10)
                            }
                            
                            VStack(alignment: .leading, spacing: 6) {
                                Text("CATEGORY")
                                    .font(.system(size: 10, weight: .bold))
                                    .foregroundColor(.gray)
                                Picker("Category", selection: $selectedGenre) {
                                    ForEach(genres, id: \.self) { g in
                                        Text(g).tag(g)
                                    }
                                }
                                .pickerStyle(.menu)
                                .padding(8)
                                .frame(maxWidth: .infinity, alignment: .leading)
                                .background(Color.white.opacity(0.06))
                                .cornerRadius(10)
                            }
                            
                            if selectedGenre == "Other" {
                                VStack(alignment: .leading, spacing: 6) {
                                    Text("CUSTOM CATEGORY NAME")
                                        .font(.system(size: 10, weight: .bold))
                                        .foregroundColor(Color(red: 229/255, green: 193/255, blue: 125/255))
                                    TextField("e.g. Memoir, Neuroscience, Aviation...", text: $customGenre)
                                        .padding(12)
                                        .background(Color.white.opacity(0.06))
                                        .foregroundColor(.white)
                                        .cornerRadius(10)
                                }
                            }
                        }
                        
                        // Quick Suggestions
                        VStack(alignment: .leading, spacing: 8) {
                            Text("VERIFIED SUGGESTIONS")
                                .font(.system(size: 10, weight: .bold))
                                .foregroundColor(.gray)
                            
                            ScrollView(.horizontal, showsIndicators: false) {
                                HStack(spacing: 8) {
                                    ForEach(quickSuggestions, id: \.0) { item in
                                        Button(action: {
                                            bookTitle = item.0
                                            bookAuthor = item.1
                                        }) {
                                            Text(item.0)
                                                .font(.system(size: 11, weight: .medium))
                                                .padding(.horizontal, 10)
                                                .padding(.vertical, 6)
                                                .background(Color.white.opacity(0.05))
                                                .foregroundColor(Color(red: 229/255, green: 193/255, blue: 125/255))
                                                .cornerRadius(12)
                                        }
                                    }
                                }
                            }
                        }
                        
                        // Real Loading Progress
                        if isSynthesizing {
                            VStack(spacing: 10) {
                                ProgressView()
                                    .progressViewStyle(CircularProgressViewStyle(tint: Color(red: 229/255, green: 193/255, blue: 125/255)))
                                Text("Connecting to Gemini 3.8 Flash via Cloudflare Edge proxy (3–6s)...")
                                    .font(.system(size: 12, weight: .medium))
                                    .foregroundColor(.gray)
                            }
                            .frame(maxWidth: .infinity)
                            .padding()
                        }
                        
                        // Action Button
                        Button(action: {
                            guard !bookTitle.trimmingCharacters(in: .whitespaces).isEmpty else { return }
                            isSynthesizing = true
                            errorMessage = nil
                            
                            Task {
                                do {
                                    guard let endpoint = URL(string: "https://mindsprint-46j.pages.dev/api/synthesize") else {
                                        throw URLError(.badURL)
                                    }
                                    var request = URLRequest(url: endpoint)
                                    request.httpMethod = "POST"
                                    request.setValue("application/json", forHTTPHeaderField: "Content-Type")
                                    request.timeoutInterval = 75
                                    
                                    let payload: [String: Any] = [
                                        "title": bookTitle.trimmingCharacters(in: .whitespaces),
                                        "author": bookAuthor.trimmingCharacters(in: .whitespaces),
                                        "category": effectiveCategory,
                                        "targetLanguage": "English"
                                    ]
                                    request.httpBody = try JSONSerialization.data(withJSONObject: payload)
                                    
                                    let (data, response) = try await URLSession.shared.data(for: request)
                                    
                                    guard let httpRes = response as? HTTPURLResponse else {
                                        throw URLError(.badServerResponse)
                                    }
                                    
                                    if httpRes.statusCode != 200 {
                                        if let errObj = try? JSONSerialization.jsonObject(with: data) as? [String: Any],
                                           let errMsg = errObj["error"] as? String {
                                            throw NSError(domain: "MindSprint", code: httpRes.statusCode, userInfo: [NSLocalizedDescriptionKey: errMsg])
                                        } else {
                                            throw NSError(domain: "MindSprint", code: httpRes.statusCode, userInfo: [NSLocalizedDescriptionKey: "Server returned status \\(httpRes.statusCode)"])
                                        }
                                    }
                                    
                                    guard let json = try JSONSerialization.jsonObject(with: data) as? [String: Any] else {
                                        throw URLError(.cannotParseResponse)
                                    }
                                    
                                    let title = json["title"] as? String ?? bookTitle
                                    let subtitle = json["subtitle"] as? String ?? ""
                                    let author = json["author"] as? String ?? (bookAuthor.isEmpty ? "Author" : bookAuthor)
                                    let year = json["year"] as? String ?? "2024"
                                    let category = json["category"] as? String ?? effectiveCategory
                                    let rating = (json["rating"] as? NSNumber)?.doubleValue ?? 4.90
                                    let coverDict = json["cover"] as? [String: Any]
                                    let coverUrl = coverDict?["coverUrl"] as? String ?? "https://covers.openlibrary.org/b/id/14389659-L.jpg"
                                    
                                    let spark = json["spark"] as? [String: Any]
                                    let thesis = spark?["executiveThesis"] as? String ?? "Executive synthesis grounded in primary text."
                                    let bottomLine = spark?["bottomLine"] as? String ?? ""
                                    let goldenRules = spark?["threeGoldenRules"] as? [String] ?? []
                                    
                                    var parsedChapters: [BookChapter] = []
                                    if let core = json["core"] as? [String: Any],
                                       let chList = core["chapters"] as? [[String: Any]] {
                                        for (idx, ch) in chList.enumerated() {
                                            parsedChapters.append(BookChapter(
                                                number: ch["number"] as? Int ?? (idx + 1),
                                                title: ch["title"] as? String ?? "Chapter \\(idx + 1)",
                                                breakdown: ch["breakdown"] as? String ?? "",
                                                keyInsight: ch["keyInsight"] as? String ?? ""
                                            ))
                                        }
                                    }
                                    
                                    let masterclass = json["masterclass"] as? [String: Any]
                                    let critiqueDict = masterclass?["dialecticCritique"] as? [String: Any]
                                    let dialectic = critiqueDict?["authorBlindspots"] as? String ?? "Critique grounded in historical and intellectual boundaries."
                                    
                                    var firstQuote = ""
                                    if let quotes = json["keyQuotes"] as? [[String: Any]], let first = quotes.first {
                                        firstQuote = first["quote"] as? String ?? ""
                                    }
                                    
                                    let synthesizedBook = BookSummary(
                                        id: json["id"] as? String ?? UUID().uuidString,
                                        title: title,
                                        subtitle: subtitle,
                                        author: author,
                                        year: year,
                                        category: category,
                                        readTime: "14 min",
                                        rating: rating,
                                        coverUrl: coverUrl,
                                        executiveThesis: thesis,
                                        bottomLine: bottomLine,
                                        goldenRules: goldenRules,
                                        chapters: parsedChapters,
                                        dialecticCritique: dialectic,
                                        keyQuote: firstQuote
                                    )
                                    
                                    await MainActor.run {
                                        isSynthesizing = false
                                        onBookCreated(synthesizedBook)
                                    }
                                } catch {
                                    await MainActor.run {
                                        isSynthesizing = false
                                        errorMessage = error.localizedDescription
                                    }
                                }
                            }
                        }) {
                            HStack {
                                Image(systemName: "sparkles")
                                Text(isSynthesizing ? "Synthesizing with Gemini..." : "Generate Executive Synthesis")
                            }
                            .font(.system(size: 14, weight: .bold))
                            .frame(maxWidth: .infinity)
                            .padding(.vertical, 14)
                            .background(bookTitle.isEmpty || isSynthesizing ? Color.gray.opacity(0.3) : Color(red: 229/255, green: 193/255, blue: 125/255))
                            .foregroundColor(bookTitle.isEmpty || isSynthesizing ? .white.opacity(0.5) : .black)
                            .cornerRadius(12)
                        }
                        .disabled(bookTitle.isEmpty || isSynthesizing)
                        
                    }
                    .padding()
                }
            }
            .navigationTitle("New Synthesis")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button("Cancel") {
                        dismiss()
                    }
                    .foregroundColor(.gray)
                }
            }
        }
    }
}
