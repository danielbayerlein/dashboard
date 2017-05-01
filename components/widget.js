import styled from 'styled-components'
import { size } from 'polished'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  ${size('20em')}

  background-color: ${props => props.theme.palette.canvasColor};
  border: 1px solid ${props => props.theme.palette.borderColor};
`

export default ({ title = '', children }) => (
  <Container>
    { title ? <h1>{title}</h1> : '' }
    <div>{children}</div>
  </Container>
)
