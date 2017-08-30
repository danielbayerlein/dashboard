import { Component } from 'react'
import fetch from 'isomorphic-unfetch'
import styled from 'styled-components'
import yup from 'yup'
import Widget from '../../widget'
import Table, { Th, Td } from '../../table'
import Badge from '../../badge'
import LoadingIndicator from '../../loading-indicator'
import { basicAuthHeader } from '../../../lib/auth'

const JenkinsBadge = styled(Badge)`
  background-color: ${props => {
    switch (props.status) {
      case 'FAILURE':
        return props.theme.palette.errorColor
      case 'UNSTABLE':
        return props.theme.palette.warnColor
      case 'SUCCESS':
        return props.theme.palette.successColor
      case 'ABORTED':
      case 'NOT_BUILT':
        return props.theme.palette.disabledColor
      default: // null = 'In Progress'
        return 'transparent'
    }
  }};
`

const schema = yup.object().shape({
  url: yup.string().url().required(),
  jobs: yup.array(yup.object({
    label: yup.string().required(),
    path: yup.string().required()
  })).required(),
  interval: yup.number(),
  title: yup.string(),
  authKey: yup.string()
})

export default class Jenkins extends Component {
  static defaultProps = {
    interval: 1000 * 60 * 5,
    title: 'Jenkins'
  }

  state = {
    loading: true,
    error: false
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

  async fetchInformation () {
    const { authKey, jobs, url } = this.props
    const opts = authKey ? { headers: basicAuthHeader(authKey) } : {}

    try {
      const builds = await Promise.all(
        jobs.map(async job => {
          const res = await fetch(`${url}/job/${job.path}/lastBuild/api/json`, opts)
          const json = await res.json()

          return {
            name: job.label,
            url: json.url,
            result: json.result
          }
        })
      )

      this.setState({ error: false, loading: false, builds })
    } catch (error) {
      this.setState({ error: true, loading: false })
    } finally {
      this.timeout = setTimeout(() => this.fetchInformation(), this.props.interval)
    }
  }

  render () {
    const { loading, error, builds } = this.state
    const { title } = this.props

    return (
      <Widget title={title} error={error} loading={loading}>
        <Table>
          <tbody>
            {builds && builds.map(build => (
              <tr key={`jenkins-${build.name}`}>
                <Th>{build.name}</Th>
                <Td>
                  <a href={build.url} title={build.result}>
                    {
                      build.result
                      ? <JenkinsBadge status={build.result} />
                      : <LoadingIndicator size='small' />
                    }
                  </a>
                </Td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Widget>
    )
  }
}
