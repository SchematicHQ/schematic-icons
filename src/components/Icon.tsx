import { createGlobalStyle } from "styled-components";
import { IconNames, iconsList, FONT_FACE_RULE } from "../types";
import { useEffect, useState } from "react";

export interface IconProps extends React.HTMLAttributes<HTMLElement> {
  name: IconNames;
}

export const GlobalStyle = createGlobalStyle`
  ${FONT_FACE_RULE}
`;


export const Icon: React.FunctionComponent<IconProps> = ({
  name,
  className = "",
  style,
  ...rest
}) => {
  const charMap = iconsList;
  return (
    <>
      <GlobalStyle />
      <i
        className={className}
        style={{
          ...style,
          fontFamily: "schematic-icons",
          fontStyle: "normal",
          fontWeight: "normal",
          fontVariant: "normal",
          textTransform: "none",
          lineHeight: "1",
        }}
        {...rest}
      >
        {String.fromCharCode(charMap[name])}
      </i>
    </>
  );
};

export default Icon;
