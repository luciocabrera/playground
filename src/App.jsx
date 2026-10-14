import { useState } from "react";
import { Accordion } from "./components/Accordion.jsx";
import { Tags } from "./components/Tags.jsx";
import { roster, rosterKeys } from "./data/roster.js";
import { colorChoices, defaultColorOrder, swatches } from "./data/swatches.js";
import { sortByKeys } from "./lib/sortByKeys.js";
import { OTHERS, sortByValue } from "./lib/sortByValue.js";
import "./App.css";

const tones = ["neutral", "accent", "amber", "rose"];

const startingTags = [
  { label: "React", tone: "accent" },
  { label: "Vite", tone: "neutral" },
  { label: "Accordion", tone: "amber" },
];

export default function App() {
  return (
    <div className="page">
      <header className="masthead">
        <p className="eyebrow">Vite + React</p>
        <h1>playground</h1>
        <p className="lede">
          An accordion, a tags container with its children, and two sorts: one by
          field names, one by a fixed list of values.
        </p>
      </header>
      <main>
        <AccordionDemo />
        <TagsDemo />
        <SortDemo />
        <ValueSortDemo />
      </main>
    </div>
  );
}

function Section({ index, title, signature, children }) {
  const headingId = `section-${index}`;

  return (
    <section className="section" aria-labelledby={headingId}>
      <div className="section-head">
        <div>
          <p className="section-index">{index}</p>
          <h2 id={headingId}>{title}</h2>
        </div>
        <code className="signature">{signature}</code>
      </div>
      {children}
    </section>
  );
}

function AccordionDemo() {
  const [multiple, setMultiple] = useState(false);

  return (
    <Section
      index="01"
      title="Accordion"
      signature="<Accordion><Accordion.Item /></Accordion>"
    >
      <p className="intro">
        The container keeps the set of open panels. Each item toggles itself
        through that set.
      </p>
      <label className="choice">
        <input
          type="checkbox"
          checked={multiple}
          onChange={(event) => setMultiple(event.target.checked)}
        />
        Keep several panels open
      </label>
      <Accordion multiple={multiple} defaultOpen={["state"]}>
        <Accordion.Item id="panels" title="A panel is a button and a region">
          <p>
            Click a heading to open its panel. The button exposes
            aria-expanded, and the panel is inert while it is closed.
          </p>
        </Accordion.Item>
        <Accordion.Item id="state" title="The container owns the open set">
          <p>
            Accordion stores the open ids. Accordion.Item reads that set and
            asks the container to toggle. An item does not keep its own open
            state.
          </p>
        </Accordion.Item>
        <Accordion.Item id="modes" title="One panel, or several">
          <p>
            With the switch off, opening a panel closes the others. With the
            switch on, each panel toggles on its own. Turning the switch off
            leaves only the first open panel.
          </p>
        </Accordion.Item>
      </Accordion>
    </Section>
  );
}

function TagsDemo() {
  const [tags, setTags] = useState(startingTags);
  const [draft, setDraft] = useState("");
  const [message, setMessage] = useState("");

  function addTag(event) {
    event.preventDefault();
    const label = draft.trim();
    if (!label) {
      setMessage("Type a label first.");
      return;
    }
    if (tags.some((tag) => tag.label.toLowerCase() === label.toLowerCase())) {
      setMessage(`${label} is already in the container.`);
      return;
    }
    setTags((current) => [
      ...current,
      { label, tone: tones[current.length % tones.length] },
    ]);
    setDraft("");
    setMessage("");
  }

  function removeTag(label) {
    setTags((current) => current.filter((tag) => tag.label !== label));
    setMessage(`Removed ${label}.`);
  }

  return (
    <Section index="02" title="Tags" signature="<Tags><Tags.Item /></Tags>">
      <p className="intro">
        Tags is the container. Tags.Item is the child. The container lays the
        children out and passes remove down to each one.
      </p>
      <h3 className="block-title">Container</h3>
      <Tags label="Selected tags" onRemove={removeTag}>
        {tags.map((tag) => (
          <Tags.Item key={tag.label} value={tag.label} tone={tag.tone} removable>
            {tag.label}
          </Tags.Item>
        ))}
      </Tags>
      <form className="tag-form" onSubmit={addTag}>
        <label className="field" htmlFor="new-tag">
          <span>New tag</span>
          <input
            id="new-tag"
            value={draft}
            placeholder="Add a tag"
            autoComplete="off"
            aria-describedby="tag-message"
            onChange={(event) => {
              setDraft(event.target.value);
              setMessage("");
            }}
          />
        </label>
        <button className="button" type="submit">
          Add tag
        </button>
      </form>
      <p id="tag-message" className="form-message" role="status">
        {message}
      </p>
      <h3 className="block-title">Children</h3>
      <p className="intro">
        These four are written directly as children of a second container.
      </p>
      <Tags label="Tone samples">
        <Tags.Item tone="neutral">neutral</Tags.Item>
        <Tags.Item tone="accent">accent</Tags.Item>
        <Tags.Item tone="amber">amber</Tags.Item>
        <Tags.Item tone="rose">rose</Tags.Item>
      </Tags>
    </Section>
  );
}

function SortDemo() {
  const [keys, setKeys] = useState(["team", "role"]);
  const sorted = sortByKeys(roster, keys);
  const keyList = keys.map((key) => `"${key}"`).join(", ");

  function toggleKey(key) {
    setKeys((current) =>
      current.includes(key)
        ? current.filter((item) => item !== key)
        : [...current, key],
    );
  }

  function moveKey(index, direction) {
    setKeys((current) => {
      const target = index + direction;
      if (target < 0 || target >= current.length) return current;
      const next = current.slice();
      const [moved] = next.splice(index, 1);
      next.splice(target, 0, moved);
      return next;
    });
  }

  return (
    <Section index="03" title="sortByKeys" signature="sortByKeys(data, keys)">
      <p className="intro">
        The function takes the rows and a list of field names. It compares the
        first key, then uses each following key only when the values tie.
      </p>
      <p className="call">
        <code>{`sortByKeys(roster, [${keyList}])`}</code>
      </p>
      <div className="key-picker" role="group" aria-label="Fields to sort by">
        {rosterKeys.map((key) => {
          const selected = keys.includes(key);
          return (
            <button
              key={key}
              type="button"
              className="chip"
              aria-pressed={selected}
              onClick={() => toggleKey(key)}
            >
              {key}
            </button>
          );
        })}
      </div>
      {keys.length > 0 && (
        <ol className="key-list" aria-label="Sort priority, first key wins">
          {keys.map((key, index) => (
            <li key={key}>
              <span className="key-rank">{index + 1}</span>
              <span className="key-name">{key}</span>
              <span className="key-actions">
                <button
                  type="button"
                  aria-label={`Move ${key} earlier`}
                  disabled={index === 0}
                  onClick={() => moveKey(index, -1)}
                >
                  ←
                </button>
                <button
                  type="button"
                  aria-label={`Move ${key} later`}
                  disabled={index === keys.length - 1}
                  onClick={() => moveKey(index, 1)}
                >
                  →
                </button>
                <button
                  type="button"
                  aria-label={`Remove ${key}`}
                  onClick={() => toggleKey(key)}
                >
                  ×
                </button>
              </span>
            </li>
          ))}
        </ol>
      )}
      <p className="intro">{describeKeys(keys)}</p>
      <div className="tables">
        <RosterTable caption="Original order" rows={roster} keys={[]} />
        <RosterTable caption="After sortByKeys" rows={sorted} keys={keys} />
      </div>
    </Section>
  );
}

function describeKeys(keys) {
  if (keys.length === 0) {
    return "No keys are selected, so both tables match.";
  }
  if (keys.length === 1) {
    return `Sorted by ${keys[0]}. Shaded cells are that key.`;
  }
  const [first, ...rest] = keys;
  return `Sorted by ${first}, then ${rest.join(", then ")}. The number on a column is its priority.`;
}

function RosterTable({ caption, rows, keys }) {
  function rankOf(column) {
    const index = keys.indexOf(column);
    return index === -1 ? undefined : index + 1;
  }

  return (
    <div className="table-wrap">
      <table>
        <caption>{caption}</caption>
        <thead>
          <tr>
            {rosterKeys.map((column) => {
              const rank = rankOf(column);
              let ariaSort = "none";
              if (rank === 1) ariaSort = "ascending";
              else if (rank) ariaSort = "other";
              return (
                <th key={column} scope="col" data-rank={rank} aria-sort={ariaSort}>
                  {column}
                  {rank ? <span className="col-rank">{rank}</span> : null}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.name}>
              {rosterKeys.map((column) => (
                <td key={column} data-rank={rankOf(column)}>
                  {row[column]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ValueSortDemo() {
  const [values, setValues] = useState(defaultColorOrder);
  const sorted = sortByValue(swatches, values, "color");
  const valueList = values.map((value) => `"${value}"`).join(", ");
  const listed = new Set(values.filter((value) => value !== OTHERS));

  function toggleValue(value) {
    setValues((current) => {
      if (current.includes(value)) return current.filter((item) => item !== value);
      const othersAt = current.indexOf(OTHERS);
      if (value !== OTHERS && othersAt !== -1) {
        const next = current.slice();
        next.splice(othersAt, 0, value);
        return next;
      }
      return [...current, value];
    });
  }

  function moveValue(index, direction) {
    setValues((current) => {
      const target = index + direction;
      if (target < 0 || target >= current.length) return current;
      const next = current.slice();
      const [moved] = next.splice(index, 1);
      next.splice(target, 0, moved);
      return next;
    });
  }

  return (
    <Section index="04" title="sortByValue" signature="sortByValue(data, values, key)">
      <p className="intro">
        The function takes the rows and a list of values for one field. Rows
        follow that list. <code>others</code> is the slot for any value the
        list does not name.
      </p>
      <p className="call">
        <code>{`sortByValue(swatches, [${valueList}], "color")`}</code>
      </p>
      <div className="key-picker" role="group" aria-label="Color order">
        {colorChoices.map((color) => (
          <button
            key={color}
            type="button"
            className="chip"
            aria-pressed={values.includes(color)}
            onClick={() => toggleValue(color)}
          >
            <ColorDot color={color} />
            {color}
          </button>
        ))}
      </div>
      {values.length > 0 && (
        <ol className="key-list" aria-label="Value order, first value comes first">
          {values.map((color, index) => (
            <li key={color}>
              <span className="key-rank">{index + 1}</span>
              <ColorDot color={color} />
              <span className="key-name">{color}</span>
              <span className="key-actions">
                <button
                  type="button"
                  aria-label={`Move ${color} earlier`}
                  disabled={index === 0}
                  onClick={() => moveValue(index, -1)}
                >
                  ←
                </button>
                <button
                  type="button"
                  aria-label={`Move ${color} later`}
                  disabled={index === values.length - 1}
                  onClick={() => moveValue(index, 1)}
                >
                  →
                </button>
                <button
                  type="button"
                  aria-label={`Remove ${color}`}
                  onClick={() => toggleValue(color)}
                >
                  ×
                </button>
              </span>
            </li>
          ))}
        </ol>
      )}
      <p className="intro">{describeValues(values)}</p>
      <div className="tables">
        <SwatchTable caption="Original order" rows={swatches} listed={listed} />
        <SwatchTable caption="After sortByValue" rows={sorted} listed={listed} markOthers />
      </div>
    </Section>
  );
}

function describeValues(values) {
  if (values.length === 0) {
    return "The value list is empty, so both tables match.";
  }
  const listed = values.filter((value) => value !== OTHERS);
  const rest = [];
  for (const row of swatches) {
    if (listed.includes(row.color) || rest.includes(row.color)) continue;
    rest.push(row.color);
  }
  const parts = values.map((value) => {
    if (value !== OTHERS) return value;
    return rest.length === 0 ? "others" : `others (${rest.join(", ")})`;
  });
  if (!values.includes(OTHERS) && rest.length > 0) {
    return `Order: ${parts.join(", then ")}. Anything else follows the list: ${rest.join(", ")}.`;
  }
  return `Order: ${parts.join(", then ")}.`;
}

function SwatchTable({ caption, rows, listed, markOthers = false }) {
  return (
    <div className="table-wrap">
      <table>
        <caption>{caption}</caption>
        <thead>
          <tr>
            <th scope="col">name</th>
            <th scope="col">color</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            const isOthers = markOthers && !listed.has(row.color);
            return (
              <tr key={row.name}>
                <td>{row.name}</td>
                <td data-bucket={isOthers ? "others" : undefined}>
                  <span className="color-name">
                    <ColorDot color={row.color} />
                    {row.color}
                    {isOthers ? <span className="others-tag">others</span> : null}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function ColorDot({ color }) {
  return <span className="color-dot" data-color={color} aria-hidden="true" />;
}
