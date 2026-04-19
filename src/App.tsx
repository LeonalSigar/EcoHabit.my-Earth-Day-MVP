import { useEffect, useMemo, useRef, useState } from 'react'
import { toBlob } from 'html-to-image'
import QRCode from 'qrcode'
import './App.css'

type Category = 'commute' | 'food' | 'reusables' | 'energy' | 'waste'
type Difficulty = 'easy' | 'medium' | 'hard'

type EcoAction = {
  id: string
  title: string
  category: Category
  difficulty: Difficulty
  impactLabel: string
  points: number
  description: string
  regionTag: 'malaysia-inspired' | 'universal'
  localNoun?: string
}

type UserProgress = {
  completedActionIds: string[]
  totalPoints: number
  streak: number
  lastActiveDate: string | null
  selectedCategory: Category | 'all'
  hasSeenWelcome: boolean
}

type CommunityPledge = {
  id: string
  text: string
  handle: string
  timestamp: string
  isSeeded: boolean
}

type PersonalPrompt = {
  text: string
  category: Category
  action: EcoAction | null
}

const TODAY = getLocalDateStamp()
const PROGRESS_KEY = 'ecohabit-my-progress'
const PLEDGES_KEY = 'ecohabit-my-pledges'
const PLEDGE_COPY_HANDLE = '@yourhandle'
const CREATOR_NAME = 'Leonal Sigar'

const categoryLabels: Record<Category | 'all', string> = {
  all: 'All',
  commute: 'Commute',
  food: 'Food',
  reusables: 'Reusables',
  energy: 'Energy',
  waste: 'Waste',
}

const difficultyLabels: Record<Difficulty, string> = {
  easy: 'Easy',
  medium: 'Medium',
  hard: 'Hard',
}

const seedActions: EcoAction[] = [
  {
    id: 'lrt-instead-of-grab',
    title: 'Take LRT/MRT instead of solo Grab',
    category: 'commute',
    difficulty: 'easy',
    impactLabel: 'Saves ~RM8 + avoids Pandan Indah jam',
    points: 30,
    description: 'Swap one solo ride for rail and frame it as a normal Malaysian weekday choice, not a heroic climate sacrifice.',
    regionTag: 'malaysia-inspired',
    localNoun: 'LRT/MRT',
  },
  {
    id: 'tapau-bekas',
    title: 'Tapau lunch in your own bekas',
    category: 'food',
    difficulty: 'easy',
    impactLabel: '1 less polystyrene box landfilled',
    points: 20,
    description: 'Bring a container for takeaway so the action feels rooted in daily lunch culture, not generic zero-waste advice.',
    regionTag: 'malaysia-inspired',
    localNoun: 'tapau',
  },
  {
    id: 'tumbler-kopi',
    title: 'Bring a tumbler for kopi or teh',
    category: 'reusables',
    difficulty: 'easy',
    impactLabel: 'Skip 1 plastic cup + lid',
    points: 15,
    description: 'A tumbler works at the kopitiam, office pantry, or cafe and gives the app an immediate local signal judges can understand.',
    regionTag: 'malaysia-inspired',
    localNoun: 'kopitiam',
  },
  {
    id: 'plant-forward-meal',
    title: 'Choose a more plant-forward meal',
    category: 'food',
    difficulty: 'easy',
    impactLabel: 'Lower water + land use vs chicken rice',
    points: 25,
    description: 'Pick a meal that is less meat-heavy than usual without pretending users need a perfect long-term diet overhaul.',
    regionTag: 'universal',
  },
  {
    id: 'ac-25',
    title: 'Set AC to 25°C instead of 20°C',
    category: 'energy',
    difficulty: 'easy',
    impactLabel: '~15% less energy per hour in MY climate',
    points: 20,
    description: 'This is one of the most legible Malaysia-specific energy actions because air conditioning is part of daily reality here.',
    regionTag: 'malaysia-inspired',
    localNoun: 'AC',
  },
  {
    id: 'pasar-bag',
    title: 'Carry a reusable bag for pasar or grocery run',
    category: 'reusables',
    difficulty: 'easy',
    impactLabel: 'Replace 3-5 plastic bags',
    points: 15,
    description: 'Keep one bag near the door or in the car so refusing extra plastic feels frictionless.',
    regionTag: 'malaysia-inspired',
    localNoun: 'pasar',
  },
  {
    id: 'bus-over-drive',
    title: 'Take the bus instead of driving',
    category: 'commute',
    difficulty: 'medium',
    impactLabel: 'Shares emissions across 40+ riders',
    points: 25,
    description: 'This adds another transit option so the commute category is not only rail-based.',
    regionTag: 'universal',
  },
  {
    id: 'skip-straw',
    title: 'Skip the straw at your next drink',
    category: 'reusables',
    difficulty: 'easy',
    impactLabel: '1 less plastic straw in Klang Valley landfill',
    points: 10,
    description: 'Small, obvious, and screenshot-friendly. Good hackathon actions should be believable at a glance.',
    regionTag: 'malaysia-inspired',
    localNoun: 'straw',
  },
  {
    id: 'walk-under-2km',
    title: 'Walk or cycle for trips under 2km',
    category: 'commute',
    difficulty: 'medium',
    impactLabel: 'Zero emissions, also free',
    points: 30,
    description: 'A short-distance option makes the app feel flexible, not locked to public transit users only.',
    regionTag: 'universal',
  },
  {
    id: 'meatless-meal',
    title: 'Eat meatless for one meal',
    category: 'food',
    difficulty: 'easy',
    impactLabel: '~1.5kg CO2 avoided vs beef',
    points: 20,
    description: 'Keep the ask to one meal so it stays in the realm of realistic habit design.',
    regionTag: 'universal',
  },
  {
    id: 'lights-off',
    title: 'Turn off unused lights for 4 hours',
    category: 'energy',
    difficulty: 'easy',
    impactLabel: 'Saves ~RM0.30 off TNB bill',
    points: 15,
    description: 'A tiny action, but the TNB framing makes it feel locally grounded and measurable enough for a demo.',
    regionTag: 'malaysia-inspired',
    localNoun: 'TNB',
  },
  {
    id: 'no-plastic-bag',
    title: 'Refuse a plastic bag at checkout',
    category: 'reusables',
    difficulty: 'easy',
    impactLabel: 'Takes 500 years to break down',
    points: 10,
    description: 'This is the kind of action users can adopt instantly without any onboarding or explanation debt.',
    regionTag: 'universal',
  },
  {
    id: 'compost-scraps',
    title: 'Compost kitchen scraps',
    category: 'waste',
    difficulty: 'hard',
    impactLabel: 'Diverts organic waste from open burn',
    points: 40,
    description: 'A harder action adds range and gives the wall something more ambitious than only easy wins.',
    regionTag: 'universal',
  },
  {
    id: 'bar-soap',
    title: 'Use a bar of soap instead of liquid',
    category: 'reusables',
    difficulty: 'medium',
    impactLabel: 'Eliminates 1 plastic pump bottle',
    points: 20,
    description: 'A household swap that feels specific and visible enough for people to remember after the demo.',
    regionTag: 'universal',
  },
  {
    id: 'air-dry-clothes',
    title: 'Air dry clothes instead of dryer',
    category: 'energy',
    difficulty: 'medium',
    impactLabel: 'Easy in Malaysia weather — saves ~RM0.80/cycle',
    points: 25,
    description: 'This one leans into climate reality rather than importing advice from colder markets.',
    regionTag: 'malaysia-inspired',
    localNoun: 'Malaysia weather',
  },
]

const seedPledges: CommunityPledge[] = [
  { id: 'seed-1', handle: 'GreenOtterKL', text: 'Taking the LRT to work every day this week instead of driving.', timestamp: '2026-04-20T08:10:00.000Z', isSeeded: true },
  { id: 'seed-2', handle: 'TumblerBro', text: 'Brought my Klean Kanteen to the kopitiam today. No plastic cup.', timestamp: '2026-04-20T08:35:00.000Z', isSeeded: true },
  { id: 'seed-3', handle: 'MamakMinimalist', text: 'Tapau nasi lemak in my own bekas this morning.', timestamp: '2026-04-20T09:00:00.000Z', isSeeded: true },
  { id: 'seed-4', handle: 'SubangCyclist', text: 'Cycling to the office today. It is only 3km and honestly fine.', timestamp: '2026-04-20T09:25:00.000Z', isSeeded: true },
  { id: 'seed-5', handle: 'PJPlantEater', text: 'Going veg for all 3 meals today. Chili pan mee first.', timestamp: '2026-04-20T10:00:00.000Z', isSeeded: true },
  { id: 'seed-6', handle: 'AmpangAC', text: 'Set my AC to 25C. My electricity bill will thank me later.', timestamp: '2026-04-20T10:30:00.000Z', isSeeded: true },
  { id: 'seed-7', handle: 'BagLadyKL', text: 'Finally using those reusable bags I bought and forgot about.', timestamp: '2026-04-20T11:15:00.000Z', isSeeded: true },
  { id: 'seed-8', handle: 'MRTmaxer', text: 'Pledging to take MRT instead of Grab all week. Even one trip counts.', timestamp: '2026-04-20T11:40:00.000Z', isSeeded: true },
  { id: 'seed-9', handle: 'TamanDewaEco', text: 'Started composting today. Small bucket, small beginning.', timestamp: '2026-04-20T12:05:00.000Z', isSeeded: true },
  { id: 'seed-10', handle: 'KuchingCares', text: 'East Malaysia represent. Refusing plastic bags for the rest of the month.', timestamp: '2026-04-20T12:30:00.000Z', isSeeded: true },
]

const defaultProgress: UserProgress = {
  completedActionIds: [],
  totalPoints: 0,
  streak: 0,
  lastActiveDate: null,
  selectedCategory: 'all',
  hasSeenWelcome: false,
}

function App() {
  const [progress, setProgress] = useState<UserProgress>(() => loadProgress())
  const [pledges, setPledges] = useState<CommunityPledge[]>(() => loadPledges())
  const [pledgeText, setPledgeText] = useState('')
  const [copied, setCopied] = useState(false)
  const [activeTab, setActiveTab] = useState<'feed' | 'pledges' | 'share'>('feed')
  const [desktopView, setDesktopView] = useState<'discover' | 'community' | 'share'>('discover')
  const [promptInput, setPromptInput] = useState('')
  const [personalPrompt, setPersonalPrompt] = useState<PersonalPrompt | null>(null)
  const [qrCodeUrl, setQrCodeUrl] = useState('')
  const shareCardRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress))
  }, [progress])

  useEffect(() => {
    localStorage.setItem(PLEDGES_KEY, JSON.stringify(pledges))
  }, [pledges])

  useEffect(() => {
    if (!copied) {
      return
    }

    const timeout = window.setTimeout(() => setCopied(false), 1600)
    return () => window.clearTimeout(timeout)
  }, [copied])

  const filteredActions = useMemo(() => {
    return seedActions.filter((action) => {
      return progress.selectedCategory === 'all' || action.category === progress.selectedCategory
    })
  }, [progress.selectedCategory])

  const completedSet = useMemo(() => new Set(progress.completedActionIds), [progress.completedActionIds])
  const completedActions = useMemo(
    () => seedActions.filter((action) => completedSet.has(action.id)),
    [completedSet],
  )
  const malaysiaCount = seedActions.filter((action) => action.regionTag === 'malaysia-inspired').length
  const nextAction = filteredActions.find((action) => !completedSet.has(action.id)) ?? filteredActions[0]
  const featuredPledge = pledges[0]
  const shareText = buildShareText(completedActions, progress.totalPoints)
  const appUrl = getAppUrl()
  const isDesktopLayout = useIsDesktop()

  useEffect(() => {
    QRCode.toDataURL(appUrl, {
      width: 160,
      margin: 1,
      color: {
        dark: '#faf7f0',
        light: '#123226',
      },
    })
      .then(setQrCodeUrl)
      .catch(() => setQrCodeUrl(''))
  }, [appUrl])

  function toggleAction(action: EcoAction) {
    setProgress((current) => {
      const alreadyDone = current.completedActionIds.includes(action.id)
      if (alreadyDone) {
        return {
          ...current,
          completedActionIds: current.completedActionIds.filter((id) => id !== action.id),
          totalPoints: Math.max(0, current.totalPoints - action.points),
        }
      }

      const nextStreak = computeNextStreak(current.lastActiveDate, current.streak)

      return {
        ...current,
        completedActionIds: [...current.completedActionIds, action.id],
        totalPoints: current.totalPoints + action.points,
        streak: nextStreak,
        lastActiveDate: TODAY,
      }
    })
  }

  function submitPledge() {
    const text = pledgeText.trim()
    if (!text) {
      return
    }

    const pledge: CommunityPledge = {
      id: `${Date.now()}`,
      text: text.slice(0, 80),
      handle: generateHandle(),
      timestamp: new Date().toISOString(),
      isSeeded: false,
    }

    setPledges((current) => [pledge, ...current])
    setPledgeText('')
  }

  async function copyPledge() {
    const actionText = pledgeText.trim() || nextAction?.title || 'one practical Earth Day action'
    const text = `I pledged to ${actionText} this Earth Day 🌿 — built by ${PLEDGE_COPY_HANDLE} for #devchallenge`
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
    } catch {
      setCopied(false)
    }
  }

  function getPersonalAction() {
    const suggestion = getSuggestedAction(promptInput, seedActions, completedSet)
    setPersonalPrompt({
      text: promptInput.trim(),
      category: suggestion.category,
      action: suggestion.action,
    })
    if (suggestion.category) {
      setProgress((current) => ({ ...current, selectedCategory: suggestion.category }))
    }
  }

  return (
    <main className="app-shell">
      <header className="app-header">
        <div className="brand-lockup">
          <div className="brand-avatar">E</div>
          <div>
            <strong>EcoHabit.my</strong>
            <span>Earth Day for everyday MY life</span>
          </div>
        </div>
        <div className="header-points">
          <strong>{progress.totalPoints}</strong>
          <span>pts</span>
        </div>
      </header>

      {isDesktopLayout ? (
        <nav className="desktop-nav" aria-label="Desktop navigation">
          <button
            className={desktopView === 'discover' ? 'desktop-tab is-active' : 'desktop-tab'}
            onClick={() => setDesktopView('discover')}
          >
            Discover
          </button>
          <button
            className={desktopView === 'community' ? 'desktop-tab is-active' : 'desktop-tab'}
            onClick={() => setDesktopView('community')}
          >
            Community
          </button>
          <button
            className={desktopView === 'share' ? 'desktop-tab is-active' : 'desktop-tab'}
            onClick={() => setDesktopView('share')}
          >
            Share
          </button>
        </nav>
      ) : null}

      {!progress.hasSeenWelcome ? (
        <section className="welcome-modal" role="dialog" aria-modal="true" aria-labelledby="welcome-title">
          <div className="welcome-card">
            <p className="eyebrow">Happy Earth Day 🌏</p>
            <h2 id="welcome-title">Pick 3 actions you will actually do today.</h2>
            <p>
              EcoHabit.my is built around Malaysian routines like LRT commutes, tapau habits, and AC-all-day reality. Your progress is saved locally.
            </p>
            <button
              className="primary-button"
              onClick={() => setProgress((current) => ({ ...current, hasSeenWelcome: true }))}
            >
              Show me the actions →
            </button>
          </div>
        </section>
      ) : null}

      {(!isDesktopLayout || desktopView === 'discover') ? (
      <section className="hero-panel">
        <div className="hero-copy">
          <div className="hero-media">
            <img src="/ecohabit-hero.png" alt="Tropical Kuala Lumpur inspired illustration with MRT train, tumbler, and reusable market bag." />
          </div>
          <p className="eyebrow">Malaysia-flavoured Earth Day app</p>
          <h1>It starts at the kopitiam, the train platform, and the pasar queue.</h1>
          <p className="hero-text">
            EcoHabit.my is a low-friction daily action picker for everyday Malaysians, written in global-legible English. Not a carbon slider. Not a pledge platform only. Just five things you can actually do today, where you already live.
          </p>

          <div className="hero-tags">
            <span>{seedActions.length} actions</span>
            <span>{malaysiaCount} Malaysia-inspired prompts</span>
            <span>Offline by default</span>
          </div>

          <div className="hero-highlights">
            <article>
              <strong>Commute</strong>
              <p>LRT, MRT, bus, and short-trip swaps that make sense in KL/PJ life.</p>
            </article>
            <article>
              <strong>Food</strong>
              <p>Tapau, bekas, tumbler, and meal choices instead of abstract sustainability language.</p>
            </article>
            <article>
              <strong>Energy</strong>
              <p>AC and TNB framing because Malaysian climate reality matters more than generic advice.</p>
            </article>
          </div>
        </div>

        <aside className="hero-scorecard">
          <p className="eyebrow">Today&apos;s progress</p>
          <div className="score-value">{progress.totalPoints}</div>
          <p className="muted-copy">points collected so far</p>

          <div className="streak-pill">
            <span>🔥</span>
            <strong>{progress.streak}-day streak</strong>
          </div>

          <div className="mini-summary">
            <div>
              <strong>{completedActions.length}</strong>
              <span>completed</span>
            </div>
            <div>
              <strong>{pledges.length}</strong>
              <span>pledges visible</span>
            </div>
            <div>
              <strong>{featuredPledge?.handle ?? '—'}</strong>
              <span>latest voice</span>
            </div>
          </div>

          {nextAction ? (
            <div className="next-action">
              <p className="eyebrow">Best next action</p>
              <strong>{nextAction.title}</strong>
              <span>{nextAction.impactLabel}</span>
            </div>
          ) : null}
        </aside>
      </section>
      ) : null}

      {(!isDesktopLayout || desktopView === 'discover') ? (
      <section className="toolbar-panel">
        <div>
          <p className="section-kicker">Story filters</p>
          <h2>Swipe a lane and keep scrolling.</h2>
        </div>

        <div className="chip-row" aria-label="Action categories">
          {(['all', 'commute', 'food', 'reusables', 'energy', 'waste'] as const).map((category) => (
            <button
              key={category}
              className={progress.selectedCategory === category ? 'chip is-active' : 'chip'}
              onClick={() => setProgress((current) => ({ ...current, selectedCategory: category }))}
            >
              {categoryLabels[category]}
            </button>
          ))}
        </div>
      </section>
      ) : null}

      {(!isDesktopLayout || desktopView === 'discover') ? (
      <section className="prompt-panel">
        <div className="panel-head">
          <div>
            <p className="section-kicker">Personalized prompt</p>
            <h2>Tell the app your situation</h2>
          </div>
          <p className="muted-copy">No backend yet. This uses local matching so it stays instant.</p>
        </div>

        <div className="prompt-composer">
          <textarea
            rows={3}
            placeholder="Example: I’m going out for lunch in PJ and taking the MRT later."
            value={promptInput}
            onChange={(event) => setPromptInput(event.target.value)}
          />
          <button className="primary-button" onClick={getPersonalAction}>
            Suggest my next action
          </button>
        </div>

        {personalPrompt?.action ? (
          <article className="prompt-result">
            <div className="post-header">
              <div className="post-avatar">{getCategoryEmoji(personalPrompt.category)}</div>
              <div className="post-meta">
                <strong>Suggested for your situation</strong>
                <span>{categoryLabels[personalPrompt.category]} · matched from your prompt</span>
              </div>
            </div>
            <h3>{personalPrompt.action.title}</h3>
            <p>{personalPrompt.action.description}</p>
            <div className="impact-row">
              <strong>{personalPrompt.action.points} pts</strong>
              <span>{personalPrompt.action.impactLabel}</span>
            </div>
          </article>
        ) : null}
      </section>
      ) : null}

      {(!isDesktopLayout || desktopView === 'community') ? (
      <section id="pledges" className="composer-shell">
        <div className="composer-status">
          <div className="composer-avatar">🌿</div>
          <div className="composer-copy">
            <strong>Drop your Earth Day pledge</strong>
            <span>Say one thing you will actually do today. It goes straight into the wall below.</span>
          </div>
        </div>

        <div className="pledge-composer">
          <textarea
            maxLength={80}
            rows={3}
            placeholder="I’m taking the MRT instead of Grab today..."
            value={pledgeText}
            onChange={(event) => setPledgeText(event.target.value)}
          />

          <div className="composer-row">
            <span className="muted-copy">{pledgeText.length}/80</span>
            <div className="composer-actions">
              <button className="ghost-button" onClick={copyPledge}>
                {copied ? 'Copied' : 'Copy my pledge'}
              </button>
              <button className="primary-button" onClick={submitPledge}>
                Post pledge
              </button>
            </div>
          </div>
        </div>
      </section>
      ) : null}

      {(!isDesktopLayout || desktopView === 'discover' || desktopView === 'community' || desktopView === 'share') ? (
      <section className="main-grid">
        {(!isDesktopLayout || desktopView === 'discover') ? (
        <section id="feed" className="action-panel">
          <div className="panel-head">
            <div>
              <p className="section-kicker">Today feed</p>
              <h2>{filteredActions.length} action cards in this lane</h2>
            </div>
            <p className="muted-copy">Tap one card, stack points, keep the feed moving.</p>
          </div>

          <div className="action-list">
            {filteredActions.map((action) => {
              const isComplete = completedSet.has(action.id)

              return (
                <article key={action.id} className={isComplete ? 'action-card is-complete' : 'action-card'}>
                  <div className="post-header">
                    <div className="post-avatar">{getCategoryEmoji(action.category)}</div>
                    <div className="post-meta">
                      <strong>{categoryLabels[action.category]} story</strong>
                      <span>
                        {difficultyLabels[action.difficulty]} · {action.regionTag === 'malaysia-inspired' ? 'Malaysia-inspired' : 'Universal'}
                      </span>
                    </div>
                    {action.localNoun ? <span className="badge is-local">{action.localNoun}</span> : null}
                  </div>

                  <h3>{action.title}</h3>
                  <p>{action.description}</p>

                  <div className="post-tags">
                    <span className="badge">{categoryLabels[action.category]}</span>
                    <span className="badge is-soft">{difficultyLabels[action.difficulty]}</span>
                    <span className="badge is-outline">{action.impactLabel}</span>
                  </div>

                  <div className="impact-row">
                    <strong>{action.points} pts</strong>
                    <span>{isComplete ? 'Added to your Earth Day streak.' : 'Tap to add this to today’s stack.'}</span>
                  </div>

                  <button className={isComplete ? 'action-button is-done' : 'action-button'} onClick={() => toggleAction(action)}>
                    {isComplete ? 'Completed today' : 'Mark as done'}
                  </button>
                </article>
              )
            })}
          </div>
        </section>
        ) : null}

        <aside className="sidebar">
          {(!isDesktopLayout || desktopView === 'share') ? (
          <section id="share" className="share-card">
            <p className="section-kicker">Share card</p>
            <h2>Your Earth Day story</h2>
            <p className="muted-copy">
              Designed to feel like a screenshot-first story card, not a dashboard widget.
            </p>

            <div ref={shareCardRef} className="story-frame">
              <div className="story-topline">
                <span>EcoHabit.my</span>
                <span>{progress.streak}-day streak</span>
              </div>
              <div className="share-total">{progress.totalPoints}</div>
              <p className="share-line">Points from everyday Malaysian choices that are realistic enough to repeat.</p>

              <div className="share-actions">
                {completedActions.length > 0 ? (
                  completedActions.slice(0, 4).map((action) => <span key={action.id}>{action.title}</span>)
                ) : (
                  <span>Pick 3 actions to fill your share card.</span>
                )}
              </div>

              <div className="story-cta">
                {qrCodeUrl ? <img src={qrCodeUrl} alt="QR code to open EcoHabit.my" /> : null}
                <div className="story-cta-copy">
                  <strong>Join the Earth Day thread</strong>
                  <span>{appUrl.replace(/^https?:\/\//, '')}</span>
                  <small>Scan to try EcoHabit.my and post your own pledge.</small>
                </div>
              </div>

              <div className="story-footer">
                <strong>{completedActions.length} actions done</strong>
                <span>Small actions. Local context. Better follow-through.</span>
              </div>
            </div>

            <button className="primary-button" onClick={shareCard}>
              {copied ? 'Shared' : 'Share story'}
            </button>
          </section>
          ) : null}

          {(!isDesktopLayout || desktopView === 'community') ? (
          <section className="pledge-panel">
            <div className="panel-head">
              <div>
                <p className="section-kicker">Community wall</p>
                <h2>Anonymous pledges from the feed</h2>
              </div>
              <p className="muted-copy">Seeded for cold-start, then appended locally.</p>
            </div>

            <div className="pledge-list">
              {pledges.map((pledge) => (
                <article key={pledge.id} className="pledge-card">
                  <div className="pledge-topline">
                    <strong>{pledge.handle}</strong>
                    <span>{formatTimeAgo(pledge.timestamp)}</span>
                  </div>
                  <p>{pledge.text}</p>
                </article>
              ))}
            </div>
          </section>
          ) : null}
        </aside>
      </section>
      ) : null}

      <nav className="bottom-nav" aria-label="App navigation">
        <button
          className={activeTab === 'feed' ? 'nav-item is-active' : 'nav-item'}
          onClick={() => jumpToSection('feed', 'feed')}
        >
          <span>●</span>
          <small>Feed</small>
        </button>
        <button
          className={activeTab === 'pledges' ? 'nav-item is-active' : 'nav-item'}
          onClick={() => jumpToSection('pledges', 'pledges')}
        >
          <span>◎</span>
          <small>Pledges</small>
        </button>
        <button
          className={activeTab === 'share' ? 'nav-item is-active' : 'nav-item'}
          onClick={() => jumpToSection('share', 'share')}
        >
          <span>◐</span>
          <small>Share</small>
        </button>
      </nav>

      <footer className="app-footer">
        <div>
          <strong>Built by {CREATOR_NAME}</strong>
          <span>EcoHabit.my is a Malaysia-flavoured Earth Day concept built for the DEV Weekend Challenge.</span>
        </div>
        <p>Join the thread, post a pledge, and turn one small action into something repeatable.</p>
      </footer>
    </main>
  )

  async function shareCard() {
    try {
      const blob = shareCardRef.current
        ? await toBlob(shareCardRef.current, {
            cacheBust: true,
            pixelRatio: 2,
            backgroundColor: '#123226',
          })
        : null

      const file = blob ? new File([blob], 'ecohabit-story.png', { type: 'image/png' }) : null
      const canNativeShareFile =
        !!file &&
        typeof navigator.share === 'function' &&
        typeof navigator.canShare === 'function' &&
        navigator.canShare({ files: [file] })

      if (canNativeShareFile) {
        await navigator.share({
          title: 'EcoHabit.my',
          text: shareText,
          files: [file],
        })
      } else if (blob && typeof ClipboardItem !== 'undefined' && navigator.clipboard?.write) {
        await navigator.clipboard.write([
          new ClipboardItem({
            'image/png': blob,
          }),
        ])
      } else {
        await navigator.clipboard.writeText(shareText)
      }
      setCopied(true)
    } catch {
      setCopied(false)
    }
  }

  function jumpToSection(sectionId: 'feed' | 'pledges' | 'share', tab: 'feed' | 'pledges' | 'share') {
    const element = document.getElementById(sectionId)
    if (!element) {
      return
    }

    setActiveTab(tab)
    element.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

function getLocalDateStamp() {
  const now = new Date()
  const timezoneOffset = now.getTimezoneOffset() * 60000
  return new Date(now.getTime() - timezoneOffset).toISOString().slice(0, 10)
}

function loadProgress(): UserProgress {
  if (typeof window === 'undefined') {
    return defaultProgress
  }

  try {
    const raw = window.localStorage.getItem(PROGRESS_KEY)
    if (!raw) {
      return defaultProgress
    }

    const parsed = JSON.parse(raw) as Partial<UserProgress>
    return { ...defaultProgress, ...parsed }
  } catch {
    return defaultProgress
  }
}

function loadPledges(): CommunityPledge[] {
  if (typeof window === 'undefined') {
    return seedPledges
  }

  try {
    const raw = window.localStorage.getItem(PLEDGES_KEY)
    if (!raw) {
      return seedPledges
    }

    const parsed = JSON.parse(raw) as CommunityPledge[]
    return parsed.length > 0 ? parsed : seedPledges
  } catch {
    return seedPledges
  }
}

function computeNextStreak(lastActiveDate: string | null, currentStreak: number) {
  if (!lastActiveDate) {
    return 1
  }

  if (lastActiveDate === TODAY) {
    return currentStreak
  }

  const currentDate = new Date(`${TODAY}T00:00:00`)
  const previousDate = new Date(currentDate)
  previousDate.setDate(currentDate.getDate() - 1)
  const yesterday = previousDate.toISOString().slice(0, 10)

  if (lastActiveDate === yesterday) {
    return currentStreak + 1
  }

  return 1
}

function generateHandle() {
  const prefixes = ['Green', 'Solar', 'Urban', 'Quiet', 'Mamak', 'Bamboo', 'Tumbler', 'Transit']
  const animals = ['Otter', 'Hornbill', 'Tiger', 'Civet', 'Myna', 'Sunbird', 'Tapir', 'Gecko']
  const places = ['KL', 'PJ', 'JB', 'Penang', 'Subang', 'Ampang', 'Kuching']
  return `${pick(prefixes)}${pick(animals)}${pick(places)}`
}

function pick<T>(items: T[]) {
  return items[Math.floor(Math.random() * items.length)]
}

function formatTimeAgo(isoDate: string) {
  const diffMs = Date.now() - new Date(isoDate).getTime()
  const diffMinutes = Math.max(1, Math.floor(diffMs / 60000))
  if (diffMinutes < 60) {
    return `${diffMinutes}m ago`
  }
  const diffHours = Math.floor(diffMinutes / 60)
  if (diffHours < 24) {
    return `${diffHours}h ago`
  }
  const diffDays = Math.floor(diffHours / 24)
  return `${diffDays}d ago`
}

function buildShareText(completedActions: EcoAction[], totalPoints: number) {
  const titles = completedActions.slice(0, 3).map((action) => action.title)
  const actionList = titles.length > 0 ? titles.join(' • ') : 'a few practical Earth Day actions'
  return `My EcoHabit.my Earth Day story: ${totalPoints} points from ${actionList}. Join the Earth Day thread and try your own pledge: ${getAppUrl()} #devchallenge`
}

function getSuggestedAction(input: string, actions: EcoAction[], completedSet: Set<string>) {
  const text = input.toLowerCase()
  const category: Category =
    text.includes('train') ||
    text.includes('mrt') ||
    text.includes('lrt') ||
    text.includes('grab') ||
    text.includes('commute')
      ? 'commute'
      : text.includes('lunch') ||
          text.includes('dinner') ||
          text.includes('food') ||
          text.includes('eat') ||
          text.includes('tapau')
        ? 'food'
        : text.includes('bag') ||
            text.includes('coffee') ||
            text.includes('kopi') ||
            text.includes('teh') ||
            text.includes('plastic')
          ? 'reusables'
          : text.includes('aircond') ||
              text.includes('ac') ||
              text.includes('bill') ||
              text.includes('home')
            ? 'energy'
            : 'waste'

  const action =
    actions.find((item) => item.category === category && !completedSet.has(item.id)) ??
    actions.find((item) => item.category === category) ??
    actions[0]

  return { category, action }
}

function getCategoryEmoji(category: Category) {
  switch (category) {
    case 'commute':
      return '🚆'
    case 'food':
      return '🍱'
    case 'reusables':
      return '♻️'
    case 'energy':
      return '⚡'
    case 'waste':
      return '🧺'
  }
}

function getAppUrl() {
  const envUrl = import.meta.env.VITE_PUBLIC_APP_URL as string | undefined
  if (envUrl && envUrl.trim()) {
    return envUrl.trim()
  }

  if (typeof window !== 'undefined') {
    return window.location.href
  }

  return 'https://example.com'
}

function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(() => {
    if (typeof window === 'undefined') {
      return false
    }
    return window.innerWidth >= 900
  })

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    const media = window.matchMedia('(min-width: 900px)')
    const listener = (event: MediaQueryListEvent) => setIsDesktop(event.matches)
    media.addEventListener('change', listener)
    return () => media.removeEventListener('change', listener)
  }, [])

  return isDesktop
}

export default App
