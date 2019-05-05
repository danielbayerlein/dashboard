import { Component } from 'react'
import styled from 'styled-components'
import Widget from '../../widget'
import moment from 'moment-timezone'
import Table from '../../table'
import Flag from "react-flags"
import { object, string, array, number, boolean } from 'yup'

const TimeItem = styled.div`
  font-size: 3em;
  text-align: center;
  text-align: right;
`

const schema = object().shape({
  format24: boolean(),
  timeZones: array(object({
    name: string().required(),
    flag: string().required()
  })).required().max(5),
  interval: number()
})

export default class MultipleTimezones extends Component {
  static defaultProps = {
    interval: 1000 * 10,
    timeZones: [{ name: 'Asia/Colombo', flag: 'IN' }, { name: 'Europe/Copenhagen', flag: 'DK' }],
    format24: false
  }

  state = {
    date: new Date(),
    error: false,
    loading: true
  }

  componentDidMount () {
    const { interval } = this.props

    schema.validate(this.props).then(() => {
      this.setState({ loading: false }),
      this.timeout = setTimeout(() => this.setState({ date: new Date() }), interval)
      .catch((err) => {
        console.error(`${err.name} @ ${this.constructor.name}`, err.errors)
        this.setState({ error: true, loading: false })
      })
    })
  }

  componentWillUnmount () {
    clearTimeout(this.timeout)
  }

  render () {
    const { date, error, loading } = this.state
    const { timeZones, format24 } = this.props

    const format = format24 ? 'HH mm' : 'LT'

    return (
      <Widget error={error} loading={loading}>
        <Table>
          <tbody>
            { timeZones && timeZones.map((zone) =>
              <tr key={zone.name}>
                <td>
                  <Flag
                    name={zone.flag}
                    format="png"
                    pngSize={48}
                    shiny={true}
                    basePath='/static/flags'
                  />
                </td>
                <td>
                  <TimeItem>
                    { moment.tz(date, zone.name).format(format) }
                  </TimeItem>
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </Widget>
    )
  }
}
