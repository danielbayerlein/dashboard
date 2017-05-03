import styled from 'styled-components'
import { size } from 'polished'
import LoadingIndicator from './loadingIndicator'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  ${size('20em')}

  background-color: ${props => props.theme.palette.canvasColor};
  border: 1px solid ${props => props.theme.palette.borderColor};
`

const Title = ({ children }) => {
  if (children) {
    return <h1>{children}</h1>
  }

  return null
}

export const ErrorMessage = styled.h4`
  color: #F44336
`

export default ({ title, children, loading = false, error = null }) => {
  if (loading) {
    return (
      <Container>
        <Title>{title}</Title>
        <LoadingIndicator />
      </Container>
    )
  }

  if (error) {
    return (
      <Container>
        <Title>{title}</Title>
        <ErrorMessage>{error}</ErrorMessage>
      </Container>
    )
  }

  return (
    <Container>
      <Title>{title}</Title>
      <div>{children}</div>
    </Container>
  )
}
