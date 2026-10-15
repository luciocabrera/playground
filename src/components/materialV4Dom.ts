import ReactDOM from "react-dom";

type FindDomNode = (node: Element | null) => Element | null;

const dom = ReactDOM as typeof ReactDOM & { findDOMNode?: FindDomNode };

// @material-ui/core 4 ButtonBase still calls ReactDOM.findDOMNode when a key
// is pressed. React 19 removed that export. The argument is already the button.
if (typeof dom.findDOMNode !== "function") {
  dom.findDOMNode = (node) => (node instanceof Element ? node : null);
}
