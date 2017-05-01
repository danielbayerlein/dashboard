import { Component } from 'react'

import DateTime from '../components/widgets/datetime'
import PageSpeedScore from '../components/widgets/psi'

import injectTapEventPlugin from 'react-tap-event-plugin'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import getMuiTheme from 'material-ui/styles/getMuiTheme'
import Head from 'next/head'
import styled from 'styled-components'

const Container = styled.div`
  font-family: 'Roboto', sans-serif;

  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-gap: 3em;
  justify-items: center;
  justify-content: center;
  align-items: center;
  align-content: center;
`

export default class Index extends Component {
  static getInitialProps ({ req }) {
    const userAgent = req ? req.headers['user-agent'] : navigator.userAgent
    return { userAgent }
  }

  componentDidMount () {
    injectTapEventPlugin()
  }

  render () {
    const { userAgent } = this.props
    const muiTheme = getMuiTheme({ userAgent })

    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <Container>
          <Head>
            <link href='https://fonts.googleapis.com/css?family=Roboto:300,400,500' rel='stylesheet' />
          </Head>
          <DateTime />
          <PageSpeedScore url='https://github.com/' />
        </Container>
      </MuiThemeProvider>
    )
  }
}
