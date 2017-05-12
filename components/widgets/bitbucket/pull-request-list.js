import { Component } from 'react'
import fetch from 'isomorphic-unfetch'
import styled from 'styled-components'
import Widget from '../../widget'

// TODO: move in separate file
const Badge = styled.span`
  font-size: 0.8em;
  border-radius: 5px;
  position: absolute;
  margin-left: 5px;
  display: inline-block;
  padding: 2px 4px;
  background-color: ${props => {
    switch (props.status) {
      case 'OPEN':
        return props.theme.palette.neutralColor
      case 'DECLINED':
        return props.theme.palette.warnColor
      case 'MERGED':
        return props.theme.palette.successColor
      default:
        return 'transparent'
    }
  }}
`

const Destintion = styled.span`
  font-size: 0.8em;
  color: ${props => props.theme.palette.primaryColor};
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

  async fetchInformation () {
    const { url, project, repository, users } = this.props

    try {
      // TODO: check bitbucket server api (1.0)
      const res = await fetch(`${url}2.0/repositories/marsn88/dashboard-demo/pullrequests?limit=5`)
      const json = await res.json()

      let pullRequests = json.values;
      if (users.length) {
        pullRequests = json.values.filter((el) => users.includes(pullRequests.user.slug))
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
            {pr.title} <Badge status={pr.state}>{pr.state}</Badge>
            <div>
              <Destintion>
                <Code>{pr.source.branch.name}</Code> > <Code>{pr.destination.branch.name}</Code>
              </Destintion>
            </div>
          </div>
        ))}
      </Widget>
    )
  }
}
