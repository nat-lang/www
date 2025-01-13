
export default function () {
  const jax = window.MathJax;
  if ((typeof jax.typeset) !== "function")
    throw new Error("too early!");
  return jax.typeset();
}

