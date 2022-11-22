import styled, { keyframes } from 'styled-components'

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

const Svg = ({ children, size }) => (
  <svg
    className="animation-rotation duration-1400 linear infinite"
    height={size}
    width={size}
  >
    {children}
  </svg>
)

const Circle = ({ children }) => (
  <circle
    className="animation-turn duration-1400 ease-in-out infinite fill-none stroke-primary stroke-dasharray-187 stroke-dashoffset-0 stroke-linecap-round stroke-width-6 transform-origin-center"
  >
    {children}
  </circle>
)

export default ({ size = 'medium' }) => {
  const svgSize = size === 'small' ? '1.75em' : '5em'

  return (
    <Svg viewBox='0 0 66 66' size={svgSize}>
      <Circle cx='33' cy='33' r='30' />
    </Svg>
  )
}
