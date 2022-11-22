import Head from 'next/head'
import styled, { createGlobalStyle, ThemeProvider } from 'styled-components'
import { normalize } from 'polished'



const Container = ({ children }) => (
  <main className="flex items-center justify-center flex-flow-row wrap min-h-screen bg-gray-100 text-gray-900">
    {children}
  </main>
)

export default ({ children, theme, title = 'Dashboard' }) => (
  <ThemeProvider theme={theme}>
    <Container>
      <Head>
        <title>{title}</title>
        <link rel='icon' href='/static/favicon.png' />
        <link
          href='https://fonts.googleapis.com/css?family=Roboto:300,400,500'
          rel='stylesheet'
        />
      </Head>

      {children}

      <GlobalStyle />
    </Container>
  </ThemeProvider>
)
