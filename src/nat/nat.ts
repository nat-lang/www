

import type { languages } from "monaco-editor";

export const conf: languages.LanguageConfiguration = {
  comments: {
    lineComment: '//',
  },
  brackets: [
    ['{', '}'],
    ['[', ']'],
    ['(', ')']
  ],
  autoClosingPairs: [
    { open: '[', close: ']' },
    { open: '{', close: '}' },
    { open: '(', close: ')' },
    { open: '"', close: '"', notIn: ['string'] }
  ],
  surroundingPairs: [
    { open: '{', close: '}' },
    { open: '[', close: ']' },
    { open: '(', close: ')' },
    { open: '"', close: '"' },
    { open: "'", close: "'" }
  ],
};

export const language = <languages.IMonarchLanguage>{
  tokenPostfix: '.nat',
  defaultToken: 'invalid',
  keywords: [
    'class', 'dom', 'const', 'let', 'else', 'for', 'if', 'in', 'return', 'while', 'print', 'throw', 'import'
  ],

  typeKeywords: [
    'bool', 'num', '->', 'string', 'void',
  ],

  constants: ['true', 'false', 'nil', 'undefined'],

  operators: [
    '=',
    '!',
    '!=',
    '==',
    '<=',
    '>=',
    '..',
    '-',
    '+',
    '*',
    'and',
    'or'
  ],
  delimiters: /[,]/,
  symbols: /[\#\!\%\&\*\+\-\.\/\:\;\<\=\>\@\^\|_\?]+/,

  tokenizer: {
    root: [
      // Raw string literals
      [/r(#*)"/, { token: 'string.quote', bracket: '@open', next: '@stringraw.$1' }],
      [
        /[a-zA-Z][a-zA-Z0-9_]*!?|_[a-zA-Z0-9_]+/,
        {
          cases: {
            '@keywords': 'keyword',
            '@constants': 'keyword',
          }
        }
      ],
      // Designator
      [/\$/, 'identifier'],
      // Lifetime annotations
      [/'[a-zA-Z_][a-zA-Z0-9_]*(?=[^\'])/, 'identifier'],
      // Strings
      [/"/, { token: 'string.quote', bracket: '@open', next: '@string' }],
      { include: '@numbers' },
      // Whitespace + comments
      { include: '@whitespace' },
      [
        /@delimiters/,
        {
          cases: {
            '@keywords': 'keyword',
          }
        }
      ],

      [/[{}()\[\]<>]/, '@brackets'],
      [/@symbols/, { cases: { '@operators': 'operator', '@default': '' } }]
    ],

    whitespace: [
      [/[ \t\r\n]+/, 'white'],
      [/\/\/.*$/, 'comment']
    ],

    string: [
      [/[^\\"]+/, 'string'],
      [/\\./, 'string.escape.invalid'],
      [/"/, { token: 'string.quote', bracket: '@close', next: '@pop' }]
    ],

    stringraw: [
      [/[^"#]+/, { token: 'string' }],
      [
        /"(#*)/,
        {
          cases: {
            '$1==$S2': { token: 'string.quote', bracket: '@close', next: '@pop' },
            '@default': { token: 'string' }
          }
        }
      ],
      [/["#]/, { token: 'string' }]
    ],

    numbers: [
      //Float
      [/\b(\d\.?[\d_]*)\b/, { token: 'number' }],
      //Integer
      [/[\d][\d_]*?/, { token: 'number' }]
    ]
  }
};