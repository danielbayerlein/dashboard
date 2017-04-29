import styled from 'styled-components'

const Title = styled.h1`
  color: red;
`

export default ({ title }) => (
  <header>
    <Title>{title}</Title>
  </header>
)
