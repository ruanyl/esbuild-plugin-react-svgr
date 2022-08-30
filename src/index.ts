import fs from 'fs'
import path from 'path'
import { Config, transform } from '@svgr/core'
import { Plugin } from 'esbuild'

interface Options {
  exportUrl?: boolean
}

export default function svgrPlugin(
  svgrConfig: Config = {},
  options: Options = { exportUrl: false }
): Plugin {
  return {
    name: 'svgr',
    setup(build) {
      build.onResolve({ filter: /\.svg$/ }, async (args) => {
        return {
          path: path.join(args.resolveDir, args.path),
          namespace: args.pluginData?.svgr === false ? 'file' : 'svgr',
        }
      })

      build.onLoad({ filter: /\.svg$/, namespace: 'svgr' }, async (args) => {
        const svg = await fs.promises.readFile(args.path, 'utf8')
        const resolveDir = path.dirname(args.path)
        let exportType = svgrConfig.exportType

        if (options.exportUrl) {
          exportType = 'named'
        }

        let contents = await transform(
          svg,
          { ...svgrConfig, exportType },
          { filePath: args.path }
        )

        if (options.exportUrl) {
          contents =
            `import url from "./${path.relative(resolveDir, args.path)}"\n` +
            contents
          contents = contents + '\nexport default url'
        }
        return {
          contents,
          loader: svgrConfig.typescript ? 'tsx' : 'jsx',
          resolveDir: resolveDir,
          pluginData: { svgr: false },
        }
      })
    },
  }
}
