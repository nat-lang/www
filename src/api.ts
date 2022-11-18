import axios from 'axios'
import {
  Module, Slug, ModuleCreateValues } from './types'

const libClient = axios.create({
  baseURL: process.env.REACT_APP_LIB_CLIENT_URL,
  headers: {
    Accept: 'application/json',
  },
});

const languageClient = axios.create({
  baseURL: process.env.REACT_APP_LANG_CLIENT_URL,
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

const fetchLanguageFile = (filename: string): Promise<string> => languageClient
  .get(filename)
  .then(({ data }) => data);

const updateLanguageFile = (filename: string, content: string) => languageClient
  .post(filename, { content });

const deleteLanguageFile = languageClient.delete;

export {
  fetchModule,
  createModule,
  updateModule,
  fetchLanguageFile,
  updateLanguageFile,
  deleteLanguageFile,
}