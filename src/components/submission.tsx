import { FunctionComponent, HTMLProps, useRef } from "react";
import Balls from "../icons/balls";
import "./field.css";

type SubmissionOps = {
  inFlight: boolean;
} & HTMLProps<HTMLDivElement>;

const Submission: FunctionComponent<SubmissionOps> = ({ inFlight, ...ops }) => {
  const ref = useRef<HTMLInputElement>(null);
  return (
    <div className="Field Field--submit" {...ops}>
      <span>submit</span>
      {inFlight ? <Balls dur="0.5s" /> : <input ref={ref} className="FieldInput" type="submit" placeholder="submit" />}
    </div>
  );
}


export default Submission;