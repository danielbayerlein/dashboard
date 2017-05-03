import { Component } from 'react'
import { URL } from 'universal-url'
import fetch from 'isomorphic-unfetch'
import Widget from '../../widget'

export default class SonarQube extends Component {
  static defaultProps = {
    title: 'SonarQube'
  }

  state = {
    measures: [],
    loading: true,
  }

  componentDidMount () {
    this.loadInformation()
  }

  async loadInformation() {
    this.setState({ loading: true, error: null })

    const { url, componentKey } = this.props

    // https://docs.sonarqube.org/display/SONAR/Metric+Definitions
    const metricKeys = [
      'alert_status', 'reliability_rating', 'bugs', 'security_rating',
      'vulnerabilities', 'sqale_rating', 'code_smells', 'coverage',
      'duplicated_lines_density'
    ]

    const urlObj = new URL('api/measures/component', url)
    urlObj.searchParams.append('componentKey', componentKey)
    urlObj.searchParams.append('metricKeys', metricKeys.join(','))

    try {
      const res = await fetch(urlObj.toString()) // eslint-disable-line no-undef
      const json = await res.json()

      this.setState({
        loading: false,
        measures: json.component.measures
      })
    } catch (err) {
      this.setState({
        loading: false,
        error: 'failed to load information'
      })
    }
  }

  getMetricValue = (measures, metricKey) => {
    const result = measures.filter(measure => measure.metric === metricKey)
    return result.length ? result[0].value : ''
  }

  getRatingValue = (measures, metricKey) => {
    const value = this.getMetricValue(measures, metricKey)

    switch (value) {
      case '1.0':
        return 'A'
      case '2.0':
        return 'B'
      case '3.0':
        return 'C'
      case '4.0':
        return 'D'
      case '5.0':
        return 'E'
    }

    return '?'
  }

  render () {
    const { measures, loading, error } = this.state
    const { title } = this.props

    const alertStatus = this.getMetricValue(measures, 'alert_status')

    const reliabilityRating = this.getRatingValue(measures, 'reliability_rating')
    const bugs = this.getMetricValue(measures, 'bugs')

    const securityRating = this.getRatingValue(measures, 'security_rating')
    const vulnerabilities = this.getMetricValue(measures, 'vulnerabilities')

    const sqaleRating = this.getRatingValue(measures, 'sqale_rating')
    const codeSmells = this.getMetricValue(measures, 'code_smells')

    const coverage = this.getMetricValue(measures, 'coverage')

    const duplicatedLinesDensity = this.getMetricValue(measures, 'duplicated_lines_density')

    return (
      <Widget title={title} loading={loading} error={error}>
        <p>Quality Gate: {alertStatus}</p>
        <p>Reliability: {reliabilityRating} ({bugs})</p>
        <p>Security: {securityRating} ({vulnerabilities})</p>
        <p>Maintainability: {sqaleRating} ({codeSmells})</p>
        <p>Coverage: {coverage}%</p>
        <p>Duplications: {duplicatedLinesDensity}%</p>
      </Widget>
    )
  }
}
