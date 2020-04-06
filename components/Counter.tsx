import styled from "styled-components";
import React from "react";

const Counter = styled.div`
  font-size: 4em;
  color: ${(props) => props.theme.palette.accentColor};
`;

export default ({ value }) => <Counter>{value}</Counter>;
