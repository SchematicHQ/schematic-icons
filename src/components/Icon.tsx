import React, { CSSProperties, HTMLAttributes } from "react";
import { IconNames } from "../types";
import "../../dist/schematic-icons.css";

/**
 * Props for the Icon component
 */
interface IconProps extends HTMLAttributes<HTMLElement> {
  /** The name of the icon to display */
  name: IconNames;
  /** Additional CSS classes to apply to the icon */
  className?: string;
  /** Additional CSS styles to apply to the icon */
  style?: CSSProperties;
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
export const Icon = ({ name, className = "", style, ...rest }: IconProps) => {
  return (
    <i className={`icon icon-${name} ${className}`} style={style} {...rest} />
  );
};

export type { IconProps };
export default Icon;
