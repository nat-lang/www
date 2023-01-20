import { useContext } from 'react';
import { storeContext } from '../contexts';

import useYupResolver from "hooks/useYupResolver";
import * as yup from "yup";

const useStores = () => useContext(storeContext);

const useModuleSchema = () => useYupResolver({
  title: yup.string().min(1).required("name required"),
});

export {
  useStores,
  useModuleSchema
}