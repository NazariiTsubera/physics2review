import { useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { BlockMath } from 'react-katex'
import { getTopic, topicOrder } from '../data/topics'
import TextWithMath from '../components/TextWithMath'
import NotFound from './NotFound'

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
              <li key={idx}>
                <TextWithMath text={p} />
              </li>
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
              <TextWithMath text={idea} />
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
          <div className="walkthrough-question">
            <TextWithMath text={topic.walkthrough.prompt} />
          </div>
          <ol className="walkthrough-steps">
            {topic.walkthrough.steps.map((step, idx) => (
              <li key={idx}>
                <TextWithMath text={step} />
              </li>
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
            <li key={idx}>
              <TextWithMath text={habit} />
            </li>
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
      <div className="flashcard-inner">
        <div className="flashcard-face front">
          <TextWithMath text={front} />
        </div>
        <div className="flashcard-face back">
          <TextWithMath text={back} />
        </div>
      </div>
    </button>
  )
}

function QuizCard({ quiz }) {
  const [choice, setChoice] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const isCorrect = submitted && choice === quiz.answer

  return (
    <div className="quiz-card">
      <p className="quiz-question">
        <TextWithMath text={quiz.question} />
      </p>
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
            <span>
              <TextWithMath text={opt} />
            </span>
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
            <TextWithMath text={quiz.rationale} />
          </span>
        )}
      </div>
    </div>
  )
}

export default TopicPage
