
import natGrammar from "@nat-lang/natvs/syntaxes/nat.tmLanguage.json" with { type: 'json' };

import { shikiToMonaco } from '@shikijs/monaco';
import * as monaco from 'monaco-editor';
import { createHighlighter } from 'shiki';

const highlighter = await createHighlighter({
  themes: ["vitesse-light"],
  langs: [
    "latex",
    {
      embeddedLangs: [
        "latex",
      ],
      ...natGrammar
    },
  ]
})

monaco.languages.register({ id: 'nat' });
monaco.languages.register({ id: 'latex' });

shikiToMonaco(highlighter, monaco);
