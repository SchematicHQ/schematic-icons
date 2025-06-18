import { createGlobalStyle } from "styled-components";
import { IconNames, iconsList, FONT_FACE_RULE } from "../types";
import { createContext, useContext } from "react";
import styled from "styled-components";

export interface IconProps extends React.HTMLAttributes<HTMLElement> {
  name: IconNames;
}

export const GlobalStyle = createGlobalStyle`
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

// Simple DOM-based check for existing styles
const hasSchematicIconsInDOM = (): boolean => {
  if (typeof document === "undefined") return false;

  // Check if any style tag contains our font-face rule
  const styleTags = document.querySelectorAll("style");
  for (let i = 0; i < styleTags.length; i++) {
    const styleTag = styleTags[i];
    if (
      styleTag &&
      styleTag.textContent?.includes('font-family: "schematic-icons"')
    ) {
      return true;
    }
  }
  return false;
};

// Context to track if global styles have been injected
const IconContext = createContext<{ stylesInjected: boolean }>({
  stylesInjected: false,
});

// Provider component to wrap the app
export const IconProvider: React.FunctionComponent<{
  children: React.ReactNode;
}> = ({ children }) => {
  const parentContext = useContext(IconContext);

  // Check both local context and DOM
  const alreadyInjected =
    parentContext.stylesInjected || hasSchematicIconsInDOM();

  if (alreadyInjected) {
    return <>{children}</>;
  }

  return (
    <IconContext.Provider value={{ stylesInjected: true }}>
      <GlobalStyle />
      {children}
    </IconContext.Provider>
  );
};


const StyledIcon = styled.i<{ $name: IconNames }>`
  &:before {
    content: "\\${props => iconsList[props.$name].toString(16).padStart(4, "0")}";
  }
`;

export const Icon: React.FunctionComponent<IconProps> = ({
  name,
  className = "",
  ...rest
}) => {
  const context = useContext(IconContext);

  // Check both local context and DOM
  const stylesInjected = context.stylesInjected || hasSchematicIconsInDOM();

  return (
    <>
      {!stylesInjected && <GlobalStyle />}
      <StyledIcon $name={name} className={`icon icon-${name} ${className}`} {...rest} />
    </>
  );
};

export default Icon;
