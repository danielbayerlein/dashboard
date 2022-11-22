import styled from 'styled-components'
import { size } from 'polished'

const Svg = ({ children }) => (
  <svg className="w-14 h-14 fill-transparent mx-auto">
    {children}
  </svg>
)

const Circle = ({ className, ...props }) => (
  <circle
    className={`stroke-linecap-round stroke-width-10 transform-translate-100-100 rotate-90 ${className}`}
    {...props}
  />
)

const Text = ({ children }) => (
  <text className="text-gray-800 text-4xl text-center">
    {children}
  </text>
)

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
