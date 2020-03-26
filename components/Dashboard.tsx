import Head from "next/head";
import styled, { createGlobalStyle, ThemeProvider } from "styled-components";
import { normalize } from "polished";
import React, { Component } from "react";

const GlobalStyle = createGlobalStyle`
  ${normalize()}

  html {
    font-family: 'Roboto', sans-serif;
  }
`;

const Container = styled.main`
  align-content: center;
  align-items: center;
  background-color: ${(props) => props.theme.palette.backgroundColor};
  color: ${(props) => props.theme.palette.textColor};
  display: flex;
  flex-flow: row wrap;
  justify-content: center;
  min-height: 100vh;
`;

export default class Dashboard extends Component<
  { theme: any; title: string },
  {}
> {
  render() {
    const { theme, title, children } = this.props;
    return (
      <ThemeProvider theme={theme}>
        <Container>
          <Head>
            <title>{title}</title>
            <link rel="icon" href="/static/favicon.png" />
            <link
              href="https://fonts.googleapis.com/css?family=Roboto:300,400,500"
              rel="stylesheet"
            />
          </Head>
          {children}
          <GlobalStyle />
        </Container>
      </ThemeProvider>
    );
  }
}
