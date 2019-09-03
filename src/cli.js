#!/usr/bin/env node

const path = require('path')
const fs = require('fs')
const internalIp = require('internal-ip')
const express = require('express')
const serveIndex = require('serve-index')
const walkDir = require('./walkDir').walkDir

const sourceDirWebapp = path.join(__dirname, './../dist')
const entryFiles = path.join(sourceDirWebapp, './index.html')

const app = express()

// serve raw files
app.get('/___raw___*', (req, res, next) => {
  const filePath = req.path.replace(`/___raw___/`, ``)
  const filePathFinal = path.resolve(path.join('.', unescape(filePath)))
  res.sendFile(filePathFinal)
})
// serve filesystem structure
var dirs = []
(async () => { // continuously poll fs updates
  while (true) {
    const [_, list] = await walkDir('.')
    dirs = list
    await new Promise( res => setTimeout(res, 5000))
  }
})()
app.get('/___dirs___', async (req, res, next) => {
  res.json(dirs).end()
})

app.get('/*.md', (req, res, next) => {
  res.sendFile(entryFiles)
})
app.use(serveIndex('./', {
  filter: (filename, index, files, dir) => {
    const blacklist = [ 'caccuino-bundle' ]
    return !blacklist.includes(filename)
  }
}))
app.use(express.static(sourceDirWebapp))
app.use(express.static(path.resolve('.')))

const port = process.env['PORT'] || 8080
app.listen(port)

const open = require('open')
open(`http://${ internalIp.v4.sync() || "localhost" }:${ port }`)