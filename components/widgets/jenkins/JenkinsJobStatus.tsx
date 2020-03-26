import React, { Component } from "react";
import fetch from "isomorphic-unfetch";
import styled from "styled-components";
import Widget from "../../Widget";
import Table, { Td, Th } from "../../Table";
import Badge from "../../Badge";
import LoadingIndicator from "../../LoadingIndicator";
import { basicAuthHeader } from "../../../lib/auth";
import {
  IJenkinsBuild,
  IJenkinsJobStatusProps,
  IJenkinsJobStatusState,
} from "./jenkins-model";

const jenkinsBadgeColor = ({ theme, status }) => {
  switch (status) {
    case "FAILURE":
      return theme.palette.errorColor;
    case "UNSTABLE":
      return theme.palette.warnColor;
    case "SUCCESS":
      return theme.palette.successColor;
    case "ABORTED":
    case "NOT_BUILT":
      return theme.palette.disabledColor;
    default:
      // null = 'In Progress'
      return "transparent";
  }
};

const JenkinsBadge = styled(Badge)`
  background-color: ${jenkinsBadgeColor};
`;

export default class JenkinsJobStatus extends Component<
  IJenkinsJobStatusProps,
  IJenkinsJobStatusState
> {
  static defaultProps = {
    interval: 1000 * 60 * 5,
    title: "Job Status",
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
            `${url}/job/${job.path}/${branch}lastBuild/api/json`,
            opts
          );
          const json = await res.json();

          return {
            name: job.label,
            url: json.url,
            result: json.result,
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
                    <a href={build.url} title={build.result}>
                      {build.result ? (
                        <JenkinsBadge status={build.result} />
                      ) : (
                        <LoadingIndicator size="small" />
                      )}
                    </a>
                  </Td>
                </tr>
              ))}
          </tbody>
        </Table>
      </Widget>
    );
  }
}
