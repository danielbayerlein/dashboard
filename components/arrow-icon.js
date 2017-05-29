import styled from 'styled-components'
import { size } from 'polished'

const Svg = styled.svg`
  ${size('1.2em')};
  fill: ${props => props.theme.palette.textColor};
`

export default () => (
  <Svg viewBox='0 -5 24 24'>
    <path d='M10 6l-1.41 1.41 4.58 4.59-4.58 4.59 1.41 1.41 6-6z' />
  </Svg>
)
