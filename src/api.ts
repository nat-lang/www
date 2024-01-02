import axios from 'axios';
import {
  Module, ModuleCreateValues
} from './types';

const nls = axios.create({
  baseURL: process.env.REACT_APP_NLS_URL,
  headers: {
    Accept: 'application/json',
  },
});

const interpretModule = (slug: string): Promise<Module> => nls
  .post(`interpret/${slug}`)
  .then(({ data }) => data);

const fetchModule = (slug: string): Promise<Module> => nls
  .get(`modules/${slug}`)
  .then(({ data }) => data);

const listModules = (): Promise<Module[]> => nls
  .get('modules')
  .then(({ data }) => data);

const createModule = (values: ModuleCreateValues): Promise<Module> => nls
  .post('modules', values)
  .then(({ data }) => data);

const writeModule = ({ id, content }: { id: string, content: string }): Promise<void> => nls
  .post(`modules/${id}`, { content })
  .then(({ data }) => data);

const deleteModule = (filename: string): Promise<string> => nls
  .delete(`modules/${filename}`)
  .then(({ data }) => data);

export {
  interpretModule,
  fetchModule,
  createModule,
  writeModule,
  listModules,
  deleteModule,
}