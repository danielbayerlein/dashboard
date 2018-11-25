import { Component } from 'react'
import fetch from 'isomorphic-unfetch'
import styled from 'styled-components'
import { object, string, array, number } from 'yup'
import Widget from '../../widget'
import Table, { Th, Td } from '../../table'
import Badge from '../../badge'
import LoadingIndicator from '../../loading-indicator'
import { basicAuthHeader } from '../../../lib/auth'

const jenkinsBadgeColor = ({ theme, status }) => {
  switch (status) {
    case 'FAILURE':
      return theme.palette.errorColor
    case 'UNSTABLE':
      return theme.palette.warnColor
    case 'SUCCESS':
      return theme.palette.successColor
    case 'ABORTED':
    case 'NOT_BUILT':
      return theme.palette.disabledColor
    default: // null = 'In Progress'
      return 'transparent'
  }
}
const JenkinsBadge = styled(Badge)`
  background-color: ${jenkinsBadgeColor};
`

const schema = object().shape({
  url: string().url().required(),
  jobs: array(object({
    label: string().required(),
    path: string().required(),
    branch: string()
  })).required(),
  interval: number(),
  title: string(),
  authKey: string()
})

export default class JenkinsJobStatus extends Component {
  static defaultProps = {
    interval: 1000 * 60 * 5,
    title: 'Job Status'
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
          const branch = job.branch ? `job/${job.branch}/` : ''
          const res = await fetch(`${url}/job/${job.path}/${branch}lastBuild/api/json`, opts)
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
