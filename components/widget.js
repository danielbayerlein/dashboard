import { Card, CardTitle, CardText } from 'material-ui/Card'
import styled from 'styled-components'

const Container = styled(Card)`
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
