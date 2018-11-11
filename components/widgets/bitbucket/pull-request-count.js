import { Component } from 'react'
import fetch from 'isomorphic-unfetch'
import { object, string, number, array } from 'yup'
import Widget from '../../widget'
import Counter from '../../counter'
import { basicAuthHeader } from '../../../lib/auth'

const schema = object().shape({
  url: string().url().required(),
  project: string().required(),
  repository: string().required(),
  interval: number(),
  title: string(),
  users: array().of(string()),
  authKey: string()
})

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
    const { authKey, url, project, repository, users } = this.props
    const opts = authKey ? { headers: basicAuthHeader(authKey) } : {}

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
      this.timeout = setTimeout(() => this.fetchInformation(), this.props.interval)
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
