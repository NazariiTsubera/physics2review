import { Link } from 'react-router-dom'
import { topics } from '../data/topics'
import TextWithMath from '../components/TextWithMath'

function Home() {
  return (
    <div className="hero">
      <section className="intro-card">
        <p className="eyebrow">Final exam prep • calculus-based University Physics II</p>
        <h1>Comprehensive review of Physics II by Nazarii Tsubera.</h1>
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
            <TextWithMath text={idea} />
          </span>
        ))}
      </div>
      <span className="more">Open page →</span>
    </Link>
  )
}

export default Home
