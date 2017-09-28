import { Component } from 'react'
import fetch from 'isomorphic-unfetch'
import yup from 'yup'
import Widget from '../../widget'
import Table, { Th, Td } from '../../table'
import { basicAuthHeader } from '../../../lib/auth'
import styled from 'styled-components'

const schema = yup.object().shape({
  url: yup.string().url().required(),
  interval: yup.number(),
  baseQuery: yup.string().required(),
  appsQuery: yup.string().required(),
  healthQuery: yup.string().required(),
  title: yup.string(),
  minimumInstances: yup.number(),
  appNamePattern: yup.string(),
  authKey: yup.string()
})

const EurekaDiv = styled.div`
  background-color: ${props => props.hasError ? props.theme.palette.errorColor : props.theme.palette.canvasColor};
`

export default class EurekaHealthStatus extends Component {
  static defaultProps = {
    interval: 1000 * 60 * 60,
    title: 'Eureka Health Status',
    minimumInstances: 2,
    appNamePattern: ''
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

  mapHealthStatus (status) {
    let hasError = true
    if (status === 'UP') {
      hasError = false
    }
    return hasError
  }

  checkInstanceCount (minimumInstances, appNamePattern, appList) {
    let hasError = false
    appList.forEach(function (entry) {
      if (entry.name.startsWith(appNamePattern) && entry.instance.length < minimumInstances) {
        hasError = true
      }
    })
    return hasError
  }

  async checkInstanceHealth (url, appNamePattern, appList) {
    let hasError = false
    for (var i = 0; i < appList.length; i++) {
      const app = appList[i]
      if (app.name.startsWith(appNamePattern)) {
        for (var j = 0; j < app.instance.length; j++) {
          try {
            const curInstance = app.instance[j]
            let opts = {headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' }}
            const resHealth = await fetch(url + curInstance.healthCheckUrl, opts)
            const healthJson = await resHealth.json()
            hasError = this.mapHealthStatus(healthJson.status)
          } catch (error) {
            hasError = true
          }
        }
      }
    }
    return hasError
  }

  async fetchInformation () {
    const { authKey, url, baseQuery, healthQuery, appsQuery, appNamePattern, minimumInstances } = this.props
    let opts = authKey ? { headers: basicAuthHeader(authKey) } : {}

    try {
      const res = await fetch(`${url}${baseQuery}${healthQuery}`, opts)
      const json = await res.json()

      let hasError = this.mapHealthStatus(json.status)
      let statusLine1 = ''
      let statusLine2 = ''

      if (hasError === false) {
        opts = {headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' }}
        try {
          const resApps = await fetch(`${url}${baseQuery}${appsQuery}`, opts)
          const jsonApps = await resApps.json()

          if (jsonApps.applications.apps__hashcode.includes('DOWN') === true) {
            hasError = true
          } else {
            hasError = false
          }

          const appsStatus = jsonApps.applications.apps__hashcode.split('_')
          if (appsStatus.length > 0 && appsStatus.length < 4) {
            statusLine1 = `${appsStatus[0]}: ${appsStatus[1]}`
          } else {
            statusLine1 = `${appsStatus[0]}: ${appsStatus[1]}`
            statusLine1 += ` - ${appsStatus[2]}: ${appsStatus[3]}`
          }

          if (hasError === false) {
            hasError = await this.checkInstanceCount(minimumInstances, appNamePattern, jsonApps.applications.application)
            if (hasError === true) {
              statusLine2 = 'Instance redundancy failed'
            }
          }

          if (hasError === false) {
            hasError = await this.checkInstanceHealth(url, appNamePattern, jsonApps.applications.application)
            if (hasError === true) {
              statusLine2 = 'App health check failed'
            }
          }
        } catch (error) {
          hasError = true
        }
      } else {
        statusLine2 = 'Eureka health failed'
      }
      this.setState({ statusLine1: statusLine1, statusLine2: statusLine2, hasError: hasError, error: false, loading: false })
    } catch (error) {
      this.setState({ error: true, loading: false })
    } finally {
      this.interval = setInterval(() => this.fetchInformation(), this.props.interval)
    }
  }

  render () {
    const { error, loading, statusLine1, statusLine2, hasError } = this.state
    const { title } = this.props
    return (
      <Widget title={title} loading={loading} error={error}>
        <EurekaDiv hasError={hasError}>
          <Table>
            <tbody>
              <tr>
                <Th>Apps</Th>
                <Td>{statusLine1}</Td>
              </tr>
              <tr>
                <Th>Info</Th>
                <Td>{statusLine2}</Td>
              </tr>
            </tbody>
          </Table>
        </EurekaDiv>
      </Widget>
    )
  }
}
