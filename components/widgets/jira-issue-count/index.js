import { Component } from 'react'
import { URL } from 'universal-url'
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

    const urlObj = new URL('rest/api/2/search', url)
    urlObj.searchParams.append('jql', query)

    try {
      const res = await fetch(urlObj.toString())
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
