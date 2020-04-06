import React, { Component } from "react";
import styled from "styled-components";
import fetch from "isomorphic-unfetch";
import Widget from "../../Widget";
import Table, { Td, Th } from "../../Table";
import Badge from "../../Badge";
import { basicAuthHeader } from "../../../lib/auth";
import { ISonarQubeProps, ISonarQubeState } from "./sonarqube-model";

const alertColor = ({ theme, children }) => {
  switch (children) {
    case "ERROR":
      return theme.palette.errorColor;
    case "WARN":
      return theme.palette.warnColor;
    default:
      // OK
      return theme.palette.successColor;
  }
};
const Alert = styled.span`
  color: ${alertColor};
`;

const sonarBadgeColor = ({ theme, children }) => {
  switch (children) {
    case "A":
      return theme.palette.successColor;
    case "B":
      return theme.palette.successSecondaryColor;
    case "C":
      return theme.palette.warnColor;
    case "D":
      return theme.palette.warnSecondaryColor;
    case "E":
      return theme.palette.errorColor;
    default:
      return "transparent";
  }
};
const SonarBadge = styled(Badge)`
  background-color: ${sonarBadgeColor};
`;

export default class SonarQube extends Component<
  ISonarQubeProps,
  ISonarQubeState
> {
  static defaultProps = {
    interval: 1000 * 60 * 5,
    title: "SonarQube",
  };

  state = {
    measures: [],
    loading: true,
    error: false,
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
    const { authKey, url, componentKey } = this.props;
    const opts = authKey ? { headers: basicAuthHeader(authKey) } : {};

    // https://docs.sonarqube.org/display/SONAR/Metric+Definitions
    const metricKeys = [
      "alert_status",
      "reliability_rating",
      "bugs",
      "security_rating",
      "vulnerabilities",
      "sqale_rating",
      "code_smells",
      "coverage",
      "duplicated_lines_density",
    ].join(",");

    try {
      const res = await fetch(
        `${url}/api/measures/component?componentKey=${componentKey}&metricKeys=${metricKeys}`,
        opts
      );
      const json = await res.json();

      this.setState({
        error: false,
        loading: false,
        measures: json.component.measures,
      });
    } catch (error) {
      this.setState({ error: true, loading: false });
    } finally {
      this.timeout = setTimeout(
        () => this.fetchInformation(),
        this.props.interval
      );
    }
  }

  getMetricValue = (measures, metricKey: string) => {
    const result = measures.filter((measure) => measure.metric === metricKey);
    return result.length ? result[0].value : "";
  };

  getRatingValue = (measures, metricKey: string) => {
    const value = this.getMetricValue(measures, metricKey);

    switch (value) {
      case "1.0":
        return "A";
      case "2.0":
        return "B";
      case "3.0":
        return "C";
      case "4.0":
        return "D";
      case "5.0":
        return "E";
    }

    return "?";
  };

  render() {
    const { error, loading, measures } = this.state;
    const { title } = this.props;

    const alertStatus = this.getMetricValue(measures, "alert_status");
    const reliabilityRating = this.getRatingValue(
      measures,
      "reliability_rating"
    );
    const bugs = this.getMetricValue(measures, "bugs");
    const securityRating = this.getRatingValue(measures, "security_rating");
    const vulnerabilities = this.getMetricValue(measures, "vulnerabilities");
    const sqaleRating = this.getRatingValue(measures, "sqale_rating");
    const codeSmells = this.getMetricValue(measures, "code_smells");
    const coverage = this.getMetricValue(measures, "coverage");
    const duplicatedLinesDensity = this.getMetricValue(
      measures,
      "duplicated_lines_density"
    );

    return (
      <Widget title={title} loading={loading} error={error}>
        <Table>
          <tbody>
            <tr>
              <Th>Quality Gate:</Th>
              <Td>
                <Alert>{alertStatus}</Alert>
              </Td>
            </tr>

            <tr>
              <Th>Reliability:</Th>
              <Td>
                <SonarBadge>{reliabilityRating}</SonarBadge>{" "}
                <small>({bugs})</small>
              </Td>
            </tr>

            <tr>
              <Th>Security:</Th>
              <Td>
                <SonarBadge>{securityRating}</SonarBadge>{" "}
                <small>({vulnerabilities})</small>
              </Td>
            </tr>

            <tr>
              <Th>Maintainability:</Th>
              <Td>
                <SonarBadge>{sqaleRating}</SonarBadge>{" "}
                <small>({codeSmells})</small>
              </Td>
            </tr>

            <tr>
              <Th>Coverage:</Th>
              <Td>{coverage}%</Td>
            </tr>

            <tr>
              <Th>Duplications:</Th>
              <Td>{duplicatedLinesDensity}%</Td>
            </tr>
          </tbody>
        </Table>
      </Widget>
    );
  }
}
