import { IconNames } from "../types";
import "../../dist/schematic-icons.css";

export interface IconProps extends React.HTMLAttributes<HTMLElement> {
  name: IconNames;
}

/**
 * Icon component that displays a schematic icon
 *
 * @example
 * ```tsx
 * <Icon name="check" />
 * <Icon name="arrow-right" className="my-icon" />
 * <Icon name="close" style={{ color: 'red' }} />
 * ```
 */
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
