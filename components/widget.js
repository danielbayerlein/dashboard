import { Card, CardTitle, CardText } from 'material-ui/Card'
import styled from 'styled-components'

const Container = styled(Card)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 20em;
  width: 20em;
`
const Title = styled(CardTitle)`
  text-align: center;
`

export default ({ title = '', children }) => (
  <Container>
    { title ? <Title title={title} /> : '' }
    <CardText>{children}</CardText>
  </Container>
)
