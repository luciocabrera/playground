import { Children, createContext, useContext, type ReactNode } from "react";
import "./Tags.css";

type TagTone = "neutral" | "accent" | "amber" | "rose";

type TagsProps = {
  children?: ReactNode;
  onRemove?: (name: string) => void;
  label?: string;
};

type TagProps = {
  children?: ReactNode;
  value?: string;
  tone?: TagTone;
  removable?: boolean;
};

type TagsComponent = {
  (props: TagsProps): ReactNode;
  Item: (props: TagProps) => ReactNode;
};

type TagsContextValue = {
  onRemove?: (name: string) => void;
};

const TagsContext = createContext<TagsContextValue | null>(null);

function useTags(): TagsContextValue {
  const context = useContext(TagsContext);
  if (!context) {
    throw new Error("Tags.Item must render inside Tags.");
  }
  return context;
}

export const Tags: TagsComponent = function Tags({ children, onRemove, label = "Tags" }) {
  const isEmpty = Children.count(children) === 0;

  return (
    <TagsContext.Provider value={{ onRemove }}>
      <ul className="tags" aria-label={label}>
        {isEmpty ? <li className="tags-empty">The container is empty.</li> : children}
      </ul>
    </TagsContext.Provider>
  );
};

function Tag({ children, value, tone = "neutral", removable = false }: TagProps): ReactNode {
  const { onRemove } = useTags();
  const name = value ?? (typeof children === "string" ? children : "tag");

  return (
    <li className="tag" data-tone={tone}>
      <span className="tag-label">{children}</span>
      {removable ? (
        <button
          type="button"
          className="tag-remove"
          aria-label={`Remove ${name}`}
          onClick={() => onRemove?.(name)}
        >
          <span aria-hidden="true">×</span>
        </button>
      ) : null}
    </li>
  );
}

Tags.Item = Tag;
