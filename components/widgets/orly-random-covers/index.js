import { Component } from 'react'
import fetch from 'isomorphic-unfetch'
import styled from 'styled-components'
import Widget from '../../widget'

const Image = styled.img`
  height: 18em;
`

export default class OrlyRandomCovers extends Component {
  static defaultProps = {
    images: []
  }

  state = {
    url: '',
    error: false,
    loading: true
  }

  async componentDidMount () {
    try {
      const res = await fetch('https://api.reddit.com/r/orlybooks/')
      const json = await res.json()
      const image = json.data.children[Math.floor(Math.random() * json.data.children.length)]
      const imageUrl = image.data.preview.images[0].source.url
      this.setState({ loading: false, url: imageUrl })
    } catch (error) {
      this.setState({ loading: false, error: true })
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
