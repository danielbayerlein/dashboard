import { Component } from 'react'
import fetch from 'isomorphic-unfetch'
import Widget from '../../widget'
import Counter from '../../counter'

export default class BitbucketPullRequestCount extends Component {
  static defaultProps = {
    title: 'Bitbucket PR Count',
    users: []
  }

  state = {
    count: 0,
    error: false,
    loading: true
  }

  async componentDidMount () {
    const { url, project, repository, users } = this.props

    try {
      const res = await fetch(`${url}rest/api/1.0/projects/${project}/repos/${repository}/pull-requests?limit=100`)
      const json = await res.json()

      let count;
      if (users.length) {
        const values = json.values.filter((el) => users.includes(el.user.slug))
        count = values.length;
      } else {
        count = json.size;
      }

      this.setState({ loading: false, count })
    } catch (error) {
      this.setState({ loading: false, error: true })
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
