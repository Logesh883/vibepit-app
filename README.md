# VibePit: website and downloads

The VibePit website (`index.html`, the setup guide in `setup.html` and the release notes in `release-notes.html`) and the app's releases. VibePit is the pit wall for vibe coders: one window for your Claude Code sessions on the Mac.

**Download:** [Apple silicon](https://github.com/Logesh883/vibepit-app/releases/latest/download/VibePit-arm64.dmg) · [Intel](https://github.com/Logesh883/vibepit-app/releases/latest/download/VibePit-x86_64.dmg) · [all versions](https://github.com/Logesh883/vibepit-app/releases)

No source code lives here. Releases are built and published by the app's own (private) repository: pushing a version tag there builds both disk images and creates the release here. The Download buttons on the site point at `releases/latest/download/…`, so they always serve the newest version.

`.github/workflows/pages.yml` publishes the site with GitHub Pages on every push to `main`.
