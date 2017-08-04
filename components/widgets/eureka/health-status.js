import { Component } from 'react'
import fetch from 'isomorphic-unfetch'
import yup from 'yup'
import Widget from '../../widget'
import { basicAuthHeader } from '../../../lib/auth'
import styled from 'styled-components'

const schema = yup.object().shape({
  url: yup.string().url().required(),
  interval: yup.number(),
  appsQuery: yup.string(),
  healthQuery: yup.string(),
  title: yup.string(),
  authKey: yup.string()
})

const EurekaDiv = styled.div`
  background-color: ${props => props.hasError ? props.theme.palette.errorColor : props.theme.palette.canvasColor}
`;

export default class EurekaHealthStatus extends Component {
  static defaultProps = {
    interval: 1000 * 60 * 60,
    title: 'Eureka Health Status'
  }

  state = {
    days: 0,
    error: false,
    loading: true
  }

  componentDidMount () {
    schema.validate(this.props)
      .then(() => this.fetchInformation())
      .catch((err) => {
        console.error(`${err.name} @ ${this.constructor.name}`, err.errors)
        this.setState({ error: true, loading: false })
      })
  }

  componentWillUnmount () {
    clearInterval(this.interval)
  }

  mapStatus (status) {
    let hasError = true

    if ( status === 'UP' ) {
      hasError = false;
    }

    return hasError
  }

  async fetchInformation () {
    const { authKey, url, healthQuery, appsQuery } = this.props
    let opts = authKey ? { headers: basicAuthHeader(authKey) } : {}

    try {
      const res = await fetch(`${url}${healthQuery}`, opts)
      const json = await res.json()

      let hasError = this.mapStatus(json.status)
      let statusLine1 = ''
      let statusLine2 = ''

      if (hasError === false) {
        opts = { headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' }}
        try {
          const resApps = await fetch(`${url}${appsQuery}`, opts)
          const jsonApps = await resApps.json()

          if (jsonApps.applications.apps__hashcode.includes('DOWN') === true) {
            hasError = true
          } else {
            hasError = false
          }

          const appsStatus = jsonApps.applications.apps__hashcode.split('_')
          if ( appsStatus.length > 0 &&  appsStatus.length < 4 ) {
            statusLine1 = `${appsStatus[0]}: ${appsStatus[1]}`
            statusLine2 = ''
          } else {
            statusLine1 = `${appsStatus[0]}: ${appsStatus[1]}`
            statusLine2 = `${appsStatus[2]}: ${appsStatus[3]}`
          }
        } catch (error) {
          hasError = true
        }
      }

      this.setState({ statusLine1: statusLine1, statusLine2: statusLine2, hasError: hasError, error: false, loading: false })
    } catch (error) {
      this.setState({ error: true, loading: false })
    } finally {
      this.interval = setInterval(() => this.fetchInformation(), this.props.interval)
    }
  }

  render () {
    const { days, error, loading, statusLine1, statusLine2, hasError } = this.state
    const { title } = this.props
    return (
      <Widget title={title} loading={loading} error={error}>
        <EurekaDiv hasError={hasError}>
          {statusLine1}
          {statusLine2}
        </EurekaDiv>
      </Widget>
    )
  }
}
