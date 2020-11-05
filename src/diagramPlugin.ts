
function diagramPlugin(md: any, options: any) {

  function getLangName(info: string): string {
    return info.split(/\s+/g)[0]
  }

  // Store reference to original renderer.
  let defaultFenceRenderer = md.renderer.rules.fence;

  // Render custom code types as SVGs, letting the fence parser do all the heavy lifting.
  function customFenceRenderer(tokens: any[], idx: number, options: any, env: any, slf: any) {
    let token = tokens[idx]
    let info = token.info.trim()
    let langName = info ? getLangName(info) : ""

    // Only handle custom token
    switch (langName) {
      case "mermaid": {
        return `<div class="mermaid">\n${token.content}\n</div>`
      }
      default: {
        return defaultFenceRenderer(tokens, idx, options, env, slf)
      }
    }

  }

  md.renderer.rules.fence = customFenceRenderer
}

export default diagramPlugin