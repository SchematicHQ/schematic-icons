export function generateTypeDefinitions(
  codepoints: Record<string, number>,
): string {
  const iconNames = Object.keys(codepoints);
  const unionType = iconNames.map((name) => `'${name}'`).join(" | ");
  const iconMapEntries = Object.entries(codepoints)
    .map(([name, code]) => `  '${name}': ${code}`)
    .join(",\n");

  return `// This file is auto-generated. Do not edit manually.

export type IconNames = ${unionType};

export const iconsList = {
${iconMapEntries}
} as const;

export const FONT_FACE_RULE = \`@font-face {
  font-family: "schematic-icons";
  src: url(data:font/truetype;charset=utf-8;base64,{{assets.ttf}}) format("truetype");
}\`;
`;
}

export function generateFontFaceRule(base64FontData: string): string {
  return `@font-face {
  font-family: "schematic-icons";
  src: url(data:font/truetype;charset=utf-8;base64,${base64FontData}) format("truetype");
}`;
}
