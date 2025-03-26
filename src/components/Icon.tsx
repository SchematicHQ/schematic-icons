import React from 'react';
import { IconNames } from '../types';
import '../../dist/schematic-icons.css';

/**
 * Props for the Icon component
 */
interface IconProps {
  /** The name of the icon to display */
  name: IconNames;
  /** Additional CSS classes to apply to the icon */
  className?: string;
  /** Additional CSS styles to apply to the icon */
  style?: React.CSSProperties;
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
export const Icon = ({ name, className = '', style }: IconProps) => {
  return (
    <i
      className={`icon icon-${name} ${className}`}
      style={style}
    />
  );
};

export type { IconProps };
export default Icon; 