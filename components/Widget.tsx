import styled from "styled-components";
import { size } from "polished";
import LoadingIndicator from "./LoadingIndicator";
import ErrorIcon from "./ErrorIcon";
import { Component } from "react";
import React from "react";

const Container = styled.div`
  ${size("20em")}
  align-items: center;
  background-color: ${(props) => props.theme.palette.canvasColor};
  border: 1px solid ${(props) => props.theme.palette.borderColor};
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin: 1em;
  padding: 1em;
`;

const Title = styled.h1`
  text-align: center;
`;

export default class Widget extends Component<
  { error: boolean; loading: boolean; title: string },
  {}
> {
  render() {
    const { loading, children, error, title } = this.props;

    let content;

    if (loading) {
      content = <LoadingIndicator size="medium" />;
    } else if (error) {
      content = <ErrorIcon />;
    } else {
      content = <div>{children}</div>;
    }

    return (
      <Container>
        {title ? <Title>{title}</Title> : ""}
        {content}
      </Container>
    );
  }
}
