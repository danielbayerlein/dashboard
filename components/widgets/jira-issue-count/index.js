import { Component } from 'react'
import fetch from 'isomorphic-unfetch'
import Widget from '../../widget'
import Counter from '../../counter'

export default class JiraIssueCount extends Component {
  static defaultProps = {
    query: '',
    title: 'JIRA Issue Count'
  }

  state = {
    count: 0,
    loading: true,
    error: null
  }

  componentDidMount () {
    this.loadInformation()
  }

  async loadInformation () {
    this.setState({ loading: true, error: null })

    const { url, query } = this.props

    try {
      const res = await fetch(`${url}rest/api/2/search?jql=${query}`)
      const json = await res.json()

      this.setState({
        loading: false,
        count: json.total
      })
    } catch (_) {
      this.setState({
        loading: false,
        error: 'failed to load information'
      })
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
