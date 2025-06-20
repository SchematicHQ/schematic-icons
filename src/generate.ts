import { join } from "path";

import {
  FontAssetType,
  OtherAssetType,
  generateFonts,
  type RunnerOptions,
} from "fantasticon";
import fsExtra from "fs-extra";

import { generateTypeDefinitions } from "./templates/types.js";

async function generateIconFont(): Promise<void> {
  const options: RunnerOptions = {
    name: "schematic-icons",
    inputDir: "./src/svg",
    outputDir: "./dist",
    fontTypes: [FontAssetType.TTF],
    assetTypes: [OtherAssetType.CSS, OtherAssetType.JSON],
    formatOptions: {
      json: {
        indent: 2,
      },
      svg: {
        centerHorizontally: true,
        centerVertically: true,
      },
    },
    prefix: "icon",
    normalize: false,
    descent: 50,
  };

  await fsExtra.ensureDir(options.outputDir);
  const result = await generateFonts(options);

  // Generate types using our template
  const typeContent = generateTypeDefinitions(result.codepoints);
  await fsExtra.writeFile(join("src", "types.ts"), typeContent);

  // Embed TTF as base64 in CSS
  const ttfPath = join(options.outputDir, `${options.name}.ttf`);
  const ttfBase64 = await fsExtra.readFile(ttfPath, { encoding: "base64" });

  // Replace the placeholder in types.ts with the actual base64 data
  const typesPath = join("src", "types.ts");
  let typesContent = await fsExtra.readFile(typesPath, "utf8");
  typesContent = typesContent.replace("{{assets.ttf}}", ttfBase64);
  await fsExtra.writeFile(typesPath, typesContent, "utf8");

  const cssPath = join(options.outputDir, `${options.name}.css`);
  let cssContent = await fsExtra.readFile(cssPath, "utf8");

  cssContent = cssContent.replace(
    /url\((.*?)\)/,
    `url(data:font/truetype;charset=utf-8;base64,${ttfBase64})`,
  );

  await fsExtra.writeFile(cssPath, cssContent, "utf8");
  await fsExtra.remove(ttfPath);
}

generateIconFont().catch(console.error);
