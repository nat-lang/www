import { FieldProps } from "./Field";
import Editor, { EditorProps } from "components/Editor";
import { useFormContext } from "react-hook-form";

type EditorFieldProps = Pick<FieldProps, "name"> & Pick<EditorProps, "content" | "uri" | "onChange" | "onLangClientRegister">

const EditorField: React.FC<EditorFieldProps> = ({ content, uri, name, onChange, ...props }) => {
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
      {...props}
    />
  );
};

export default EditorField;