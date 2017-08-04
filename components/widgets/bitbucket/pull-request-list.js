import { Component } from 'react'
import fetch from 'isomorphic-unfetch'
import yup from 'yup'
import styled from 'styled-components'
import Widget from '../../widget'
import Arrowicon from '../../arrow-icon'
import { Status } from '../../badge'
import { basicAuthHeader } from '../../../lib/auth'

const schema = yup.object().shape({
  url: yup.string().url().required(),
  project: yup.string().required(),
  repository: yup.string().required(),
  interval: yup.number(),
  title: yup.string(),
  users: yup.array().of(yup.string()),
  authKey: yup.string()
})

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
    title: 'Latest Pull Requests',
    users: []
  }

  state = {
    pullRequests: [],
    error: false,
    loading: true
  }

  componentDidMount () {
    schema.validate(this.props)
      .then(() => this.fetchInformation())
      .catch((err) => {
        console.error('abc')
        console.error(`${err.name} @ ${this.constructor.name}`, err)
        this.setState({ error: true, loading: false })
      })
  }

  componentWillUnmount () {
    clearInterval(this.interval)
  }

  extractBranchName (id) {
    return id.replace('refs/heads/', '')
  }

  async fetchInformation () {
    const { authKey, url, project, repository, users } = this.props
    const opts = authKey ? { headers: basicAuthHeader(authKey) } : {}

    try {
      const res = await fetch(`${url}/rest/api/1.0/projects/${project}/repos/${repository}/pull-requests?limit=3`, opts)
      const json = await res.json()

      let pullRequests = json.values
      if (users.length) {
        pullRequests = json.values.filter((el) => users.includes(pullRequests.author.user.slug))
      }

      this.setState({ pullRequests, error: false, loading: false })
    } catch (error) {
      this.setState({ error: true, loading: false })
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
          <div key={`pr-${pr.id}`}>
            {pr.title} <Status status={pr.state}>{pr.state}</Status>
            <hr/>
            {/*
            <div>
              <Destintion>
                <Code>{this.extractBranchName(pr.fromRef.id)}</Code> <Arrowicon /> <Code>{this.extractBranchName(pr.toRef.id)}</Code>
              </Destintion>
            </div>
            */}
          </div>
        ))}
      </Widget>
    )
  }
}
