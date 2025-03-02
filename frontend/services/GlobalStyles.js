async function createGlobalStyles() {
  const stylesheet = new CSSStyleSheet();
  
  const response = await fetch('/node_modules/bootstrap/dist/css/bootstrap.css');
  const css = await response.text();
  await stylesheet.replace(css);
  return stylesheet;
}
export const globalStyles = createGlobalStyles();