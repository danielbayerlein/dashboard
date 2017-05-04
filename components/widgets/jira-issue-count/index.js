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
    count: 0
  }

  async componentDidMount () {
    const { url, query } = this.props

    const res = await fetch(`${url}rest/api/2/search?jql=${query}`)
    const json = await res.json()

    this.setState({ count: json.total })
  }

  render () {
    const { count } = this.state
    const { title } = this.props

    return (
      <Widget title={title}>
        <Counter value={count} />
      </Widget>
    )
  }
}
