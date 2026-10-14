import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useState, type SyntheticEvent } from "react";

const panels = [
  {
    id: "summary",
    title: "AccordionSummary is the header",
    body: "The summary is a button. Click it to open or close the panel. The expand icon sits at the end of that button.",
  },
  {
    id: "details",
    title: "AccordionDetails is the body",
    body: "The details show when the summary is expanded. This group is controlled: the parent holds the open ids.",
  },
  {
    id: "several",
    title: "One panel, or several",
    body: "With the switch off, opening a panel closes the others. With the switch on, each panel toggles on its own. Turning the switch off leaves the first open panel.",
  },
] as const;

type PanelId = (typeof panels)[number]["id"];

export function MaterialAccordion() {
  const [multiple, setMultiple] = useState(false);
  const [open, setOpen] = useState<readonly PanelId[]>(["summary"]);

  function setMode(next: boolean) {
    setMultiple(next);
    if (!next) setOpen((current) => firstOpen(current));
  }

  function toggle(id: PanelId) {
    return (_event: SyntheticEvent, isExpanded: boolean) => {
      setOpen((current) => nextOpen(current, id, isExpanded, multiple));
    };
  }

  return (
    <>
      <p className="intro">
        Material UI draws the header, the body, and the expand icon. The open
        ids live in this demo, the same way the first accordion keeps them.
      </p>
      <label className="choice">
        <input
          type="checkbox"
          checked={multiple}
          onChange={(event) => setMode(event.target.checked)}
        />
        Keep several panels open
      </label>
      <Stack spacing={1.5}>
        {panels.map((panel) => (
          <Accordion
            key={panel.id}
            expanded={open.includes(panel.id)}
            onChange={toggle(panel.id)}
            disableGutters
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls={`${panel.id}-content`}
              id={`${panel.id}-header`}
            >
              <Typography component="span">{panel.title}</Typography>
            </AccordionSummary>
            <AccordionDetails id={`${panel.id}-content`}>
              <Typography>{panel.body}</Typography>
            </AccordionDetails>
          </Accordion>
        ))}
      </Stack>
    </>
  );
}

function nextOpen(
  current: readonly PanelId[],
  id: PanelId,
  isExpanded: boolean,
  multiple: boolean,
): readonly PanelId[] {
  if (multiple) {
    if (isExpanded) return current.includes(id) ? current : [...current, id];
    return current.filter((item) => item !== id);
  }
  return isExpanded ? [id] : [];
}

function firstOpen(current: readonly PanelId[]): readonly PanelId[] {
  const first = panels.find((panel) => current.includes(panel.id));
  return first === undefined ? [] : [first.id];
}
