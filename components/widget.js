import styled from 'styled-components'
import { size } from 'polished'
import LoadingIndicator from './loading-indicator'
import ErrorIcon from './error-icon'
import { NONE } from '../lib/alert'

const Container = styled.div`
  ${size('20em')}
  align-items: center;
  background-color: ${props => props.theme.palette.canvasColor};
  border: 1px solid ${props => props.theme.atoms.Widget[props.alertSeverity].border};
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin: 1em;
  padding: 1em;
`

const Title = styled.h1`
  text-align: center;
`

export default ({ children, hasError = false, isLoading = false, alertSeverity = NONE, title = '' }) => {
  let content

  if (isLoading) {
    content = <LoadingIndicator />
  } else if (hasError) {
    content = <ErrorIcon />
  } else {
    content = <div>{children}</div>
  }

  return (
    <Container alertSeverity={alertSeverity}>
      {title ? <Title>{title}</Title> : ''}
      {content}
    </Container>
  )
}
