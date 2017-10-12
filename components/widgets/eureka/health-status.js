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
  eurekaQuery: yup.string().required(),
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
    error: false,
    loading: true,
    appStatus: '',
    infoMessage: ''
  }

  constructor (props, context) {
    super(props, context)
    this.checkInstanceCount = this.checkInstanceCount.bind(this)
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
    clearTimeout(this.timeout)
  }

  checkInstanceCount (appList) {
    const { appNamePattern, minimumInstances } = this.props
    let hasError = false
    appList.forEach(function (entry) {
      if ((appNamePattern.length === 0 || entry.name.startsWith(appNamePattern)) && entry.instance.length < minimumInstances) {
        hasError = true
      }
    })
    return hasError
  }

  async checkInstanceHealth (url, appNamePattern, appList) {
    let hasError = false
    for (var i = 0; i < appList.length; i++) {
      const app = appList[i]
      if (appNamePattern.length === 0 || app.name.startsWith(appNamePattern)) {
        for (var j = 0; j < app.instance.length; j++) {
          try {
            const curInstance = app.instance[j]
            let opts = {headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' }}
            const resHealth = await fetch(url + curInstance.healthCheckUrl, opts)
            const healthJson = await resHealth.json()
            hasError = healthJson.status !== 'UP'
          } catch (error) {
            hasError = true
          }
        }
      }
    }
    return hasError
  }

  async fetchInformation () {
    const { authKey, url, eurekaQuery, healthQuery, appsQuery, appNamePattern } = this.props
    let opts = authKey ? { headers: basicAuthHeader(authKey) } : {}

    try {
      const res = await fetch(`${url}${eurekaQuery}${healthQuery}`, opts)
      const json = await res.json()

      let appStatus = ''
      let infoMessage = ''
      let hasError = json.status !== 'UP'

      if (!hasError) {
        opts = {headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' }}

        try {
          const resApps = await fetch(`${url}${eurekaQuery}${appsQuery}`, opts)
          const jsonApps = await resApps.json()

          hasError = jsonApps.applications.apps__hashcode.includes('DOWN')

          const appsStatus = jsonApps.applications.apps__hashcode.split('_')
          if (appsStatus.length > 0 && appsStatus.length < 4) {
            appStatus = `${appsStatus[0]}: ${appsStatus[1]}`
          } else {
            appStatus = `${appsStatus[0]}: ${appsStatus[1]}`
            appStatus += ` - ${appsStatus[2]}: ${appsStatus[3]}`
          }

          if (!hasError) {
            hasError = this.checkInstanceCount(jsonApps.applications.application)
            if (hasError) {
              infoMessage = 'Instance redundancy failed'
            }
          }

          if (!hasError) {
            hasError = await this.checkInstanceHealth(url, appNamePattern, jsonApps.applications.application)
            if (hasError) {
              infoMessage = 'App health check failed'
            }
          }
        } catch (error) {
          hasError = true
        }
      } else {
        infoMessage = 'Eureka health failed'
      }
      this.setState({ appStatus, infoMessage, hasError, error: false, loading: false })
    } catch (error) {
      this.setState({ error: true, loading: false })
    } finally {
      this.timeout = setTimeout(() => this.fetchInformation(), this.props.interval)
    }
  }

  render () {
    const { error, loading, appStatus, infoMessage, hasError } = this.state
    const { title } = this.props

    return (
      <Widget title={title} loading={loading} error={error}>
        <EurekaDiv hasError={hasError}>
          <Table>
            <tbody>
              <tr>
                <Th>Apps</Th>
                <Td>{appStatus}</Td>
              </tr>
              <tr>
                <Th>Info</Th>
                <Td>{infoMessage}</Td>
              </tr>
            </tbody>
          </Table>
        </EurekaDiv>
      </Widget>
    )
  }
}
