import { Component } from 'react'
import fetch from 'isomorphic-unfetch'
import yup from 'yup'
import Widget from '../../widget'
import Counter from '../../counter'

const schema = yup.object().shape({
  url: yup.string().url().required(),
  query: yup.string().required(),
  interval: yup.number(),
  title: yup.string()
})

export default class JiraIssueCount extends Component {
  static defaultProps = {
    interval: 1000 * 60 * 5,
    title: 'JIRA Issue Count'
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
        console.log('JIRA Issue Count: missing or invalid params', err.errors)
        this.setState({ error: true, loading: false })
      })
  }

  componentWillUnmount () {
    clearInterval(this.interval)
  }

  async fetchInformation () {
    const { url, query } = this.props

    try {
      const res = await fetch(`${url}/rest/api/2/search?jql=${query}`)
      const json = await res.json()

      this.setState({ count: json.total, error: false, loading: false })
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
