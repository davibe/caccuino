#!/usr/bin/env node

const Bundler = require('parcel-bundler')
const path = require('path')
const ncp = require('ncp').ncp
const internalIp = require('internal-ip')

const sourceDir = path.join(__dirname, './caccuino-bundle')
const targetDir = path.resolve(process.cwd())
const bundleDir = path.join(targetDir, './caccuino-bundle')

const entryFiles = path.join(bundleDir, './index.html')

// Bundler options
const options = {
  outDir: './caccuino-bundle/dist', // The out directory to put the build files in, defaults to dist
  publicUrl: '/', // The url to serve on, defaults to '/'
  watch: true, // Whether to watch the files and rebuild them on change, defaults to process.env.NODE_ENV !== 'production'
  cache: false, // Enabled or disables caching, defaults to true
  cacheDir: '.cache', // The directory cache gets put in, defaults to .cache
  contentHash: false, // Disable content hash from being included on the filename
  global: 'moduleName', // Expose modules as UMD under this name, disabled by default
  minify: false, // Minify files, enabled if process.env.NODE_ENV === 'production'
  scopeHoist: false, // Turn on experimental scope hoisting/tree shaking flag, for smaller production bundles
  target: 'browser', // Browser/node/electron, defaults to browser
  bundleNodeModules: true, // By default, package.json dependencies are not included when using 'node' or 'electron' with 'target' option above. Set to true to adds them to the bundle, false by default
  logLevel: 3, // 5 = save everything to a file, 4 = like 3, but with timestamps and additionally log http requests to dev server, 3 = log info, warnings & errors, 2 = log warnings & errors, 1 = log errors
  hmr: true, // Enable or disable HMR while watching
  hmrPort: 0, // The port the HMR socket runs on, defaults to a random free port (0 in node.js resolves to a random free port)
  sourceMaps: true, // Enable or disable sourcemaps, defaults to enabled (minified builds currently always create sourcemaps)
  hmrHostname: '', // A hostname for hot module reload, default to ''
  detailedReport: true, // Prints a detailed report of the bundles, assets, filesizes and times, defaults to false, reports are only printed if watch is disabled
  autoInstall: true, // Enable or disable auto install of missing dependencies found during bundling
}

// Initializes a bundler using the entrypoint location and options provided
console.log(`Copying ${sourceDir} to ${bundleDir} ...`)

ncp(sourceDir, bundleDir, (e) => {
  if (e) {
    console.error(e)
    return
  }

  console.log(`Entry file: ${entryFiles}`)

  const bundler = new Bundler(entryFiles, options)
  bundler.addAssetType(
    '.md', require.resolve('parcel-plugin-markdown-it/MarkdownAsset.js')
  )

  const express = require('express')
  const serveIndex = require('serve-index')
  const app = express()
  const bundlerMiddleware = bundler.middleware()
  app.get('/*.md', bundlerMiddleware)
  app.use(serveIndex('./', {
    filter: (filename, index, files, dir) => {
      const blacklist = [
        'node_modules',
        'caccuino-bundle',
        'dist',
        'package-lock.json',
        'package.json'
      ]
      return !blacklist.includes(filename)
    }
  }))
  app.use(express.static('./dist'))
  app.use(express.static('./'))
  app.use(bundlerMiddleware)
  app.listen(8080)
  const open = require('open')
  open(`http://${internalIp.v4.sync() || "localhost"}:8080`)
})

