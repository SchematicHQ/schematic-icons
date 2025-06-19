/**
 * Generates TypeScript type definitions for the icon set
 */
export function generateTypeDefinitions(
  codepoints: Record<string, number>
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

/**
 * Font-face rule for the icon font
 */
export const FONT_FACE_RULE = \`@font-face {
  font-family: "schematic-icons";
  src: url(data:font/truetype;charset=utf-8;base64,{{assets.ttf}}) format("truetype");
}\`;
`;
}

/**
 * Generates the font-face rule with the provided base64 font data
 */
export function generateFontFaceRule(base64FontData: string): string {
  return `@font-face {
  font-family: "schematic-icons";
  src: url(data:font/truetype;charset=utf-8;base64,${base64FontData}) format("truetype");
}`;
}
