import { Component } from 'react'
import fetch from 'isomorphic-unfetch'
import styled from 'styled-components'
import Widget from '../../widget'
import Table, { Th, Td } from '../../table'
import Badge from '../../badge'

const JenkinsBadge = styled(Badge)`
  background-color: ${props => {
    switch (props.status) {
      case 'FAILURE':
        return props.theme.palette.errorColor
      case 'UNSTABLE':
        return props.theme.palette.warnColor
      case 'SUCCESS':
        return props.theme.palette.successColor
      default:
        return 'transparent'
    }
  }}
`

export default class Jenkins extends Component {
  static defaultProps = {
    jobs: [],
    title: 'Jenkins'
  }

  state = {
    loading: true,
    error: false
  }

  componentDidMount () {
    this.loadInformation()
  }

  async loadInformation () {
    this.setState({ loading: true, error: false })

    const { jobs, url } = this.props

    try {
      const builds = await Promise.all(
        jobs.map(async job => {
          const res = await fetch(`${url}/job/${job.path}/lastBuild/api/json`)
          const json = await res.json()

          return {
            name: job.label,
            url: json.url,
            result: json.result
          }
        })
      )

      this.setState({ loading: false, builds })
    } catch (error) {
      this.setState({ loading: false, error: true })
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
                    <JenkinsBadge status={build.result} />
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
