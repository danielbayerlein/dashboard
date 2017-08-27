import { Component } from 'react'
import fetch from 'isomorphic-unfetch'
import yup from 'yup'
import Widget from '../../widget'
import Counter from '../../counter'
import { basicAuthHeader } from '../../../lib/auth'
import { severity, NONE } from '../../../lib/alert'

const schema = yup.object().shape({
  url: yup.string().url().required(),
  project: yup.string().required(),
  repository: yup.string().required(),
  interval: yup.number(),
  title: yup.string(),
  users: yup.array().of(yup.string()),
  authKey: yup.string(),
  alert: yup.array(yup.object({
    severity: yup.string().required(),
    value: yup.number().required()
  }))
})

export default class BitbucketPullRequestCount extends Component {
  static defaultProps = {
    interval: 1000 * 60 * 5,
    title: 'Bitbucket PR Count',
    users: []
  }

  state = {
    count: 0,
    hasError: false,
    isLoading: true,
    alertSeverity: NONE
  }

  componentDidMount () {
    schema.validate(this.props)
      .then(() => this.fetchInformation())
      .catch((err) => {
        console.error(`${err.name} @ ${this.constructor.name}`, err.errors)
        this.setState({ hasError: true, isLoading: false })
      })
  }

  componentWillUnmount () {
    clearInterval(this.interval)
  }

  async fetchInformation () {
    const { authKey, url, project, repository, users, alert } = this.props
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

      this.setState({
        count,
        hasError: false,
        isLoading: false,
        alertSeverity: severity(count, alert)
      })
    } catch (err) {
      this.setState({ hasError: true, isLoading: false, alertSeverity: NONE })
    } finally {
      this.interval = setInterval(() => this.fetchInformation(), this.props.interval)
    }
  }

  render () {
    const { count, hasError, isLoading, alertSeverity } = this.state
    const { title } = this.props
    return (
      <Widget title={title} isLoading={isLoading} hasError={hasError} alertSeverity={alertSeverity}>
        <Counter value={count} />
      </Widget>
    )
  }
}
