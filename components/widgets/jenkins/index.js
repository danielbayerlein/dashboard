import { Component } from 'react'
import fetch from 'isomorphic-unfetch'
import Widget from '../../widget'

export default class JiraIssueCount extends Component {
  static defaultProps = {
    jobs: [],
    title: 'Jenkins'
  }

  state = {
    loading: false,
    error: null
  }

  componentDidMount () {
    this.loadInformation()
  }

  async loadInformation() {
     this.setState({ loading: true, error: null })

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

      this.setState({
        loading: false,
        builds
      })
    } catch (_) {
      console.log(_)
      this.setState({
        loading: false,
        error: 'failed to load information'
      })
    }
  }

  render () {
    const { url, loading, error, builds } = this.state
    const { title } = this.props

    return (
      <Widget title={title}>
        <table>
          <tbody>
            {builds && builds.map(build => (
              <tr key={`jenkins-${build.name}`}>
                <th>{build.name}</th>
                <td><a href={build.url}>{build.result}</a></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Widget>
    )
  }
}
