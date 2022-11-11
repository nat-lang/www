import axios from 'axios'
import { toPascalCase } from 'utils/string';
import {
  Fragment, SemanticTree, Slug, Example, ID,
  ConstituencyParse, ExampleEditValues, ConstituencyParseEditValues,
  ExampleCreateValues, Interpretation, InterpretationEditValues, InterpretationCreateValues } from './types'

const wikiClient = axios.create({
  baseURL: process.env.REACT_APP_WIKI_CLIENT_URL,
  headers: {
    Accept: 'application/json',
  },
});

const interpretationClient = axios.create({
  baseURL: process.env.REACT_APP_INTERPRETATION_CLIENT_URL,
  headers: {
    Accept: 'application/json',
  },
});

const languageClient = axios.create({
  baseURL: process.env.REACT_APP_LANGUAGE_CLIENT_URL,
  headers: {
    Accept: 'application/json',
  },
});

const fetchFragment = (slug: Slug): Promise<Fragment> => wikiClient
  .get(`fragments/${slug}`)
  .then(({ data }) => data);

const fetchInterpretations = (example_id: ID): Promise<Interpretation[]> => wikiClient
  .get('interpretations/', {params: { example_id }})
  .then(({ data }) => data);

const updateInterpretation = (interpretationId: ID, values: InterpretationEditValues): Promise<Interpretation> => wikiClient
  .patch(`interpretations/${interpretationId}/`, values)
  .then(({ data }) => data);

const createInterpretation = (values: InterpretationCreateValues): Promise<Interpretation> => wikiClient
  .post('interpretations/', values)
  .then(({ data }) => data);

const deleteInterpretation = (interpretationId: ID): Promise<string | number> => wikiClient
  .delete(`interpretations/${interpretationId}`)
  .then(({ status }) => status);

const fetchExamples = (fragment_id: ID): Promise<Example[]> => wikiClient
  .get('examples/', {params: { fragment_id }})
  .then(({ data }) => data);

const updateExample = (exampleId: ID, values: ExampleEditValues): Promise<Example> => wikiClient
  .patch(`examples/${exampleId}/`, values)
  .then(({ data }) => data);

const createExample = (values: ExampleCreateValues): Promise<Example> => wikiClient
  .post('examples/', values)
  .then(({ data }) => data);

const deleteExample = (exampleId: ID): Promise<string | number> => wikiClient
  .delete(`examples/${exampleId}`)
  .then(({ status }) => status);

const fetchConstituencyParses = (example_id: ID): Promise<ConstituencyParse[]> => wikiClient
  .get('constituency-parses/', {params: { example_id }})
  .then(({ data }) => data);

const createConstituencyParse = (example_id: ID): Promise<ConstituencyParse> => wikiClient
  .post('constituency-parses/', { example_id })
  .then(({ data }) => data);

const deleteConstituencyParse = (constituencyParseId: ID): Promise<string | number> => wikiClient
  .delete(`constituency-parses/${constituencyParseId}`)
  .then(({ status }) => status);

const updateConstituencyParse = (constituencyParseId: ID, values: ConstituencyParseEditValues): Promise<ConstituencyParse> => wikiClient
  .patch(`constituency-parses/${constituencyParseId}/`, values)
  .then(({ data }) => data);

const fetchSemanticTree = (fragment: Fragment, constituencyParse: string): Promise<SemanticTree> => interpretationClient
  .post(`fragments/${toPascalCase(fragment.slug)}/`, { constituencyParse })
  .then(({ data: { semanticTree } }) => semanticTree);

const fetchFragmentGrammar = (filename: string): Promise<string> => languageClient
  .get(filename)
  .then(({ data }) => data);

const updateFragmentGrammar = (filename: string, content: string) => languageClient.post(filename, { content });

export {
  fetchFragment,
  fetchExamples,
  updateExample,
  createExample,
  deleteExample,
  fetchInterpretations,
  updateInterpretation,
  createInterpretation,
  deleteInterpretation,
  fetchConstituencyParses,
  createConstituencyParse,
  deleteConstituencyParse,
  updateConstituencyParse,
  fetchSemanticTree,
  fetchFragmentGrammar,
  updateFragmentGrammar
}