import { generateFonts, FontAssetType, OtherAssetType } from 'fantasticon';
import fsExtra from 'fs-extra';
import { join } from 'path';
import { generateTypeDefinitions } from './templates/types.js';

interface IconFontOptions {
  name: string;
  inputDir: string;
  outputDir: string;
  fontTypes?: FontAssetType[];
  assetTypes?: OtherAssetType[];
  prefix?: string;
  tag?: string;
  descent?: number;
  normalize?: boolean;
}

async function generateIconFont(): Promise<void> {
  const options: IconFontOptions = {
    name: 'schematic-icons',
    inputDir: './src/svg',
    outputDir: './dist',
    fontTypes: [FontAssetType.TTF],
    assetTypes: [OtherAssetType.CSS, OtherAssetType.JSON],
    prefix: 'icon',
    normalize: true
  };

  await fsExtra.ensureDir(options.outputDir);
  const result = await generateFonts(options);

  // Generate types using our template
  const typeContent = generateTypeDefinitions(result.codepoints);
  await fsExtra.writeFile(join('src', 'types.ts'), typeContent);

  // Embed TTF as base64 in CSS
  const ttfPath = join(options.outputDir, `${options.name}.ttf`);
  const ttfBase64 = await fsExtra.readFile(ttfPath, { encoding: 'base64' });

  const cssPath = join(options.outputDir, `${options.name}.css`);
  let cssContent = await fsExtra.readFile(cssPath, 'utf8');

  cssContent = cssContent.replace(
    /url\((.*?)\)/,
    `url(data:font/truetype;charset=utf-8;base64,${ttfBase64})`
  );

  await fsExtra.writeFile(cssPath, cssContent, 'utf8');
  await fsExtra.remove(ttfPath);
}

generateIconFont().catch(console.error); 