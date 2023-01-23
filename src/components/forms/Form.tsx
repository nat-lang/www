import classNames from "classnames";
import useTwoClicks from "hooks/useTwoClicks";
import { FieldValues, FormProvider, SubmitHandler, UseFormReturn } from "react-hook-form";

export type FormDblClickHandler<V extends FieldValues> = (e: React.MouseEvent<HTMLFormElement, MouseEvent> , ctx: UseFormReturn<V, any>) => void

type FormProps<TFormValues extends FieldValues> = {
  onSubmit: SubmitHandler<TFormValues>;
  children: React.ReactNode;
  className?: string
  onClick?: React.MouseEventHandler<HTMLFormElement>
  onDblClick?: FormDblClickHandler<TFormValues>
  ctx: UseFormReturn<TFormValues>
};

const Form = <
  TFormValues extends Record<string, any>
>({ onSubmit, children, className, onClick, onDblClick, ctx }: FormProps<TFormValues>) => {
  const handleClick = useTwoClicks({
    onSingleClick: onClick,
    onDoubleClick: (e) => onDblClick && onDblClick(e, ctx)
  });

  return (
    <FormProvider {...ctx}>
      <form
        onSubmit={ctx.handleSubmit(onSubmit)}
        className={classNames(className)}
        onClick={handleClick}
      >
        {children}
        <input style={{ display: "none" }} type="submit"/>
      </form>
    </FormProvider>
  );
};
 
export default Form;