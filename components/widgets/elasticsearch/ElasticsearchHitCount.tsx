import React, { Component } from "react";
import fetch from "isomorphic-unfetch";
import Widget from "../../Widget";
import Counter from "../../Counter";
import { basicAuthHeader } from "../../../lib/auth";
import {
  IElasticsearchHitCountProps,
  IElasticsearchHitCountState,
} from "./elasticsearch-model";

export default class ElasticsearchHitCount extends Component<
  IElasticsearchHitCountProps,
  IElasticsearchHitCountState
> {
  static defaultProps = {
    interval: 1000 * 60 * 5,
    title: "Elasticsearch Hit Count",
  };

  state = {
    count: 0,
    error: false,
    loading: true,
  };

  timeout: any = 0;

  componentDidMount() {
    this.fetchInformation().catch((err) => {
      console.error(`${err.name} @ ${this.constructor.name}`, err.errors);
      this.setState({ error: true, loading: false });
    });
  }

  componentWillUnmount() {
    clearTimeout(this.timeout);
  }

  async fetchInformation() {
    const { authKey, index, query, url } = this.props;
    const opts = authKey ? { headers: basicAuthHeader(authKey) } : {};

    try {
      const res = await fetch(`${url}/${index}/_search?q=${query}`, opts);
      const json = await res.json();

      this.setState({ count: json.hits.total, error: false, loading: false });
    } catch (error) {
      this.setState({ error: true, loading: false });
    } finally {
      this.timeout = setTimeout(
        () => this.fetchInformation(),
        this.props.interval
      );
    }
  }

  render() {
    const { count, error, loading } = this.state;
    const { title } = this.props;
    return (
      <Widget title={title} loading={loading} error={error}>
        <Counter value={count} />
      </Widget>
    );
  }
}
