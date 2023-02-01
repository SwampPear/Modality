import React from 'react'
import styles from './Parser.module.css'

export const jsParseCFG: ICFGConfig = {
  variableColor: '#ff7edb',
  symbols: [
    {
      name: 'delimeter',
      color: '#848bbd'
    },
    {
      name: 'keyword',
      color: '#fede5d'
    },
    {
      name: 'type',
      color: '#fe4450'
    },
  ],
  alphabet: [
    {
      name: 'delimeter',
      alphabet: ['.', ' ', '{', '}', '(', ')', '[', ']', ';', '=', '>', '<', '-', ':']
    },
    {
      name: 'keyword',
      alphabet: ['self', 'const', 'let', 'class', 'interface', 'constructor']
    },
    {
      name: 'type',
      alphabet: ['string', 'number']
    }
  ],
  grammar: [
    {
      name: 'type',
      phrases: [
        ['class ', ' {'],
        ['class ', '{'],
        ['interface ', ' {'],
        ['interface ', '{']
      ]
    }
  ]
}

export interface ISymbol {
  name: string,
  color: string
}

export interface IAlphabet {
  name: string,
  alphabet: string[]
}

export interface IGrammar {
  name: string,
  phrases: string[][]
}

export interface ICFGConfig {
  variableColor: string,
  symbols: ISymbol[],
  alphabet: IAlphabet[],
  grammar: IGrammar[]
}

export interface IParsedContent {
  start: number,
  end: number,
  color: string,
  content: string
}

export interface ParserOptions {
  text: string,
  CFGConfig: ICFGConfig
}

class Parser {
  text: string
  CFGConfig: ICFGConfig
  parsedContent: IParsedContent[]
  parsedRows: IParsedContent[][]
  types: string[]
  alphabet: IAlphabet[]

  /**
   * Constructor for the Parser component.
   * @param options 
   */
  constructor(options: ParserOptions) {
    this.text = options.text
    this.CFGConfig = options.CFGConfig
    this.parsedContent = []
    this.parsedRows = []
    this.types = []
    this.alphabet = []

    this.parseAlphabet()
    this.parseContent()
    this.parseRows()
    this.parseTabs()
  }

  /**
   * Parses content that can be determined from the alphabet.
   */
  parseKnownContent = () => {
    this.alphabet.forEach((alphabet) => {
      let name: string = alphabet.name

      // get color for content
      let color: string

      this.CFGConfig.symbols.forEach((symbol) => {
        if (symbol.name === name) {
          color = symbol.color
        }
      })
  
      // color all known words
      alphabet.alphabet.forEach((word) => {
        let index: number = 0

        while (index !== -1) {
          // get start and end indices for first instance of word
          let startIndex: number = this.text.indexOf(word, index)
          let endIndex: number

          // check if word is found
          if (startIndex === -1) {
            index = -1
          } else {
            endIndex = startIndex + word.length

            // make new parsed content
            let parsedContent: IParsedContent = {
              start: startIndex,
              end: endIndex,
              color: color,
              content: word
            }

            this.parsedContent.push(parsedContent)

            index = endIndex
          }
        }
      })
    })
  }

  /**
   * Used for BubbleSort purposes
   * @param x first number to swap
   * @param y second number to swap
   */
  swap = (x: number, y: number) => {
    var temp = this.parsedContent[x]
    this.parsedContent[x] = this.parsedContent[y]
    this.parsedContent[y] = temp
  }

  /**
   * Sorts content that can be parse from known alphabet.
   */
  sortParsedContent = () => {
    let i: number = 0
    let j: number = 0

    for (i = 0; i < this.parsedContent.length - 1; i++) {
        for (j = 0; j < this.parsedContent.length - i - 1; j++) {
            if (this.parsedContent[j].start > this.parsedContent[j + 1].start) {
              this.swap(j, j + 1)
            }
        }
    }
  }

  /**
   * Parse all other content that cannot be determined from alphabet.
   */
  parseUnknownContent = () => {
    // determine color
    let color: string = this.CFGConfig.variableColor

    for (let i = 0; i < this.parsedContent.length - 1; i++) {
      if (this.parsedContent[i].end !== this.parsedContent[i + 1].start) {
        let start: number = this.parsedContent[i].end
        let end: number = this.parsedContent[i + 1].start

        let replacementContent: IParsedContent = {
          start: start,
          end: end,
          color: color,
          content: this.text.substring(start, end)
        }

        this.parsedContent.splice(i + 1, 0, replacementContent);
      }
    }

    // check if unknown content is at beginning of text
    if (this.parsedContent[0].start > 0) {
      let start: number = 0
      let end: number = this.parsedContent[0].start

      let replacementContent: IParsedContent = {
        start: start,
        end: end,
        color: color,
        content: this.text.substring(start, end)
      }

      this.parsedContent.splice(0, 0, replacementContent);
    } 
    // check if unknown content is at end of text
    if (this.parsedContent[this.parsedContent.length - 1].end < this.text.length) {
      let start: number = this.parsedContent[this.parsedContent.length - 1].end
      let end: number = this.text.length

      let replacementContent: IParsedContent = {
        start: start,
        end: end,
        color: color,
        content: this.text.substring(start, end)
      }

      this.parsedContent.splice(this.parsedContent.length, 0, replacementContent);
    }
  }

  /**
   * Parses text into content.
   */
  parseContent = () => {
    this.parseKnownContent()
    this.sortParsedContent()
    this.parseUnknownContent()
  }

  /**
   * Parses the alphabet to be used in this Parser from both an alphabet given from the config 
   * and an alphabet determined by the grammar.
   */
  parseAlphabet = () => {
    this.parseAlphabetFromConfig()
    this.parseAlphabetFromGrammar()
  }

  /**
   * Parses the alphabet to be used in this parser from an alphabet given by the config.
   */
  parseAlphabetFromConfig = () => {
    this.CFGConfig.alphabet.forEach((alphabet) => {
      this.alphabet.push(alphabet)
    })
  }

  /**
   * Parses the alphabet to be used in this parser from an alphabet determined by the grammar.
   */
  parseAlphabetFromGrammar = () => {
    this.CFGConfig.grammar.forEach((grammar) => {
      let name: string = grammar.name

      grammar.phrases.forEach((phrase) => {
        // check if prefix and suffix found
        let prefixIndex: number = this.text.indexOf(phrase[0])
        let suffixIndex: number = this.text.indexOf(phrase[1])

        if (prefixIndex !== -1 && suffixIndex !== -1) {
          // regularize prefix index and extract new word
          prefixIndex = prefixIndex + phrase[0].length

          let word: string = this.text.substring(prefixIndex, suffixIndex)

          // check if name already exist in alphabet
          let nameFound: boolean = false

          this.alphabet.forEach((alphabet) => {
            if (name === alphabet.name) {
              if (!alphabet.alphabet.includes(word.trim())) {
                alphabet.alphabet.push(word.trim())
              }
              
              nameFound = true
            }
          })

          // make new alphabet member if not
          if (!nameFound) {
            let newAlphabet: IAlphabet = {
              name: name,
              alphabet: [word]
            }

            this.alphabet.push(newAlphabet)
          }
        }
      })
    })
  }

  /**
   * Parses content into rows based on newlines.
   */
  parseRows = () => {
    // start on some index
    // loop through parsed content until a newline is found
    // if a newline isn't found, put nodes from index to end in an array
    // if newline is found, then set index to index + 1 and repeat
    let rows: IParsedContent[][] = []
    let startIndex: number = 0

    for (let i = 0; i < this.parsedContent.length; i++) {
      let newlineFound: boolean = this.parsedContent[i].content.includes('\n')

      if (newlineFound) {
        rows.push(this.parsedContent.slice(startIndex, i))
        startIndex = i

      } else {
        if (i === this.parsedContent.length - 1) {
          rows.push(this.parsedContent.slice(startIndex, this.parsedContent.length))
        }
      }
    }

    this.parsedRows = rows
    console.log(JSON.stringify(rows))
  }

  /**
   * Parses all elements that have a tab in them.
   */
  parseTabs = () => {
    for (let i = 0; i < this.parsedRows.length; i++) {
      for (let j = 0; j < this.parsedRows[i].length; j++) {
        let replacement: string = this.parsedRows[i][j].content.replace('\t', '\u00A0\u00A0\u00A0\u00A0')
        this.parsedRows[i][j].content = replacement
      }
    }
  }

  /**
   * Renders a single row of words.
   * @returns a the row of words
   */
  renderRow = (content: IParsedContent[]) => {
    return content.map((content, key) => {
      return (
        <span key={key} className={styles.stumpSpanClass} style={{color: content.color}}>{content.content}</span>
      )
    })
  }

  /**
   * Returns the elements to be rendered to the code block.
   * @returns parsed array of colored elements
   */
  render = () => {
    return (
      <ul className={styles.stumpListClass}>
        {
          this.parsedRows.map((content, key) => {
            return (
              <li key={key}>{this.renderRow(content)}</li>
            )
          })
        }
      </ul>
    )
  }
}

export default Parser