import { Component } from 'react'
import fetch from 'isomorphic-unfetch'
import Widget from '../../widget'
import Counter from '../../counter'

export default class ElasticsearchErrorHitCount extends Component {
  static defaultProps = {
    interval: 1000 * 60 * 5,
    title: 'Elasticsearch Hit Count',
    users: []
  }

  state = {
    count: 0,
    error: false,
    loading: true
  }

  componentDidMount () {
    this.fetchInformation()
  }

  componentWillUnmount () {
    clearInterval(this.interval)
  }

  async fetchInformation () {
    const { url, index, query, users, auth } = this.props

    try {
      const res = await fetch(`${url}/${index}/_search?q=${query}`, {
        credentials: 'included',
        headers: {
          //'Authorization': 'Basic '+btoa('elastic:changeme')
          'Authorization': `${auth}`
        }
      })
      const json = await res.json()

      this.setState({ count: json.hits.total, error: false, loading: false })
    } catch (error) {
      this.setState({ error: true, loading: false })
      console.log(error)
    } finally {
      this.interval = setInterval(() => this.fetchInformation(), this.props.interval)
    }
  }

  render () {
    const { count, error, loading } = this.state
    const { title } = this.props
    return (
      <Widget title={title} loading={loading} error={error}>
        <Counter value={count} />
      </Widget>
    )
  }
}

/* TESTDATA
# docker
docker run -p 9200:9200 -e "http.host=0.0.0.0" -e "transport.host=127.0.0.1" docker.elastic.co/elasticsearch/elasticsearch:5.4.0

#import data
curl -u elastic:changeme -XPUT 'http://localhost:9200/blog/user/dilbert' -d '{ "name" : "Dilbert Brown" }'

curl -u elastic:changeme -XPUT 'http://localhost:9200/blog/post/1' -d '
{
    "user": "dilbert",
    "postDate": "2011-12-15",
    "body": "Search is hard. Search should be easy." ,
    "title": "On search"
}'

curl -u elastic:changeme -XPUT 'http://localhost:9200/blog/post/2' -d '
{
    "user": "dilbert",
    "postDate": "2011-12-12",
    "body": "Distribution is hard. Distribution should be easy." ,
    "title": "On distributed search"
}'

curl -u elastic:changeme -XPUT 'http://localhost:9200/blog/post/3' -d '
{
    "user": "dilbert",
    "postDate": "2011-12-10",
    "body": "Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat" ,
    "title": "Lorem ipsum"
}'

curl -u elastic:changeme  'http://localhost:9200/blog/_search?q=user:dilbert%20-_type:post'

*/
