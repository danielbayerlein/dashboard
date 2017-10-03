import Head from 'next/head'
import styled, { injectGlobal, ThemeProvider } from 'styled-components'
import { normalize } from 'polished'

injectGlobal`
  ${normalize()}

  html {
    font-family: 'Roboto', sans-serif;
  }
`

const Container = styled.main`
  align-items: center;
  background-color: ${props => props.theme.palette.backgroundColor};
  color: ${props => props.theme.palette.textColor};
  display: flex;
  flex-flow: row wrap;
  justify-content: center;
  min-height: 100vh;
  padding: 1em;
`

export default ({ children, theme }) => (
  <ThemeProvider theme={theme}>
    <Container>
      <Head>
        <link
          href='https://fonts.googleapis.com/css?family=Roboto:300,400,500'
          rel='stylesheet'
        />
      </Head>

      {children}
    </Container>
  </ThemeProvider>
)
