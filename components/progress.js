import ProgressArc from 'progress-arc-component'
import styled from 'styled-components'
import { cyan500, darkBlack, grey300 } from 'material-ui/styles/colors'

const Progress = styled(ProgressArc)`
  height: 15em;
  margin: auto;
  width: 15em;
  circle {
    stroke-width: 15;
  }
`

export default ({ value, unit = '' }) => (
  <Progress value={value}
    unit={unit}
    arcColor={cyan500}
    arcBackgroundColor={grey300}
    textColor={darkBlack}
    rounded
  />
)
