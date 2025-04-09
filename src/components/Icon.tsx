import { IconNames } from "../types";
import "../../dist/schematic-icons.css";

export interface IconProps extends React.HTMLAttributes<HTMLElement> {
  name: IconNames;
}

export const Icon: React.FunctionComponent<IconProps> = ({
  name,
  className = "",
  style,
  ...rest
}) => {
  return (
    <i className={`icon icon-${name} ${className}`} style={style} {...rest} />
  );
};

export default Icon;
