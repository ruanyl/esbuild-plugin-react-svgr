/* eslint-disable @typescript-eslint/naming-convention */
import path from 'path'
import { build } from 'esbuild'

import svgrPlugin from '../index'

describe('build svg entry point with svgr', () => {
  it('should transform svg to React component with default export', async () => {
    const result = await build({
      absWorkingDir: path.join(__dirname, 'fixtures'),
      entryPoints: ['./logo.svg'],
      plugins: [svgrPlugin()],
      outdir: 'dist',
      write: false,
    })
    expect(result.errors).toHaveLength(0)
    expect(result.warnings).toHaveLength(0)
    expect(result.outputFiles).toHaveLength(1)

    const [file] = result.outputFiles
    expect(file.path.endsWith('dist/logo.js')).toBe(true)
    expect(file.text).toContain('export default SvgLogo')
  })

  it('should transform svg to React component with named export', async () => {
    const result = await build({
      absWorkingDir: path.join(__dirname, 'fixtures'),
      entryPoints: ['./logo.svg'],
      plugins: [svgrPlugin({ exportType: 'named' })],
      outdir: 'dist',
      write: false,
    })
    expect(result.errors).toHaveLength(0)
    expect(result.warnings).toHaveLength(0)
    expect(result.outputFiles).toHaveLength(1)

    const [file] = result.outputFiles
    expect(file.path.endsWith('dist/logo.js')).toBe(true)
    expect(file.text).toContain('export { SvgLogo as ReactComponent }')
  })
})

describe('build svg import with svgr', () => {
  it('should bundle svg import to a React component with default export', async () => {
    const result = await build({
      absWorkingDir: path.join(__dirname, 'fixtures'),
      entryPoints: ['./logo.ts'],
      plugins: [svgrPlugin()],
      bundle: true,
      outdir: 'dist',
      write: false,
      external: ['react'],
    })
    expect(result.errors).toHaveLength(0)
    expect(result.warnings).toHaveLength(0)
    expect(result.outputFiles).toHaveLength(1)

    const [file] = result.outputFiles
    expect(file.path.endsWith('dist/logo.js')).toBe(true)
  })

  it('should bundle svg import to a React component with named export', async () => {
    const result = await build({
      absWorkingDir: path.join(__dirname, 'fixtures'),
      entryPoints: ['./logo.named.ts'],
      plugins: [svgrPlugin({ exportType: 'named' })],
      bundle: true,
      outdir: 'dist',
      write: false,
      external: ['react'],
    })
    expect(result.errors).toHaveLength(0)
    expect(result.warnings).toHaveLength(0)
    expect(result.outputFiles).toHaveLength(1)

    const [file] = result.outputFiles
    expect(file.path.endsWith('dist/logo.named.js')).toBe(true)
  })
})

describe('build svg import to url', () => {
  it('should bundle svg import to a React component with url export', async () => {
    const result = await build({
      absWorkingDir: path.join(__dirname, 'fixtures'),
      entryPoints: ['./logo.url.ts'],
      plugins: [svgrPlugin({}, { exportUrl: true })],
      bundle: true,
      outdir: 'dist',
      write: false,
      external: ['react'],
      loader: {
        '.svg': 'file',
      },
    })
    expect(result.errors).toHaveLength(0)
    expect(result.warnings).toHaveLength(0)
    expect(result.outputFiles).toHaveLength(2)

    const [svgFile, jsFile] = result.outputFiles
    expect(svgFile.path.endsWith('.svg')).toBe(true)
    expect(jsFile.path.endsWith('dist/logo.url.js')).toBe(true)
  })

  it('should bundle svg import to file url', async () => {
    const result = await build({
      absWorkingDir: path.join(__dirname, 'fixtures'),
      entryPoints: ['./logo.url.only.ts'],
      plugins: [svgrPlugin({}, { exportUrl: true })],
      bundle: true,
      outdir: 'dist',
      write: false,
      external: ['react'],
      loader: {
        '.svg': 'file',
      },
    })
    expect(result.errors).toHaveLength(0)
    expect(result.warnings).toHaveLength(0)
    expect(result.outputFiles).toHaveLength(2)

    const [svgFile, jsFile] = result.outputFiles
    expect(svgFile.path.endsWith('.svg')).toBe(true)
    expect(jsFile.path.endsWith('dist/logo.url.only.js')).toBe(true)
  })
})
