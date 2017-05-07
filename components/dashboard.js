import Head from 'next/head'
import styled, { injectGlobal, ThemeProvider } from 'styled-components'
import { normalize, padding } from 'polished'

const Container = styled.main`
  ${padding('4.25em', null, '4.25em', null)}
  align-content: center;
  align-items: center;
  background-color: ${props => props.theme.palette.backgroundColor};
  color: ${props => props.theme.palette.textColor};
  display: grid;
  grid-gap: 2em;
  grid-template-columns: repeat(3, 1fr);
  height: 100vh;
  justify-content: center;
  justify-items: center;
`

injectGlobal`
  ${normalize()}

  html {
    font-family: 'Roboto', sans-serif;
  }
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
