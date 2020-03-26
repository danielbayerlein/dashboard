import React, { Component } from "react";
import tinytime from "tinytime";
import styled from "styled-components";
import Widget from "../../Widget";
import { IDateTimeProps, IDateTimeState } from "./datetime-model";

const TimeItem = styled.div`
  font-size: 4em;
  text-align: center;
`;

const DateItem = styled.div`
  font-size: 1.5em;
  text-align: center;
`;

export default class DateTime extends Component<
  IDateTimeProps,
  IDateTimeState
> {
  static defaultProps = {
    interval: 1000 * 10,
  };

  state = {
    date: new Date(),
  };

  interval: any = 0;

  componentDidMount() {
    const { interval } = this.props;

    this.interval = setInterval(() => this.updateTime(), interval);
  }

  updateTime() {
    this.setState({ date: new Date() });
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    const { date } = this.state;
    return (
      <Widget error={false} loading={false} title={"DateTime"}>
        <TimeItem>{tinytime("{H}:{mm}").render(date)}</TimeItem>
        <DateItem>{tinytime("{DD}.{Mo}.{YYYY}").render(date)}</DateItem>
      </Widget>
    );
  }
}
