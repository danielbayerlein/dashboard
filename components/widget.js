import styled from 'styled-components'
import { size } from 'polished'
import LoadingIndicator from './loading-indicator'
import ErrorIcon from './error-icon'

const Container = styled.div`
  ${size('20em')}
  align-items: center;
  background-color: ${props => props.theme.palette.canvasColor};
  border: 1px solid ${props => props.theme.palette.borderColor};
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin: 1em;
  padding: 1em;
`

const Title = styled.h1`
  text-align: center;
`

export default ({ children, error = false, loading = false, title = '' }) => {
  let content

  if (loading) {
    content = <LoadingIndicator />
  } else if (error) {
    content = <ErrorIcon />
  } else {
    content = <div>{children}</div>
  }

  return (
    <Container>
      {title ? <Title>{title}</Title> : ''}
      {content}
    </Container>
  )
}
