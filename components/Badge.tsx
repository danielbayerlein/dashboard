import styled from "styled-components";
import { size } from "polished";

export default styled.span`
  ${size("1.75em")}
  background-color: transparent;
  border-radius: 50%;
  color: ${(props) => props.theme.palette.textInvertColor};
  display: inline-block;
  line-height: 1.75em;
  text-align: center;
`;
