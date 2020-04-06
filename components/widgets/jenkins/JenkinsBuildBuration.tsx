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
  IJenkinsBuildBurationProps,
  IJenkinsBuildBurationState,
} from "./jenkins-model";

const Kpi = styled.span`
  color: ${(props) => props.theme.palette.primaryColor};
  font-weight: 700;
  font-size: 20px;
`;

export default class JenkinsBuildDuration extends Component<
  IJenkinsBuildBurationProps,
  IJenkinsBuildBurationState
> {
  static defaultProps = {
    interval: 1000 * 60 * 5,
    title: "Build Duration",
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

  formatTime(ms: number) {
    const s = ms / 1000;

    if (s > 60) {
      const min: number = Math.floor(s / 60);
      let minSec: number = Math.round(s - min * 60);
      const minSecString: string =
        minSec.toString().length === 1 ? `0${minSec}` : minSec.toString();

      return (
        <>
          <Kpi>
            {min}:{minSecString}
          </Kpi>{" "}
          min
        </>
      );
    }

    return (
      <>
        <Kpi>{Math.round(s)}</Kpi> sec
      </>
    );
  }

  async fetchInformation() {
    const { authKey, jobs, url } = this.props;
    const opts = authKey ? { headers: basicAuthHeader(authKey) } : {};

    try {
      const builds: Array<IJenkinsBuild> = await Promise.all(
        jobs.map(async (job) => {
          const branch = job.branch ? `job/${job.branch}/` : "";
          const res = await fetch(
            `${url}/job/${job.path}/${branch}lastBuild/api/json`,
            opts
          );
          const json = await res.json();

          return {
            name: job.label,
            url: json.url,
            duration: json.duration,
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

  render() {
    const { loading, error, builds } = this.state;
    const { title } = this.props;

    return (
      <Widget title={title} error={error} loading={loading}>
        <Table>
          <tbody>
            {builds &&
              builds.map((build: IJenkinsBuild) => (
                <tr key={`jenkins-${build.name}`}>
                  <Th>{build.name}</Th>
                  <Td>
                    <Link href={build.url} title={build.duration}>
                      {build.duration ? (
                        this.formatTime(build.duration)
                      ) : (
                        <LoadingIndicator size="small" />
                      )}
                    </Link>
                  </Td>
                </tr>
              ))}
          </tbody>
        </Table>
      </Widget>
    );
  }
}
