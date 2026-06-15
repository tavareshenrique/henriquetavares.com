# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.1.1] - 2026-06-15

### Security

- Upgrade `astro` from 5.18.1 to 6.1.10 to fix [GHSA-xr5h-phrj-8vxv](https://github.com/advisories/GHSA-xr5h-phrj-8vxv) / CVE-2026-45028 ([Dependabot #218](https://github.com/tavareshenrique/henriquetavares.com/security/dependabot/218))

### Changed

- Migrate content collections from Astro 5 legacy API to Astro 6 Content Layer (`src/content.config.ts` with `glob` loader)
