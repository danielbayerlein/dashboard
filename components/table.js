import styled from 'styled-components'

export default styled.table`
  border-spacing: 0.75em;
`

export const Th = ({ children }) => (
  <th className="text-right">
    {children}
  </th>
)

export const Td = ({ children }) => (
  <td className="text-left">
    {children}
  </td>
)
