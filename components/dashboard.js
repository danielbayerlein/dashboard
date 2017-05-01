import Head from 'next/head'
import styled, { injectGlobal, ThemeProvider } from 'styled-components'
import { normalize } from 'polished'

const Container = styled.main`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-gap: 3em;
  justify-items: center;
  justify-content: center;
  align-items: center;
  align-content: center;

  background-color: ${props => props.theme.palette.backgroundColor};
  color: ${props => props.theme.palette.textColor};
  height: 100vh;
`

injectGlobal`
  ${normalize()}

  html {
    font-family: 'Roboto', sans-serif;
  }
`

export default ({ theme, children }) => (
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
