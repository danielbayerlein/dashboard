import { Component } from 'react'
import fetch from 'isomorphic-unfetch'
import Widget from '../../widget'
import Counter from '../../counter'
import { base64BasicAuthHeader } from '../../../lib/auth'

export default class BitbucketPullRequestCount extends Component {
  static defaultProps = {
    interval: 1000 * 60 * 5,
    title: 'Bitbucket PR Count',
    users: []
  }

  state = {
    count: 0,
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
    const { authKey, url, project, repository, users } = this.props
    let opts = {}

    if (authKey) {
      opts = { headers: base64BasicAuthHeader(authKey) }
    }

    try {
      const res = await fetch(`${url}/rest/api/1.0/projects/${project}/repos/${repository}/pull-requests?limit=100`, opts)
      const json = await res.json()

      let count
      if (users.length) {
        count = json.values.filter((el) => users.includes(el.user.slug)).length
      } else {
        count = json.size
      }

      this.setState({ count, error: false, loading: false })
    } catch (error) {
      this.setState({ error: true, loading: false })
    } finally {
      this.interval = setInterval(() => this.fetchInformation(), this.props.interval)
    }
  }

  render () {
    const { count, error, loading } = this.state
    const { title } = this.props
    return (
      <Widget title={title} loading={loading} error={error}>
        <Counter value={count} />
      </Widget>
    )
  }
}
