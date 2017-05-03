import React from 'react'
import styled from 'styled-components'

const Path = styled.path`
  fill: #00bcd4
`

const LoadingIndicator = () => (
  <svg x='0px' y='0px' width='60px' height='60px' viewBox='0 0 50 50'>
    <Path d='M25.251,6.461c-10.318,0-18.683,8.365-18.683,18.683h4.068c0-8.071,6.543-14.615,14.615-14.615V6.461z'>
      <animateTransform attributeType='xml' attributeName='transform' type='rotate' from='0 25 25' to='360 25 25' dur='0.6s' repeatCount='indefinite' />
    </Path>
  </svg>
)

export default LoadingIndicator
