import '../*.css'
import 'markdown-it-highlight/dist/index.css'
var pages = require(`../**/*.md`)

// move to renderer.ts
const MarkdownIt = require('markdown-it')
const Meta = require('markdown-it-meta')
const hljs = require('markdown-it-highlight').default

//import { awaitRenderAvailable } from "markdown-it-diagrams"
//import { diagramPlugin } from "markdown-it-diagrams"
// const Mermaid = require("mermaid")

// function diagramPlugin(md: any, options: any) {
//   // Setup Mermaid
//   Mermaid.initialize({});

//   function getLangName(info: string): string {
//     return info.split(/\s+/g)[0];
//   }

//   // Store reference to original renderer.
//   let defaultFenceRenderer = md.renderer.rules.fence;

//   // Render custom code types as SVGs, letting the fence parser do all the heavy lifting.
//   function customFenceRenderer(tokens: any[], idx: number, options: any, env: any, slf: any) {
//     let token = tokens[idx];
//     let info = token.info.trim();
//     let langName = info ? getLangName(info) : "";
//     let imageHTML: string = "";
//     let imageAttrs: any[] = [];

//     // Only handle custom token
//     switch (langName) {
//       case "mermaid": {
//         const element = document.createElement("div");
//         document.body.appendChild(element);

//         // Render with Mermaid
//         try {
//           const container_id = "mermaid-container";
//           Mermaid.mermaidAPI.render(container_id, token.content, (html: string) => {
//             // We need to forcibly extract the max-width/height attributes to set on img tag
//             let svg = document.getElementById(container_id);
//             if (svg !== null) {
//               imageAttrs.push(["style", `max-width:${svg.style.maxWidth};max-height:${svg.style.maxHeight}`]);
//             }
//             // Store HTML
//             imageHTML = html;
//           }, element);
//         }
//         catch (e) {
//           console.log(`Error in running Mermaid.mermaidAPI.render: ${e}`);
//         }
//         finally {
//           element.remove();
//         }
//         break;
//       }
//       default: {
//         return defaultFenceRenderer(tokens, idx, options, env, slf);
//       }

//     }

//     // If we have an image, let's render it, otherwise return blank img tag
//     if (imageHTML.length) {
//       // Store encoded image data
//       imageAttrs.push(["src", `data:image/svg+xml,${encodeURIComponent(imageHTML)}`]);
//       return `<img ${slf.renderAttrs({ attrs: imageAttrs })}>`;
//     }
//     return "<img>"

//   }

//   md.renderer.rules.fence = customFenceRenderer;
// }


const md = new MarkdownIt('default', {
  html: true,
  linkify: true,
  typographer: true
}).use(Meta).use(hljs)
const render = (string) => {
  const html = md.render(string)
  return {
    html: html,
    meta: md.meta
  }
}


console.log(`working directory: ${__dirname}`)
console.log(`pages tree`, pages)

const pageSource = unescape(window.location.pathname)
  .substr(1)
  .replace(".md", "")
  .split('/')
  .reduce((scope, acc) => {
    scope[acc]
  }, pages)

const page = render(pageSource)

if (pages.menu) {
  document.querySelector(".menu").innerHTML = pages.menu.html
}

if (page) {
  document.querySelector(".content").innerHTML = page.html || "not found"
} else {
  document.querySelector(".content").innerHTML = "page not found"
}