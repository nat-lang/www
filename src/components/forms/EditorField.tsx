import Field, { FieldProps } from "./Field";
import Editor, { EditorProps} from "components/Editor";
import { useFormContext } from "react-hook-form";

type EditorFieldProps = Pick<FieldProps, "name"> & Pick<EditorProps, "content" | "uri" | "onChange">

const EditorField: React.FC<EditorFieldProps> = ({ content, uri, name, onChange }) => {
  const { setValue } = useFormContext();

  const handleChange = (value: string) => {
    setValue(name, value);
    onChange && onChange(value);
  };

  return (
    <Editor
      content={content}
      uri={uri}
      onChange={handleChange}
    />
  );
};

export default EditorField;