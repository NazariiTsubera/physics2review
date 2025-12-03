import { Link } from 'react-router-dom'

function NotFound() {
  return (
    <div className="not-found">
      <h1>Page not found</h1>
      <p>Try choosing a subject from the list.</p>
      <Link className="cta primary" to="/">
        Back to guide
      </Link>
    </div>
  )
}

export default NotFound
