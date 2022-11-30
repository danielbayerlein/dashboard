import styled from 'styled-components'
import { size } from 'polished'
import LoadingIndicator from './loading-indicator'
import ErrorIcon from './error-icon'

const Container = ({ children }) => (
  <div className="w-20em h-20em flex items-center justify-center bg-gray-100 border-1 border-gray-300 p-3 m-3">
    {children}
  </div>
)

const Title = ({ children }) => (
  <h1 className="text-center">
    {children}
  </h1>
)

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
