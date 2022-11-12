import axios from 'axios'
import {
  Module, Slug, ModuleCreateValues } from './types'

const libClient = axios.create({
  baseURL: process.env.REACT_APP_WIKI_CLIENT_URL,
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

const fetchModule = (slug: Slug): Promise<Module> => libClient
  .get(`modules/${slug}`)
  .then(({ data }) => data);

const createModule = (values: ModuleCreateValues): Promise<Module> => libClient
  .post('modules/', values)
  .then(({ data }) => data);

const fetchModuleGrammar = (filename: string): Promise<string> => languageClient
  .get(filename)
  .then(({ data }) => data);

const updateModuleGrammar = (filename: string, content: string) => languageClient.post(filename, { content });

export {
  fetchModule,
  createModule,
  fetchModuleGrammar,
  updateModuleGrammar
}