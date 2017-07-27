import styled from 'styled-components'
import { size } from 'polished'

const Svg = styled.svg`
  ${size('14em')}
  fill: transparent;
  margin: auto;
`

const Circle = styled.circle`
  stroke-linecap: round;
  stroke-width: 10;
  transform: translate(100px, 100px) rotate(-89.9deg);
  transition: stroke-dashoffset 0.3s linear;

  &.background {
    stroke: ${props => props.theme.palette.borderColor};
  }

  &.progress {
    stroke: ${props => props.theme.palette.primaryColor};
  }
`

const Text = styled.text`
  fill: ${props => props.theme.palette.textColor};
  font-size: 4em;
  text-anchor: middle;
`

export default ({ max = 100, radius = 90, unit = '', value }) => {
  const strokeDasharray = 2 * radius * Math.PI
  const strokeDashoffset = ((max - value) / max) * strokeDasharray

  return (
    <Svg viewBox='0 0 200 200'>
      <Circle r={radius} className='background' />
      <Circle
        r={radius}
        className='progress'
        strokeDasharray={strokeDasharray}
        strokeDashoffset={strokeDashoffset}
      />
      <Text x='100' y='120'>{value}{unit}</Text>
    </Svg>
  )
}
