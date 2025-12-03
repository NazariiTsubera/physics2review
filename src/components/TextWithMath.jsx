import { InlineMath } from 'react-katex'

function TextWithMath({ text }) {
  if (!text) return null
  const parts = text.split(/(\$[^$]+?\$)/g).filter((part) => part !== '')

  return parts.flatMap((part, idx) => {
    const isExplicitMath = part.startsWith('$') && part.endsWith('$')
    if (isExplicitMath) {
      const math = part.slice(1, -1)
      return <InlineMath key={`m-${idx}`} math={math} errorColor="#ffae7d" />
    }

    const tokens = part.split(/(\s+)/)
    return tokens.map((piece, pieceIdx) => {
      if (piece === '') return null

      const looksLikeLatex =
        !/\s/.test(piece) &&
        (/^\\[A-Za-z]+/.test(piece) || /[_^]/.test(piece) || /^[A-Za-z0-9_.]+\s*=\s*[A-Za-z0-9_.+-/]+$/.test(piece))

      if (looksLikeLatex) {
        return <InlineMath key={`a-${idx}-${pieceIdx}`} math={piece} errorColor="#ffae7d" />
      }

      return (
        <span key={`t-${idx}-${pieceIdx}`}>
          {piece}
        </span>
      )
    })
  })
}

export default TextWithMath
