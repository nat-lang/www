
import axios from "axios";

export type RenderResp = {
  success: boolean;
  pdf?: string;
  errors?: string;
}

const nls = axios.create({
  baseURL: import.meta.env.VITE_NLS_URI,
  headers: {
    Accept: 'application/json',
  },
});

const render = (tex: string): Promise<RenderResp> => nls
  .post('/render', { tex })
  .then(({ data }) => data);

export {
  render
}