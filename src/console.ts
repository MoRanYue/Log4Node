import { Console, Color } from "./enums/Console"

function removeStyles(): string {
  return `\x1B[${Console.removeStyles}m`
}

function cleanUp(): string {
  return `\x1B[${Console.cleanUp}J`
}

function underline(content: string): string {
  return `\x1B[${Console.underline}m${content}${removeStyles()}`
}

function italic(content: string): string {
  return `\x1B[${Console.italic}m${content}${removeStyles()}`
}

function highlight(content: string): string {
  return `\x1B[${Console.highlight}m${content}${removeStyles()}`
}

function hidden(content: string): string {
  return `\x1B[${Console.hidden}m${content}${removeStyles()}`
}

function grey(content: string): string {
  return `\x1B[${Console.grey}m${content}${removeStyles()}`
}

function reverse(content: string): string {
  return `\x1B[${Console.reverse}m${content}${removeStyles()}`
}

function twinkle(content: string): string {
  return `\x1B[${Console.twinkle}m${content}${removeStyles()}`
}

function color(...content: Array<string | Color>): string {
  let text: string = ''
  for (let i = 0; i < content.length; i++) {
    const e: Color | string = content[i];

    if (Object.values(Color).includes(<Color>e)) {
      text += `\x1B[${e}m`
    }
    else if (e == 'REMOVESTYLES') {
      text += removeStyles()
    }
    else {
      text += e
    }

    if (i == content.length - 1) {
      text += removeStyles()
    }
  }

  return text
}

export default {
  removeStyles,
  color,
  italic,
  hidden,
  highlight,
  grey,
  reverse,
  twinkle,
  underline
}