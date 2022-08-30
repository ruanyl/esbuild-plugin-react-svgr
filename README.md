# esbuild-plugin-svgr

### Usage

```typescript
import { build } from 'esbuild'

build({
  entryPoints: ['./logo.svg'],
  plugins: [svgrPlugin()],
  outdir: 'dist',
})
// Output ==============>
import * as React from "react";
const SvgLogo = (props) => /* @__PURE__ */ React.createElement("svg", {...});
export default SvgLogo;
```

Build with svgr options

```typescript
import { build } from 'esbuild'

build({
  entryPoints: ['./logo.svg'],
  plugins: [svgrPlugin({exportType: 'named'})],
  outdir: 'dist',
})

// Output ==============>
import * as React from "react";
const SvgLogo = (props) => /* @__PURE__ */ React.createElement("svg", {...});
export { SvgLogo as ReactComponent };
```

Enable url export:
```typescript
// index.ts
import url, { ReactComponent } from './logo.svg'
```

```typescript
import { build } from 'esbuild'

build({
  entryPoints: ['./index.ts'],
  plugins: [svgrPlugin({}, {exportUrl: true})],
  outdir: 'dist',
  bundle: true,
  loader: {
    '.svg': 'file',
  },
})

// Output ==============>
// logo.svg
var logo_default = "./logo-4YCDN2WN.svg";


// svgr:/Users/yulongruan/project/esbuild-plugin-svgr/src/__test__/fixtures/logo.svg
var React = __toESM(__require("react"));
var SvgLogo = (props) => /* @__PURE__ */ React.createElement("svg", {...});

var logo_default2 = logo_default;
```
