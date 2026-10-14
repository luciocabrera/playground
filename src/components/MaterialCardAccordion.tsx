import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Collapse from "@mui/material/Collapse";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useState } from "react";

const cards = [
  {
    id: "surface",
    title: "The card is the surface",
    body: "Card, CardHeader, and CardContent are the visible parts. The body sits in Collapse, so the card can open and close without leaving the page.",
  },
  {
    id: "action",
    title: "CardActions holds the button",
    body: "Expand and Collapse are one button in the actions row. The label and the icon follow the open state. The header itself does not toggle the card.",
  },
  {
    id: "single",
    title: "Opening one card closes the others",
    body: "The parent keeps a single open id. Expand on a closed card selects that id. Collapse on the open card clears it, so every card can be shut.",
  },
] as const;

type CardId = (typeof cards)[number]["id"];

export function MaterialCardAccordion() {
  const [openId, setOpenId] = useState<CardId | null>("surface");

  function toggle(id: CardId) {
    setOpenId((current) => (current === id ? null : id));
  }

  return (
    <>
      <p className="intro">
        These cards are the accordion. Each one expands and collapses from a
        button in CardActions. One card is open at a time.
      </p>
      <Stack spacing={1.5}>
        {cards.map((card) => {
          const open = openId === card.id;
          const panelId = `${card.id}-body`;
          return (
            <Card key={card.id} variant="outlined">
              <CardHeader
                title={card.title}
                slotProps={{ title: { component: "h3", variant: "subtitle1" } }}
              />
              <CardActions>
                <Button
                  size="small"
                  aria-expanded={open}
                  aria-controls={panelId}
                  onClick={() => toggle(card.id)}
                  endIcon={
                    <ExpandMoreIcon
                      sx={{
                        transform: open ? "rotate(180deg)" : "none",
                        transition: "transform 150ms ease",
                      }}
                    />
                  }
                >
                  {open ? "Collapse" : "Expand"}
                </Button>
              </CardActions>
              <Collapse in={open} timeout="auto" unmountOnExit>
                <CardContent id={panelId}>
                  <Typography>{card.body}</Typography>
                </CardContent>
              </Collapse>
            </Card>
          );
        })}
      </Stack>
    </>
  );
}
