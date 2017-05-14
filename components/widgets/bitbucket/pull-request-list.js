import { Component } from 'react'
import fetch from 'isomorphic-unfetch'
import styled from 'styled-components'
import Widget from '../../widget'
import Arrowicon from '../../arrow-icon'
import { Status } from '../../badge'

const Destintion = styled.span`
  color: ${props => props.theme.palette.primaryColor};
  font-size: 0.8em;
`

const Code = styled.span`
  font-family: "Courier New",monospace;
`

export default class BitbucketPullRequestList extends Component {
  static defaultProps = {
    interval: 1000 * 60 * 5,
    title: 'Bitbucket PR List',
    users: []
  }

  state = {
    pullRequests: [],
    error: false,
    loading: true
  }

  componentDidMount () {
    this.fetchInformation()
  }

  componentWillUnmount () {
    clearInterval(this.interval)
  }

  extractBranchName(id) {
    return id.replace('refs/heads/', '')
  }

  async fetchInformation () {
    const { url, project, repository, users } = this.props

    try {
      const res = await fetch(`${url}rest/api/1.0/projects/${project}/repos/${repository}/pull-requests?limit=5`)
      const json = await res.json()

      let pullRequests = json.values;
      if (users.length) {
        pullRequests = json.values.filter((el) => users.includes(pullRequests.author.user.slug))
      }

      this.setState({ pullRequests, error: false, loading: false })
    } catch (error) {
      this.setState({ pullRequests, error: true, loading: false })
    } finally {
      this.interval = setInterval(() => this.fetchInformation(), this.props.interval)
    }
  }

  render () {
    const { pullRequests, error, loading } = this.state
    const { title } = this.props
    return (
      <Widget title={title} loading={loading} error={error}>
        {pullRequests.map(pr => (
          <div key={`pr-${pr.name}`}>
            {pr.title} <Status status={pr.state}>{pr.state}</Status>
            <div>
              <Destintion>
                <Code>{this.extractBranchName(pr.fromRef.id)}</Code> <Arrowicon /> <Code>{this.extractBranchName(pr.toRef.id)}</Code>
              </Destintion>
            </div>
          </div>
        ))}
      </Widget>
    )
  }
}
