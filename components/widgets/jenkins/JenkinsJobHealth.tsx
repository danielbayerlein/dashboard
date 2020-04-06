import React, { Component } from "react";
import fetch from "isomorphic-unfetch";
import styled from "styled-components";

import Widget from "../../Widget";
import Link from "../../Link";
import Table, { Td, Th } from "../../Table";
import LoadingIndicator from "../../LoadingIndicator";
import { basicAuthHeader } from "../../../lib/auth";
import {
  IJenkinsBuild,
  IJenkinsJobHealthProps,
  IJenkinsJobHealthState,
} from "./jenkins-model";

const jenkinsKpiColor = ({ theme, value }) => {
  if (value < 70) return theme.palette.errorColor;
  if (value >= 70 && value < 90) return theme.palette.warnColor;
  return theme.palette.successColor;
};

const Kpi = styled.span`
  color: ${jenkinsKpiColor};
  font-weight: 700;
  font-size: 20px;
`;

export default class JenkinsJobHealth extends Component<
  IJenkinsJobHealthProps,
  IJenkinsJobHealthState
> {
  static defaultProps = {
    interval: 1000 * 60 * 5,
    title: "Job Health",
  };

  state = {
    loading: true,
    error: false,
    builds: [],
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
    const { authKey, jobs, url } = this.props;
    const opts = authKey ? { headers: basicAuthHeader(authKey) } : {};

    try {
      const builds: Array<IJenkinsBuild> = await Promise.all(
        jobs.map(async (job) => {
          const branch = job.branch ? `job/${job.branch}/` : "";
          const res = await fetch(
            `${url}/job/${job.path}/${branch}api/json`,
            opts
          );
          const json = await res.json();

          return {
            name: job.label,
            url: json.url,
            health: json.healthReport,
            duration: 0,
          };
        })
      );

      this.setState({ error: false, loading: false, builds });
    } catch (error) {
      this.setState({ error: true, loading: false });
    } finally {
      this.timeout = setTimeout(
        () => this.fetchInformation(),
        this.props.interval
      );
    }
  }

  renderHealth(build) {
    return build.map((b, index, array) => (
      <Link key={index} href={build.url} title={b.score}>
        <Kpi value={b.score}>{b.score}</Kpi>
        {index < array.length - 1 && <span> / </span>}
      </Link>
    ));
  }

  render() {
    const { loading, error, builds } = this.state;
    const { title } = this.props;

    return (
      <Widget title={title} error={error} loading={loading}>
        <Table>
          <tbody>
            {builds &&
              builds.map((build) => (
                <tr key={`jenkins-${build.name}`}>
                  <Th>{build.name}</Th>
                  <Td>
                    {build.health ? (
                      this.renderHealth(build.health)
                    ) : (
                      <LoadingIndicator size="small" />
                    )}
                  </Td>
                </tr>
              ))}
          </tbody>
        </Table>
      </Widget>
    );
  }
}
