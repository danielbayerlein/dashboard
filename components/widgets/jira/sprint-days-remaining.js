import { Component } from 'react'
import fetch from 'isomorphic-unfetch'
import yup from 'yup'
import Widget from '../../widget'
import Counter from '../../counter'
import { basicAuthHeader } from '../../../lib/auth'

const schema = yup.object().shape({
  url: yup.string().url().required(),
  boardId: yup.number().required(),
  interval: yup.number(),
  title: yup.string(),
  authKey: yup.string()
})

export default class JiraSprintDaysRemaining extends Component {
  static defaultProps = {
    interval: 1000 * 60 * 60,
    title: 'JIRA Sprint Days Remaining'
  }

  state = {
    days: 0,
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

  calculateDays (date) {
    const currentDate = new Date()
    const endDate = new Date(date)
    const timeDiff = endDate.getTime() - currentDate.getTime()
    const diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24))

    return diffDays
  }

  async fetchInformation () {
    const { authKey, boardId, url } = this.props
    const opts = authKey ? { headers: basicAuthHeader(authKey) } : {}

    try {
      const res = await fetch(`${url}/rest/agile/1.0/board/${boardId}/sprint?state=active`, opts)
      const json = await res.json()
      const days = this.calculateDays(json.values[0].endDate)

      this.setState({ days, error: false, loading: false })
    } catch (error) {
      this.setState({ error: true, loading: false })
    } finally {
      this.timeout = setTimeout(() => this.fetchInformation(), this.props.interval)
    }
  }

  render () {
    const { days, error, loading } = this.state
    const { title } = this.props
    return (
      <Widget title={title} loading={loading} error={error}>
        <Counter value={days} />
      </Widget>
    )
  }
}
