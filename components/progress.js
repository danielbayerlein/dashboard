import styled from 'styled-components'
import { size } from 'polished'

const Progress = styled.svg`
  fill: transparent;
  margin: auto;
  ${size('14em')}

  circle {
    stroke-width: 10;
    stroke-linecap: round;
    transform: translate(100px, 100px) rotate(-89.9deg);
    transition: stroke-dashoffset 0.3s linear;
    &.progress {
      stroke: ${props => props.theme.palette.primaryColor};
    }
    &.background {
      stroke: ${props => props.theme.palette.borderColor};
    }
  }

  text {
    fill: ${props => props.theme.palette.textColor};
    font-size: 4em;
    text-anchor: middle;
  }
`

const p = 2 * 90 * Math.PI
const max = 100

export default ({ value, unit = '' }) => (
  <Progress viewBox='0 0 200 200'>
    <circle r='90' className='background' />
    <circle r='90' className='progress' strokeDasharray={p} strokeDashoffset={((max - value) / max) * p} />
    <text x='100' y='120'>{value}{unit}</text>
  </Progress>
)
