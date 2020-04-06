import React, { Component } from "react";
import fetch from "isomorphic-unfetch";
import Table, { Td, Th } from "../../Table";
import Widget from "../../Widget";
import {
  IPageSpeedInsightsStatsProps,
  IPageSpeedInsightsStatsState,
  IPageSpeedStats,
} from "./pagespeed-model";

export default class PageSpeedInsightsStats extends Component<
  IPageSpeedInsightsStatsProps,
  IPageSpeedInsightsStatsState
> {
  static defaultProps = {
    filterThirdPartyResources: false,
    interval: 1000 * 60 * 60 * 12,
    strategy: "desktop",
    title: "PageSpeed Stats",
  };

  state = {
    stats: {
      requestSize: 0,
      requestCount: 0,
      cssCount: 0,
      cssSize: 0,
      htmlSize: 0,
      imageSize: 0,
      javascriptCount: 0,
      javascriptSize: 0,
      otherSize: 0,
    },
    loading: true,
    error: false,
  };

  timeout: any = 0;

  static bytesToKilobytes(bytes: number): number {
    return bytes > 0 ? Number.parseFloat((bytes / 1024).toFixed(1)) : 0;
  }

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
    const { url, filterThirdPartyResources, strategy } = this.props;

    const searchParams = [
      `url=${url}`,
      `filter_third_party_resources=${filterThirdPartyResources}`,
      `strategy=${strategy}`,
    ].join("&");

    try {
      const res = await fetch(
        `https://www.googleapis.com/pagespeedonline/v2/runPagespeed?${searchParams}`
      );
      const json = await res.json();

      const pageStats = json.pageStats;
      const stats: IPageSpeedStats = {
        cssCount: pageStats.numberCssResources || 0,
        cssSize: PageSpeedInsightsStats.bytesToKilobytes(
          pageStats.cssResponseBytes
        ),
        htmlSize: PageSpeedInsightsStats.bytesToKilobytes(
          pageStats.htmlResponseBytes
        ),
        imageSize: PageSpeedInsightsStats.bytesToKilobytes(
          pageStats.imageResponseBytes
        ),
        javascriptCount: pageStats.numberJsResources || 0,
        javascriptSize: PageSpeedInsightsStats.bytesToKilobytes(
          pageStats.javascriptResponseBytes
        ),
        requestCount: pageStats.numberResources || 0,
        requestSize: PageSpeedInsightsStats.bytesToKilobytes(
          pageStats.totalRequestBytes
        ),
        otherSize: PageSpeedInsightsStats.bytesToKilobytes(
          pageStats.otherResponseBytes
        ),
      };

      this.setState({ error: false, loading: false, stats });
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
    const { error, loading, stats } = this.state;
    const { title } = this.props;
    return (
      <Widget title={title} loading={loading} error={error}>
        <Table>
          <tbody>
            <tr>
              <Th>Request</Th>
              <Td>
                {stats.requestSize} KB ({stats.requestCount})
              </Td>
            </tr>

            <tr>
              <Th>JavaScript</Th>
              <Td>
                {stats.javascriptSize} KB ({stats.javascriptCount})
              </Td>
            </tr>

            <tr>
              <Th>CSS</Th>
              <Td>
                {stats.cssSize} KB ({stats.cssCount})
              </Td>
            </tr>

            <tr>
              <Th>HTML</Th>
              <Td>{stats.htmlSize} KB</Td>
            </tr>

            <tr>
              <Th>Image</Th>
              <Td>{stats.imageSize} KB</Td>
            </tr>

            <tr>
              <Th>Other</Th>
              <Td>{stats.otherSize} KB</Td>
            </tr>
          </tbody>
        </Table>
      </Widget>
    );
  }
}
