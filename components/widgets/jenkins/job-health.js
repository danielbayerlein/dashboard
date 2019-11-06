import { Component } from 'react'
import fetch from 'isomorphic-unfetch'
import styled from 'styled-components'
import { object, string, array, number } from 'yup'

import Widget from '../../widget'
import Link from '../../link'
import Table, { Th, Td } from '../../table'
import LoadingIndicator from '../../loading-indicator'
import { basicAuthHeader } from '../../../lib/auth'

const jenkinsKpiColor = ({ theme, value }) => {
  if (value < 70) return theme.palette.errorColor
  if (value >= 70 && value < 90) return theme.palette.warnColor
  return theme.palette.successColor
}

const Kpi = styled.span`
  color: ${jenkinsKpiColor};
  font-weight: 700;
  font-size: 20px;
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

export default class JenkinsJobHealth extends Component {
  static defaultProps = {
    interval: 1000 * 60 * 5,
    title: 'Job Health'
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
          const res = await fetch(`${url}/job/${job.path}/${branch}api/json`, opts)
          const json = await res.json()

          return {
            name: job.label,
            url: json.url,
            health: json.healthReport
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

  renderHealth (build) {
    return build.map((b, index, array) => (
      <Link key={index} href={build.url} title={b.score}>
        <Kpi value={b.score}>{b.score}</Kpi>
        {index < array.length - 1 && <span> / </span>}
      </Link>
    ))
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
                  {
                    build.health
                      ? this.renderHealth(build.health)
                      : <LoadingIndicator size='small' />
                  }
                </Td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Widget>
    )
  }
}
