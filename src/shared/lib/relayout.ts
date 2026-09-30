export const RELAYOUT = "page-effects:relayout";

export const requestRelayout = () => {
  document.dispatchEvent(new CustomEvent(RELAYOUT));
};
