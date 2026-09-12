# Running this locally in VS Code

This zip has all the source code and config (including everything changed
today: the About page ecosystem section, and the OpenBuildWeek page hero,
resource cards, and community-champions redesign).

To keep the download small, two large, UNCHANGED media folders were left out:

- `Images/` (top-level)
- `public/images/` and `public/brand-kit/`

Copy those three folders in from your existing project (e.g. your `hk4`
folder) into the same spots here before running, or just unzip this on top
of your existing project folder so those directories stay put.

## Setup

```
npm install
npm run dev
```

Then open the local URL Vite prints (usually http://localhost:5173).

To build for production:

```
npm run build
```
