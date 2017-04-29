import { Component } from 'react'
import tinytime from 'tinytime'

export default class DateTime extends Component {
  static defaultProps = {
    interval: 10000
  }

  state = {
    date: new Date()
  }

  componentDidMount () {
    this.interval = setInterval(() => this.setState({ date: new Date() }), this.props.interval)
  }

  componentWillUnmount () {
    clearInterval(this.interval)
  }

  render () {
    return (
      <div>
        <div>{tinytime('{H}:{mm}').render(this.state.date)}</div>
        <div>{tinytime('{DD}.{Mo}.{YYYY}').render(this.state.date)}</div>
      </div>
    )
  }
}
