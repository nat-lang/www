import { HTMLProps, forwardRef } from "react";
import "./field.css";
import { UseFormRegisterReturn } from "react-hook-form";

type FieldOps = {
  inFlight: boolean;
} & UseFormRegisterReturn & HTMLProps<HTMLInputElement>

const Field = forwardRef<HTMLInputElement, FieldOps>(({ inFlight, ...ops }, ref) => {
  return (
    <input className="Field Field--submit" disabled={inFlight}  {...ops} ref={ref} />
  );
});


export default Field;