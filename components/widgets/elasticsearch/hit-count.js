import { Component } from 'react'
import fetch from 'isomorphic-unfetch'
import Widget from '../../widget'
import Counter from '../../counter'

export default class ElasticsearchHitCount extends Component {
  static defaultProps = {
    interval: 1000 * 60 * 5,
    title: 'Elasticsearch Hit Count'
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
    const { url, index, query } = this.props

    try {
      const res = await fetch(`${url}/${index}/_search?q=${query}`)
      const json = await res.json()

      this.setState({ count: json.hits.total, error: false, loading: false })
    } catch (error) {
      this.setState({ error: true, loading: false })
      console.log(error)
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
