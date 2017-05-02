import { Component } from 'react'
import { URL } from 'universal-url'
import fetch from 'isomorphic-unfetch'
import Widget from '../../widget'
import Counter from '../../counter'
import styled from 'styled-components'

const Listelement = styled.div`
  font-size: 1em;
  text-align: center;
`

export default class BitbucketPullrequestsCount extends Component {
  static defaultProps = {
    title: 'Open PullRequests'
  }

  state = {
    count: 0,
    values: []
  }

  async componentDidMount () {
    const { url } = this.props

    const urlObj = new URL('2.0/repositories/marsn88/dashboard-demo/pullrequests', url)
    const res = await fetch(urlObj.toString()) // eslint-disable-line no-undef

    const json = await res.json()

    this.setState({ count: json.size })
    this.setState({ values: json.values })
  }

  render () {
    const { count, values } = this.state
    const { title } = this.props

    return (
      <Widget title={title}>
        <Counter value={count} />
        {values.map((el) =>
            <Listelement>{el.title}</Listelement>
        )}
      </Widget>
    )
  }
}
