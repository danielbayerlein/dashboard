import { Component } from 'react'
import fetch from 'isomorphic-unfetch'
import styled from 'styled-components'
import { object, string, array, number } from 'yup'

import Widget from '../../widget'
import Link from '../../link'
import Table, { Th, Td } from '../../table'
import LoadingIndicator from '../../loading-indicator'
import { basicAuthHeader } from '../../../lib/auth'

const Kpi = styled.span`
  color: ${props => props.theme.palette.primaryColor};
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

export default class JenkinsBuildDuration extends Component {
  static defaultProps = {
    interval: 1000 * 60 * 5,
    title: 'Build Duration'
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

  formatTime (ms) {
    const s = ms / 1000

    if (s > 60) {
      const min = Math.floor(s / 60)
      let minSec = Math.round(s - (min * 60))
      minSec = minSec.toString().length === 1 ? `0${minSec}` : minSec

      return <><Kpi>{min}:{minSec}</Kpi> min</>
    }

    return <><Kpi>{Math.round(s)}</Kpi> sec</>
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
            duration: json.duration
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
                  <Link href={build.url} title={build.duration}>
                    {
                      build.duration
                        ? this.formatTime(build.duration)
                        : <LoadingIndicator size='small' />
                    }
                  </Link>
                </Td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Widget>
    )
  }
}
