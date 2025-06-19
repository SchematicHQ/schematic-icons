import { IconNames, iconsList } from "../types";
import styled from "styled-components";

export interface IconProps extends React.HTMLAttributes<HTMLElement> {
  name: IconNames;
}

const StyledIcon = styled.i<{ $name: IconNames }>`
  &:before {
    content: "\\${(props) =>
      iconsList[props.$name].toString(16).padStart(4, "0")}";
  }
`;

export const Icon: React.FunctionComponent<IconProps> = ({
  name,
  className = "",
  ...rest
}) => {
  return (
    <StyledIcon
      $name={name}
      className={`icon icon-${name} ${className}`}
      {...rest}
    />
  );
};
