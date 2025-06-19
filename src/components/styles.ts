import { createGlobalStyle } from "styled-components";
import { FONT_FACE_RULE } from "../types";

export const IconStyles = createGlobalStyle`
  ${FONT_FACE_RULE};

  .icon {
    font-family: "schematic-icons";
    font-style: normal;
    font-weight: normal;
    font-variant: normal;
    text-transform: none;
    line-height: 1;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    &:before {
      display: inline-block;
    }
  }
`;
