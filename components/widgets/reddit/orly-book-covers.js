import { Component } from 'react'
import fetch from 'isomorphic-unfetch'
import styled from 'styled-components'
import yup from 'yup'
import Widget from '../../widget'

const Image = styled.img`
  height: 18em;
`

const schema = yup.object().shape({
  interval: yup.number(),
  title: yup.string()
})

export default class OrlyBookCovers extends Component {
  static defaultProps = {
    interval: 1000 * 60 * 5,
    title: 'O Rly Book Covers'
  }

  state = {
    error: false,
    loading: true,
    url: ''
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
    clearInterval(this.interval)
  }

  async fetchInformation () {
    try {
      const res = await fetch('https://api.reddit.com/r/orlybooks/')
      const json = await res.json()
      const obj = json.data.children[Math.floor(Math.random() * json.data.children.length)]
      const imageUrl = obj.data.preview.images[0].source.url

      this.setState({ error: false, loading: false, url: imageUrl })
    } catch (error) {
      this.setState({ error: true, loading: false })
    } finally {
      this.interval = setInterval(() => this.fetchInformation(), this.props.interval)
    }
  }

  render () {
    const { url, error, loading } = this.state
    const { title } = this.props
    return (
      <Widget title={title} loading={loading} error={error}>
        <Image src={url} />
      </Widget>
    )
  }
}
