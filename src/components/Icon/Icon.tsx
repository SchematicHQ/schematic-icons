import { type IconNames } from "../../types";

import { StyledIcon } from "./styles";

export interface IconProps extends React.HTMLAttributes<HTMLElement> {
  name: IconNames;
}

export const Icon = ({ name, className = "", ...rest }: IconProps) => {
  return (
    <StyledIcon
      className={`icon icon-${name} ${className}`}
      $name={name}
      {...rest}
    />
  );
};
