#!/usr/bin/env node

const path = require('path')
const fs = require('fs')
const internalIp = require('internal-ip')
const express = require('express')
const serveIndex = require('serve-index')
const walkDir = require('./walkDir').walkDir
const puppeteer = require('puppeteer')

const sourceDirWebapp = path.join(__dirname, './../dist')
const entryFiles = path.join(sourceDirWebapp, './index.html')

const app = express()

// serve raw files
app.get('/___raw___*', (req, res, next) => {
  const filePath = req.path.replace(`/___raw___/`, ``)
  const filePathFinal = path.resolve(path.join('.', unescape(filePath)))
  res.sendFile(filePathFinal)
})
app.get('/___pdf___*', async (req, res, next) => {
  const filePath = req.path.replace(`/___pdf___/`, ``)
  const url = `http://127.0.0.1:${port}/${filePath}`
  const browser = await puppeteer.launch({
    headless: false,
    args: ['--no-sandbox', '--disable-gpu']
  })
  const page = await browser.newPage()
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 })
  await page.setJavaScriptEnabled(true)
  await page.goto(
    url,
    {
      waitUntil: "networkidle0"
    }
  )
  const buffer = await page.pdf({
    format: "A4",
    printBackground: true,
    margin: {
      top: "2cm",
      bottom: "2cm"
    }
  })
  res.type('application/pdf')
  res.send(buffer)
  await browser.close()
})
// serve filesystem structure
var dirs = [];
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
app.get('*', (req, res, next) => {
  const path = req.path.substr(1)
  const isFile = (path) => fs.existsSync(path) && fs.statSync(path).isFile()
  if (!isFile(path) && isFile(`${path}.md`)) {
    res.redirect(`${req.path}.md`)
    return
  }
  next()
})

app.use(serveIndex('./', {
  filter: (filename, index, files, dir) => {
    const blacklist = [ 'caccuino-bundle' ]
    return !blacklist.includes(filename)
  },
  icons: true
}))
app.use(express.static(sourceDirWebapp))
app.use(express.static(path.resolve('.')))

const port = process.env['PORT'] || 8080
const host = process.env['HOST'] || ""
app.listen(port, host)

const open = require('open')
open(`http://${ internalIp.v4.sync() || "localhost" }:${ port }`)