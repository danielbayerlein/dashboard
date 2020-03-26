import styled, { keyframes } from "styled-components";
import React, { Component } from "react";

const rotation: string = keyframes`
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(270deg);
  }
`;

const turn: string = keyframes`
  0% {
    stroke-dashoffset: 187;
  }

  50% {
    stroke-dashoffset: 46.75;
    transform: rotate(135deg);
  }

  100% {
    stroke-dashoffset: 187;
    transform: rotate(450deg);
  }
`;

const Svg = styled.svg`
  animation: ${rotation} 1.4s linear infinite;
  height: ${(props) => props.size};
  width: ${(props) => props.size};
`;

const Circle = styled.circle`
  animation: ${turn} 1.4s ease-in-out infinite;
  fill: none;
  stroke: ${(props) => props.theme.palette.primaryColor};
  stroke-dasharray: 187;
  stroke-dashoffset: 0;
  stroke-linecap: round;
  stroke-width: 6;
  transform-origin: center;
`;

export default class LoadingIndicator extends Component<{ size: string }, {}> {
  render() {
    const svgSize = this.props.size === "small" ? "1.75em" : "5em";
    return (
      <Svg viewBox="0 0 66 66" size={svgSize}>
        <Circle cx="33" cy="33" r="30" />
      </Svg>
    );
  }
}
