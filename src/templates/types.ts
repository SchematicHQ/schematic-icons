/**
 * Generates TypeScript type definitions for the icon set
 */
export function generateTypeDefinitions(
  codepoints: Record<string, number>,
): string {
  const iconNames = Object.keys(codepoints);
  const unionType = iconNames.map((name) => `'${name}'`).join(" | ");

  const iconMapEntries = Object.entries(codepoints)
    .map(([name, code]) => `    '${name}': ${code}`)
    .join(",\n");

  return `// This file is auto-generated. Do not edit manually.

/**
 * Available icon names in the icon font
 */
export type IconNames = ${unionType};

/**
 * Map of icon names to their Unicode codepoints
 */
export const iconsList = {
${iconMapEntries}
} as const;

`;
}
