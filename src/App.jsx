import { useMemo, useState } from 'react'
import { Link, Routes, Route, useNavigate, useParams } from 'react-router-dom'
import { BlockMath, InlineMath } from 'react-katex'
import { topics, getTopic, topicOrder } from './data/topics'
import './App.css'

function App() {
  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand-wrap">
          <Link to="/" className="brand">Physics II Compass</Link>
          <a
            className="byline"
            href="https://github.com/NazariiTsubera"
            target="_blank"
            rel="noreferrer"
          >
            By Nazarii Tsubera
          </a>
        </div>
        <nav className="topnav">
          <Link to="/">Guide</Link>
          <a href="#how-to-use">How to use</a>
          <a href="#topics">Topics</a>
        </nav>
      </header>

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/topic/:slug" element={<TopicPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <footer className="footer">
        <span>University Physics II • exam-ready study guide</span>
        <span className="footer-note">Built for clarity, accuracy, and interactive practice.</span>
      </footer>
    </div>
  )
}

function Home() {
  return (
    <div className="hero">
      <section className="intro-card">
        <p className="eyebrow">Final exam prep • calculus-based University Physics II</p>
        <h1>Turn Maxwell to mastery.</h1>
        <p className="lede">
          Quick primers, walkthroughs, flashcards, and mini quizzes for every topic. Skim the core ideas, test
          yourself, and jump to the page you need.
        </p>
        <div className="cta-row">
          <Link className="cta primary" to={`/topic/${topics[0].slug}`}>
            Start with Electric Fields
          </Link>
          <a className="cta ghost" href="#topics">Browse all topics</a>
        </div>
        <div className="pill-row" id="how-to-use">
          <div className="pill">5–10 min per topic</div>
          <div className="pill">Superposition of practice modes</div>
          <div className="pill">Equations + intuition side by side</div>
        </div>
      </section>

      <section className="how-to">
        <div className="how-to-card">
          <h2>How to use</h2>
          <ol className="steps">
            <li>Skim the key ideas to anchor vocabulary and direction of vectors.</li>
            <li>Work through the example; narrate the physics before the math.</li>
            <li>Flip the flashcards until you can say the back out loud without peeking.</li>
            <li>Answer the mini quiz; write why each wrong option fails.</li>
            <li>Note pitfalls + habits, then jump to the next topic.</li>
          </ol>
          <div className="tips-grid">
            <div>
              <p className="tip-title">Exam sprint</p>
              <p>Cycle through all topics once, then revisit weak quizzes.</p>
            </div>
            <div>
              <p className="tip-title">Group mode</p>
              <p>Split topics with friends and teach back in 3 minutes each.</p>
            </div>
            <div>
              <p className="tip-title">Memory hook</p>
              <p>Attach each equation to a picture: plates, loops, coils, waves.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="topics" id="topics">
        <div className="section-head">
          <h2>Topics</h2>
          <p className="section-sub">Each opens to a dedicated page with walkthroughs and checks.</p>
        </div>
        <div className="topic-grid">
          {topics.map((topic) => (
            <TopicCard key={topic.slug} topic={topic} />
          ))}
        </div>
      </section>
    </div>
  )
}

function TopicCard({ topic }) {
  return (
    <Link to={`/topic/${topic.slug}`} className="topic-card">
      <div className="card-header">
        <p className="eyebrow">Study guide</p>
        <h3>{topic.title}</h3>
        <p className="card-blurb">{topic.blurb}</p>
      </div>
      <div className="chips">
        {topic.keyIdeas.slice(0, 3).map((idea, idx) => (
          <span className="chip" key={idx}>
            {idea}
          </span>
        ))}
      </div>
      <span className="more">Open page →</span>
    </Link>
  )
}

function TopicPage() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const topic = useMemo(() => getTopic(slug), [slug])

  if (!topic) {
    return <NotFound />
  }

  const index = topicOrder.indexOf(slug)
  const prev = topicOrder[(index - 1 + topicOrder.length) % topicOrder.length]
  const next = topicOrder[(index + 1) % topicOrder.length]

  return (
    <div className="topic-page">
      <div className="breadcrumb">
        <button className="icon-btn" onClick={() => navigate(-1)} aria-label="Go back">
          ← Back
        </button>
        <span className="crumb-sep">/</span>
        <Link to="/">Home</Link>
        <span className="crumb-sep">/</span>
        <span className="crumb-current">{topic.title}</span>
      </div>

      <section className="topic-hero">
        <div>
          <p className="eyebrow">Exam focus</p>
          <h1>{topic.title}</h1>
          <p className="lede">{topic.blurb}</p>
          <div className="pill-row">
            <div className="pill">Key ideas</div>
            <div className="pill">Equations</div>
            <div className="pill">Example + quiz</div>
          </div>
        </div>
        <div className="side-panel">
          <p className="tip-title">Study sprint</p>
          <p className="card-blurb">5–10 minutes: read → walk through → flashcards → quiz → pitfalls.</p>
          <p className="tip-title">Common traps</p>
          <ul className="pitfalls">
            {topic.pitfalls.map((p, idx) => (
              <li key={idx}>{p}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="panel">
        <div className="section-head">
          <h2>Key ideas</h2>
          <p className="section-sub">Conceptual checkpoints before diving into math.</p>
        </div>
        <div className="pill-stack">
          {topic.keyIdeas.map((idea, idx) => (
            <div key={idx} className="pill wide">
              {idea}
            </div>
          ))}
        </div>
      </section>

      <section className="panel equations">
        <div className="section-head">
          <h2>Equations with context</h2>
          <p className="section-sub">Memorize form + when to use it.</p>
        </div>
        <div className="equation-grid">
          {topic.equations.map((eq) => (
            <div key={eq.name} className="equation-card">
              <p className="eq-name">{eq.name}</p>
              <div className="eq-formula">
                <BlockMath math={eq.formula} errorColor="#ffae7d" />
              </div>
              <p className="eq-note">
                <TextWithMath text={eq.note} />
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="panel">
        <div className="section-head">
          <h2>Example walkthrough</h2>
          <p className="section-sub">Narrate the physics, then compute.</p>
        </div>
        <div className="walkthrough">
          <div className="walkthrough-question">{topic.walkthrough.prompt}</div>
          <ol className="walkthrough-steps">
            {topic.walkthrough.steps.map((step, idx) => (
              <li key={idx}>{step}</li>
            ))}
          </ol>
        </div>
      </section>

      <section className="panel interactive">
        <div className="section-head">
          <h2>Flashcards</h2>
          <p className="section-sub">Tap to flip. If you hesitate, revisit the equations.</p>
        </div>
        <div className="flashcard-grid">
          {topic.flashcards.map((card, idx) => (
            <Flashcard key={idx} front={card.front} back={card.back} />
          ))}
        </div>
      </section>

      <section className="panel interactive">
        <div className="section-head">
          <h2>Quick quiz</h2>
          <p className="section-sub">One question to verify you can apply the idea immediately.</p>
        </div>
        <QuizCard quiz={topic.quiz} />
      </section>

      <section className="panel">
        <div className="section-head">
          <h2>Habits that prevent mistakes</h2>
          <p className="section-sub">Use these as a checklist during homework and exams.</p>
        </div>
        <ul className="habits">
          {topic.habits.map((habit, idx) => (
            <li key={idx}>{habit}</li>
          ))}
        </ul>
      </section>

      <section className="panel next-nav">
        <div className="next-links">
          <Link className="cta ghost" to={`/topic/${prev}`}>
            ← {getTopic(prev)?.title}
          </Link>
          <Link className="cta primary" to={`/topic/${next}`}>
            {getTopic(next)?.title} →
          </Link>
        </div>
      </section>
    </div>
  )
}

function Flashcard({ front, back }) {
  const [flipped, setFlipped] = useState(false)
  return (
    <button className={`flashcard ${flipped ? 'flipped' : ''}`} onClick={() => setFlipped((f) => !f)}>
      <div className="flashcard-face front">{front}</div>
      <div className="flashcard-face back">{back}</div>
    </button>
  )
}

function QuizCard({ quiz }) {
  const [choice, setChoice] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const isCorrect = submitted && choice === quiz.answer

  return (
    <div className="quiz-card">
      <p className="quiz-question">{quiz.question}</p>
      <div className="quiz-options">
        {quiz.options.map((opt) => (
          <label key={opt} className={`quiz-option ${submitted && opt === quiz.answer ? 'correct' : ''}`}>
            <input
              type="radio"
              name="quiz"
              value={opt}
              checked={choice === opt}
              onChange={(e) => {
                setChoice(e.target.value)
                setSubmitted(false)
              }}
            />
            <span>{opt}</span>
          </label>
        ))}
      </div>
      <div className="quiz-actions">
        <button className="cta primary" onClick={() => setSubmitted(true)} disabled={!choice}>
          Check
        </button>
        {submitted && (
          <span className={`quiz-feedback ${isCorrect ? 'good' : 'bad'}`}>
            {isCorrect ? 'Correct! ' : 'Not yet. '}
            {quiz.rationale}
          </span>
        )}
      </div>
    </div>
  )
}

function TextWithMath({ text }) {
  if (!text) return null
  const parts = text.split(/(\$[^$]+?\$)/g)
  return parts.map((part, idx) => {
    const isMath = part.startsWith('$') && part.endsWith('$')
    if (isMath) {
      const math = part.slice(1, -1)
      return <InlineMath key={idx} math={math} errorColor="#ffae7d" />
    }
    return (
      <span key={idx}>
        {part}
      </span>
    )
  })
}

function NotFound() {
  return (
    <div className="not-found">
      <h1>Topic not found</h1>
      <p>Try choosing a subject from the list.</p>
      <Link className="cta primary" to="/">
        Back to guide
      </Link>
    </div>
  )
}

export default App
