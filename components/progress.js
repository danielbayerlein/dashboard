import { Component } from 'react'
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

export default class CircleProgress extends Component {
  static defaultProps = {
    radius: 90,
    max: 100,
    unit: ''
  }

  render () {
    const { radius, max, unit, value } = this.props

    const strokeDasharray = 2 * radius * Math.PI
    const strokeDashoffset = ((max - value) / max) * strokeDasharray

    return (
      <Progress viewBox='0 0 200 200'>
        <circle r={radius} className='background' />
        <circle
          r={radius}
          className='progress'
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
        />
        <text x='100' y='120'>{value}{unit}</text>
      </Progress>
    )
  }
}
