import { useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'

function Simulation() {
  const [charges, setCharges] = useState([
    { id: 1, q: 1, x: -2, y: 2 },
    { id: 2, q: -1, x: 2, y: -2 },
  ])
  const [form, setForm] = useState({ q: 1, x: 0, y: 0 })
  const [selectedId, setSelectedId] = useState(null)
  const [dragId, setDragId] = useState(null)
  const gridSize = 11
  const svgRef = useRef(null)
  const gridPoints = useMemo(() => {
    const pts = []
    for (let i = 0; i < gridSize; i++) {
      for (let j = 0; j < gridSize; j++) {
        const x = -5 + (10 / (gridSize - 1)) * i
        const y = -5 + (10 / (gridSize - 1)) * j
        pts.push({ x, y })
      }
    }
    return pts
  }, [gridSize])

  const addCharge = (e) => {
    e.preventDefault()
    const q = parseFloat(form.q)
    const x = parseFloat(form.x)
    const y = parseFloat(form.y)
    if (Number.isNaN(q) || Number.isNaN(x) || Number.isNaN(y)) return
    setCharges((prev) => [...prev, { id: Date.now(), q, x, y }])
    setSelectedId(null)
  }

  const removeCharge = (id) => {
    setCharges((prev) => prev.filter((c) => c.id !== id))
    if (selectedId === id) setSelectedId(null)
  }

  const pointerToCoords = (evt) => {
    const svg = svgRef.current
    if (!svg) return { x: 0, y: 0 }
    const rect = svg.getBoundingClientRect()
    const viewWidth = 12
    const viewHeight = 12
    const x = ((evt.clientX - rect.left) / rect.width) * viewWidth - 6
    const y = ((evt.clientY - rect.top) / rect.height) * viewHeight - 6
    return { x, y }
  }

  const handlePointerMove = (evt) => {
    if (dragId === null) return
    const { x, y } = pointerToCoords(evt)
    setCharges((prev) =>
      prev.map((c) => (c.id === dragId ? { ...c, x: Number(x.toFixed(2)), y: Number(y.toFixed(2)) } : c)),
    )
  }

  const handlePointerUp = () => {
    setDragId(null)
  }

  const computeField = (px, py) => {
    const k = 1
    const epsilon = 0.2
    let ex = 0
    let ey = 0
    charges.forEach((c) => {
      const dx = px - c.x
      const dy = py - c.y
      const r2 = dx * dx + dy * dy + epsilon
      const r = Math.sqrt(r2)
      const factor = (k * c.q) / (r2 * r)
      ex += factor * dx
      ey += factor * dy
    })
    return { ex, ey }
  }

  const renderArrow = (p) => {
    const { ex, ey } = computeField(p.x, p.y)
    const mag = Math.sqrt(ex * ex + ey * ey)
    if (mag === 0) return null
    const scale = 0.22
    const maxLen = 0.12
    const len = Math.min(maxLen, mag * scale)
    const ux = (ex / mag) * len
    const uy = (ey / mag) * len
    const x1 = p.x
    const y1 = p.y
    const x2 = x1 + ux
    const y2 = y1 + uy
    const head = 0.035
    const hx = x2 - ux * (head / len || 0)
    const hy = y2 - uy * (head / len || 0)
    const perp = 0.02
    const px1 = hx + -uy * perp
    const py1 = hy + ux * perp
    const px2 = hx - -uy * perp
    const py2 = hy - ux * perp
    const polarityClass = ex * ux + ey * uy >= 0 ? 'pos-field' : 'neg-field'
    return (
      <g key={`${p.x}-${p.y}`} className={`field-arrow ${polarityClass}`}>
        <line x1={x1} y1={y1} x2={x2} y2={y2} />
        <polyline points={`${px1},${py1} ${x2},${y2} ${px2},${py2}`} />
      </g>
    )
  }

  return (
    <div className="topic-page">
      <div className="breadcrumb">
        <Link to="/">Home</Link>
        <span className="crumb-sep">/</span>
        <span className="crumb-current">Field Simulation</span>
      </div>

      <section className="topic-hero">
        <div>
          <p className="eyebrow">Interact</p>
          <h1>Electric field sandbox</h1>
          <p className="lede">
            Drop positive or negative point charges on a grid and watch the vector field update in real time. Use it
            to build intuition for superposition and direction.
          </p>
          <div className="pill-row">
            <div className="pill">Add or remove charges</div>
            <div className="pill">Vector arrows auto-update</div>
            <div className="pill">Grid spans -5 to +5</div>
          </div>
        </div>
        <div className="side-panel">
          <p className="tip-title">How to read arrows</p>
          <ul className="pitfalls">
            <li>Arrow points in the direction a + test charge would move.</li>
            <li>Length is scaled to show relative strength; near charges, arrows cap at a max length.</li>
            <li>Superposition: contributions from all charges are summed at each grid point.</li>
          </ul>
        </div>
      </section>

      <section className="panel sim-layout">
        <div className="field-card">
          <div className="section-head">
            <h2>Field view</h2>
            <p className="section-sub">Grid units from -5 to +5 in x and y. Charges shown as circles.</p>
          </div>
          <div className="field-wrapper">
            <svg
              ref={svgRef}
              className={`field-canvas ${dragId !== null ? 'dragging' : ''}`}
              viewBox="-6 -6 12 12"
              role="img"
              aria-label="Electric field visualization"
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerLeave={handlePointerUp}
            >
              <rect x="-6" y="-6" width="12" height="12" className="field-bg" />
              {Array.from({ length: 11 }, (_, i) => {
                const coord = -5 + i
                const isAxis = coord === 0
                return (
                  <g key={`grid-${coord}`}>
                    <line
                      x1={coord}
                      y1={-5}
                      x2={coord}
                      y2={5}
                      className={isAxis ? 'grid axis' : 'grid'}
                    />
                    <line
                      x1={-5}
                      y1={coord}
                      x2={5}
                      y2={coord}
                      className={isAxis ? 'grid axis' : 'grid'}
                    />
                  </g>
                )
              })}
              {gridPoints.map((p) => renderArrow(p))}
              {charges.map((c) => (
                <g
                  key={c.id}
                  className="charge-dot"
                  transform={`translate(${c.x}, ${c.y})`}
                  onPointerDown={(evt) => {
                    evt.stopPropagation()
                    setDragId(c.id)
                  }}
                >
                  <circle r={0.28} className={c.q >= 0 ? 'charge pos' : 'charge neg'} />
                  <text y={0.08} textAnchor="middle" className="charge-label">
                    {c.q >= 0 ? '+' : '-'}
                  </text>
                </g>
              ))}
            </svg>
          </div>
        </div>

        <div className="control-card">
          <div className="section-head">
            <h2>Charges</h2>
            <p className="section-sub">Add, inspect, and remove point charges.</p>
          </div>
          <form className="charge-form" onSubmit={addCharge}>
            <label>
              Charge (q)
              <input
                type="number"
                step="0.5"
                value={form.q}
                onChange={(e) => setForm((f) => ({ ...f, q: e.target.value }))}
              />
            </label>
            <label>
              X position
              <input
                type="number"
                step="0.5"
                value={form.x}
                onChange={(e) => setForm((f) => ({ ...f, x: e.target.value }))}
              />
            </label>
            <label>
              Y position
              <input
                type="number"
                step="0.5"
                value={form.y}
                onChange={(e) => setForm((f) => ({ ...f, y: e.target.value }))}
              />
            </label>
            <button className="cta primary" type="submit">
              Add charge
            </button>
          </form>
          <div className="charge-list">
            {charges.map((c) => (
              <div key={c.id} className="charge-row">
                <div className={`charge-pill ${c.q >= 0 ? 'pos' : 'neg'}`}>
                  q = {c.q} at ({c.x}, {c.y})
                </div>
                <button className="icon-btn" type="button" onClick={() => removeCharge(c.id)}>
                  Remove
                </button>
              </div>
            ))}
            {charges.length === 0 && <p className="section-sub">No charges yet. Add one to see the field.</p>}
          </div>
        </div>
      </section>
    </div>
  )
}

export default Simulation
