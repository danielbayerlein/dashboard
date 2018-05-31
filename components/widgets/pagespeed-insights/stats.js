import { Component } from 'react'
import fetch from 'isomorphic-unfetch'
import { object, string, boolean, number } from 'yup'
import Table, { Th, Td } from '../../table'
import Widget from '../../widget'

const schema = object().shape({
  url: string().url().required(),
  filterThirdPartyResources: boolean(),
  interval: number(),
  strategy: string(),
  title: string()
})

export default class PageSpeedInsightsStats extends Component {
  static defaultProps = {
    filterThirdPartyResources: false,
    interval: 1000 * 60 * 60 * 12,
    strategy: 'desktop',
    title: 'PageSpeed Stats'
  }

  state = {
    stats: {},
    loading: true,
    error: false
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

  bytesToKilobytes (bytes) {
    return bytes > 0 ? (bytes / 1024).toFixed(1) : 0
  }

  async fetchInformation () {
    const { url, filterThirdPartyResources, strategy } = this.props

    const searchParams = [
      `url=${url}`,
      `filter_third_party_resources=${filterThirdPartyResources}`,
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
      this.timeout = setTimeout(() => this.fetchInformation(), this.props.interval)
    }
  }

  render () {
    const { error, loading, stats } = this.state
    const { title } = this.props
    return (
      <Widget title={title} loading={loading} error={error}>
        <Table>
          <tbody>
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
          </tbody>
        </Table>
      </Widget>
    )
  }
}
