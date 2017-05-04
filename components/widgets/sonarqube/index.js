import { Component } from 'react'
import styled from 'styled-components'
import fetch from 'isomorphic-unfetch'
import Widget from '../../widget'

const Table = styled.table`
  border-color: transparent
  border-spacing: 5px
  text-align: left
`

const Td = styled.td`
  padding: 5px
`

const Th = Td

const Badge = styled.span`
  background: ${props => {
    switch (props.children) {
      case 'A':
        return '#8BC34A'
      case 'B':
        return '#CDDC39'
      case 'C':
        return '#FFEB3B'
      case 'D':
        return '#FF5722'
      default:
        return '#F44336'
    }
  }}
  border-radius: 50%
  box-sizing: border-box
  display: inline-block
  height: 30px
  line-height: 30px
  text-align: center
  width: 30px
`

const Alert = styled.span`
  color: ${props => {
    if (props.children === 'ERROR') {
      return '#F44336'
    }

    if (props.children === 'WARN') {
      return '#FFEB3B'
    }

    // OK
    return '#8BC34A'
  }}
`

export default class SonarQube extends Component {
  static defaultProps = {
    title: 'SonarQube'
  }

  state = {
    measures: [],
    loading: true,
    error: null
  }

  componentDidMount () {
    this.loadInformation()
  }

  async loadInformation () {
    this.setState({ loading: true, error: null })

    const { url, componentKey } = this.props

    // https://docs.sonarqube.org/display/SONAR/Metric+Definitions
    const metricKeys = [
      'alert_status', 'reliability_rating', 'bugs', 'security_rating',
      'vulnerabilities', 'sqale_rating', 'code_smells', 'coverage',
      'duplicated_lines_density'
    ]

    try {
      const res = await fetch(`${url}/api/measures/component?componentKey=${componentKey}&metricKeys=${metricKeys.join(',')}`)
      const json = await res.json()

      this.setState({
        loading: false,
        measures: json.component.measures
      })
    } catch (_) {
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
    const { error, loading, measures } = this.state
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
        <Table>
          <tbody>
            <tr>
              <Th>Quality Gate:</Th>
              <Td><Alert>{alertStatus}</Alert></Td>
            </tr>

            <tr>
              <Th>Reliability:</Th>
              <Td>
                <Badge>{reliabilityRating}</Badge> <small>({bugs})</small>
              </Td>
            </tr>

            <tr>
              <Th>Security:</Th>
              <Td>
                <Badge>{securityRating}</Badge> <small>({vulnerabilities})</small>
              </Td>
            </tr>

            <tr>
              <Th>Maintainability:</Th>
              <Td>
                <Badge>{sqaleRating}</Badge> <small>({codeSmells})</small>
              </Td>
            </tr>

            <tr>
              <Th>Coverage:</Th>
              <Td>{coverage} %</Td>
            </tr>

            <tr>
              <Th>Duplications:</Th>
              <Td>{duplicatedLinesDensity} %</Td>
            </tr>
          </tbody>
        </Table>
      </Widget>
    )
  }
}
