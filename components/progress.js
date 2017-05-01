import ProgressArc from 'progress-arc-component'
import styled from 'styled-components'
import { size } from 'polished'

const Progress = styled(ProgressArc)`
  margin: auto;
  ${size('14em')}

  circle {
    stroke-width: 10;
    &.arc {
      stroke: ${props => props.theme.palette.primaryColor};
    }
    &.arc-background {
      stroke: ${props => props.theme.palette.borderColor};
    }
  }

  text {
    fill: ${props => props.theme.palette.textColor};
    font-size: 4em;
    font-weight: normal;
    baseline-shift: -5;
  }
`

export default ({ value, unit = '' }) => (
  <Progress value={value}
    unit={unit}
    rounded
  />
)
