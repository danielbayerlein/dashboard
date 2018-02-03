import preval from 'preval.macro'

const pages = preval`
  const globby = require('globby')
  module.exports = globby.sync(['**/*.js', '!index.js', '!_document.js'], { cwd: __dirname })
`

export default () => (
  <ul>
    {pages.map(page => (
      <li>
        <a href={`/${page}`}>
          {page}
        </a>
      </li>
    ))}
  </ul>
)
