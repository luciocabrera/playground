import { createContext, useContext, useId, useState } from "react";
import "./Accordion.css";

const AccordionContext = createContext(null);

function useAccordion() {
  const context = useContext(AccordionContext);
  if (!context) {
    throw new Error("Accordion.Item must render inside Accordion.");
  }
  return context;
}

export function Accordion({ children, multiple = false, defaultOpen = [] }) {
  const [openIds, setOpenIds] = useState(() => new Set(defaultOpen));
  const [prevMultiple, setPrevMultiple] = useState(multiple);

  // Keep a single open panel when the parent switches multiple off.
  if (multiple !== prevMultiple) {
    setPrevMultiple(multiple);
    if (!multiple && openIds.size > 1) {
      const first = openIds.values().next().value;
      setOpenIds(new Set([first]));
    }
  }

  function toggle(id) {
    setOpenIds((current) => {
      const next = new Set(multiple ? current : []);
      if (current.has(id)) {
        next.delete(id);
        return next;
      }
      next.add(id);
      return next;
    });
  }

  return (
    <AccordionContext.Provider value={{ openIds, toggle }}>
      <div className="accordion">{children}</div>
    </AccordionContext.Provider>
  );
}

function AccordionItem({ id, title, children }) {
  const reactId = useId();
  const itemId = id ?? reactId;
  const { openIds, toggle } = useAccordion();
  const isOpen = openIds.has(itemId);
  const panelId = `${itemId}-panel`;
  const buttonId = `${itemId}-button`;

  return (
    <div className="accordion-item" data-open={isOpen}>
      <h3 className="accordion-heading">
        <button
          id={buttonId}
          type="button"
          className="accordion-trigger"
          aria-expanded={isOpen}
          aria-controls={panelId}
          onClick={() => toggle(itemId)}
        >
          <span>{title}</span>
          <span className="accordion-chevron" aria-hidden="true" />
        </button>
      </h3>
      <div
        id={panelId}
        role="region"
        aria-labelledby={buttonId}
        className="accordion-panel"
        inert={!isOpen}
      >
        <div className="accordion-panel-inner">{children}</div>
      </div>
    </div>
  );
}

Accordion.Item = AccordionItem;
