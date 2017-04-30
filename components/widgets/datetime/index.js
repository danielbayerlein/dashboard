import { Component } from 'react'
import tinytime from 'tinytime'
import styled from 'styled-components'
import Paper from 'material-ui/Paper'

const Circle = styled(Paper)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 10em;
  width: 10em;
`

export default class DateTime extends Component {
  static defaultProps = {
    interval: 10000
  }

  state = {
    date: new Date()
  }

  componentDidMount () {
    const { interval } = this.props
    this.interval = setInterval(() => this.setState({ date: new Date() }), interval)
  }

  componentWillUnmount () {
    clearInterval(this.interval)
  }

  render () {
    const { date } = this.state

    return (
      <Circle circle>
        <h1>{tinytime('{H}:{mm}').render(date)}</h1>
        <span>{tinytime('{DD}.{Mo}.{YYYY}').render(date)}</span>
      </Circle>
    )
  }
}
