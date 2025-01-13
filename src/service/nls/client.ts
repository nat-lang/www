
import axios from "axios";

const nls = axios.create({
  baseURL: import.meta.env.VITE_NLS_URI,
  headers: {
    Accept: 'application/json',
  },
});

const render = (tex: string): Promise<string> => nls
  .post('/render', { tex })
  .then(({ data }) => data);

export {
  render
}