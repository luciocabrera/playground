import { createContext, useContext, useId, useState, type ReactNode } from "react";
import "./Accordion.css";

type AccordionProps = {
  children?: ReactNode;
  multiple?: boolean;
  defaultOpen?: Iterable<string>;
};

type AccordionItemProps = {
  id?: string;
  title: string;
  children?: ReactNode;
};

type AccordionComponent = {
  (props: AccordionProps): ReactNode;
  Item: (props: AccordionItemProps) => ReactNode;
};

type AccordionContextValue = {
  openIds: ReadonlySet<string>;
  toggle: (id: string) => void;
};

const AccordionContext = createContext<AccordionContextValue | null>(null);

function useAccordion(): AccordionContextValue {
  const context = useContext(AccordionContext);
  if (!context) {
    throw new Error("Accordion.Item must render inside Accordion.");
  }
  return context;
}

export const Accordion: AccordionComponent = function Accordion({
  children,
  multiple = false,
  defaultOpen = [],
}) {
  const [openIds, setOpenIds] = useState(() => new Set(defaultOpen));
  const [prevMultiple, setPrevMultiple] = useState(multiple);

  // Keep a single open panel when the parent switches multiple off.
  if (multiple !== prevMultiple) {
    setPrevMultiple(multiple);
    if (!multiple) setOpenIds(singleOpenId);
  }

  function toggle(id: string) {
    setOpenIds((current) => toggledOpenIds(current, id, multiple));
  }

  return (
    <AccordionContext.Provider value={{ openIds, toggle }}>
      <div className="accordion">{children}</div>
    </AccordionContext.Provider>
  );
};

function AccordionItem({ id, title, children }: AccordionItemProps): ReactNode {
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

function toggledOpenIds(openIds: ReadonlySet<string>, id: string, multiple: boolean): Set<string> {
  if (!openIds.has(id)) return new Set(multiple ? [...openIds, id] : [id]);
  if (!multiple) return new Set();
  return new Set([...openIds].filter((openId) => openId !== id));
}

function singleOpenId(openIds: Set<string>): Set<string> {
  if (openIds.size <= 1) return openIds;
  const first = [...openIds][0];
  if (first === undefined) return openIds;
  return new Set([first]);
}
