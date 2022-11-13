import axios from 'axios'
import {
  Module, Slug, ModuleCreateValues, ID } from './types'

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

const updateModule = ({slug, ...values}: { slug: string } & Partial<Module>): Promise<Module> => libClient
  .patch(`modules/${slug}`, values)
  .then(({ data }) => data);

const fetchModuleFile = (filename: string): Promise<string> => languageClient
  .get(filename)
  .then(({ data }) => data);

const updateModuleFile = (filename: string, content: string) => languageClient
  .post(filename, { content });

export {
  fetchModule,
  createModule,
  updateModule,
  fetchModuleFile,
  updateModuleFile
}