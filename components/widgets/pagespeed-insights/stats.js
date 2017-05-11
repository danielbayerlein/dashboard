import { Component } from 'react'
import fetch from 'isomorphic-unfetch'
import Table, { Th, Td } from '../../table'
import Widget from '../../widget'

export default class PageSpeedInsightsStats extends Component {
  static defaultProps = {
    filterThirdPartyResources: true,
    interval: 1000 * 60 * 60 * 12,
    locale: 'de_DE',
    strategy: 'desktop',
    title: 'PageSpeed Stats'
  }

  state = {
    stats: {},
    loading: true,
    error: false
  }

  componentDidMount () {
    this.fetchInformation()
  }

  componentWillUnmount () {
    clearInterval(this.interval)
  }

  bytesToKilobytes (bytes) {
    return bytes > 0 ? (bytes / 1024).toFixed(1) : 0
  }

  async fetchInformation () {
    const { url, filterThirdPartyResources, locale, strategy } = this.props

    const searchParams = [
      `url=${url}`,
      `filter_third_party_resources=${filterThirdPartyResources}`,
      `locale=${locale}`,
      `strategy=${strategy}`
    ].join('&')

    try {
      const res = await fetch(`https://www.googleapis.com/pagespeedonline/v2/runPagespeed?${searchParams}`)
      const json = await res.json()

      const pageStats = json.pageStats
      const stats = {
        cssCount: pageStats.numberCssResources || 0,
        cssSize: this.bytesToKilobytes(pageStats.cssResponseBytes),
        htmlSize: this.bytesToKilobytes(pageStats.htmlResponseBytes),
        imageSize: this.bytesToKilobytes(pageStats.imageResponseBytes),
        javascriptCount: pageStats.numberJsResources || 0,
        javascriptSize: this.bytesToKilobytes(pageStats.javascriptResponseBytes),
        requestCount: pageStats.numberResources || 0,
        requestSize: this.bytesToKilobytes(pageStats.totalRequestBytes),
        otherSize: this.bytesToKilobytes(pageStats.otherResponseBytes)
      }

      this.setState({ error: false, loading: false, stats })
    } catch (error) {
      this.setState({ error: true, loading: false })
    } finally {
      this.interval = setInterval(() => this.fetchInformation(), this.props.interval)
    }
  }

  render () {
    const { error, loading, stats } = this.state
    const { title } = this.props
    return (
      <Widget title={title} loading={loading} error={error}>
        <Table>
          <tr>
            <Th>Request</Th>
            <Td>{stats.requestSize} KB ({stats.requestCount})</Td>
          </tr>

          <tr>
            <Th>JavaScript</Th>
            <Td>{stats.javascriptSize} KB ({stats.javascriptCount})</Td>
          </tr>

          <tr>
            <Th>CSS</Th>
            <Td>{stats.cssSize} KB ({stats.cssCount})</Td>
          </tr>

          <tr>
            <Th>HTML</Th>
            <Td>{stats.htmlSize} KB</Td>
          </tr>

          <tr>
            <Th>Image</Th>
            <Td>{stats.imageSize} KB</Td>
          </tr>

          <tr>
            <Th>Other</Th>
            <Td>{stats.otherSize} KB</Td>
          </tr>
        </Table>
      </Widget>
    )
  }
}
