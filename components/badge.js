import styled from 'styled-components'
import { size } from 'polished'

export default styled.span`
  ${size('1.75em')}
  background-color: transparent;
  border-radius: 50%;
  color: ${props => props.theme.palette.textInvertColor};
  display: inline-block;
  line-height: 1.75em;
  text-align: center;
`

export const Status = styled.span`
  background-color: ${props => {
    switch (props.status) {
      case 'OPEN':
        return props.theme.palette.neutralColor
      case 'DECLINED':
        return props.theme.palette.warnColor
      case 'MERGED':
        return props.theme.palette.successColor
      default:
        return 'transparent'
    }
  }};
  border-radius: 3px;
  display: inline-block;
  font-size: 0.7em;
  margin-left: 5px;
  margin-top: -2px;
  padding: 5px 6px 3px 6px;
  position: absolute;
`
