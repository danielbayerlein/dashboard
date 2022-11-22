import styled from 'styled-components'

const Counter = ({ children }) => (
  <div className="text-4xl text-blue-500">
    {children}
  </div>
)

export default ({ value }) => (
  <Counter>{value}</Counter>
)
