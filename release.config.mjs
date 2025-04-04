// @ts-check
/** @type {import('semantic-release').GlobalConfig} */
export default {
  repositoryUrl: "https://github.com/SchematicHQ/schematic-icons.git",
  tagFormat: "v${version}",
  branches: [
    "main",
    {
      name: "next",
      prerelease: true,
    },
  ],
  plugins: [
    "@semantic-release/commit-analyzer",
    "@semantic-release/release-notes-generator",
    "@semantic-release/changelog",
    "@semantic-release/npm",
    [
      "@semantic-release/github",
      {
        "assets": [
          { "path": ["dist/**", "LICENSE", "README.md"], "label": "Schematic Icons" },
        ]
      }
    ],
    ["@semantic-release/git", {
      "assets": ["CHANGELOG.md", "package.json", "package-lock.json"],
      "message": "chore(release): ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}"
    }]
  ],
};
