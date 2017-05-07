import styled, { keyframes } from 'styled-components'
import { size } from 'polished'

const rotation = keyframes`
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(270deg);
  }
`

const turn = keyframes`
  0% {
    stroke-dashoffset: 187;
  }

  50% {
    stroke-dashoffset: 46.75;
    transform: rotate(135deg);
  }

  100% {
    stroke-dashoffset: 187;
    transform: rotate(450deg);
  }
`

const Svg = styled.svg`
  ${size('5em')}
  animation: ${rotation} 1.4s linear infinite;
`

const Circle = styled.circle`
  animation: ${turn} 1.4s ease-in-out infinite;
  fill: none;
  stroke: ${props => props.theme.palette.primaryColor};
  stroke-dasharray: 187;
  stroke-dashoffset: 0;
  stroke-linecap: round;
  stroke-width: 6;
  transform-origin: center;
`

export default () => (
  <Svg viewBox='0 0 66 66'>
    <Circle cx='33' cy='33' r='30' />
  </Svg>
)
