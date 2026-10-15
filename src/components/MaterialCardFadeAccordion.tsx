import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Button from "@mui/material/Button";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useId, useRef, useState } from "react";
import { useClippedFocus, useContentOverflow } from "./useFadeClip.ts";
import "./MaterialCardFadeAccordion.css";

type FadeCardCopy = {
  id: string;
  title: string;
  paragraphs: readonly string[];
  link?: { href: string; label: string };
};

const cards: readonly FadeCardCopy[] = [
  {
    id: "preview",
    title: "The top stays on the card",
    paragraphs: [
      "Collapsing this card does not unmount the body. The body is clipped to a short height, and the rest stays underneath that window.",
      "The cut is a mask, a gradient from solid to clear, so the card's own surface shows through. A blur sits on that same edge. Nothing here paints a colored bar.",
      "The button under the body opens and closes the card. Opening one card closes the card that was open before it.",
      "Where the browser can animate height to auto, the card eases open. Reduced motion skips that and opens in one step.",
    ],
  },
  {
    id: "fold",
    title: "Below the fold stays out of the tab order",
    paragraphs: [
      "Show less scrolls this card back into view when its top has moved up off the screen. The teaser you see while it is closed is only the opening lines.",
      "The lines under this one stay in the page, past the clip. The mask and the blur are only the hint that more is there.",
      "The link below is one of those lines. While the card is collapsed it is inert, so Tab lands on Show more and not on a control you cannot see.",
    ],
    link: { href: "#section-04", label: "A link under the fold" },
  },
  {
    id: "short",
    title: "A short body is left alone",
    paragraphs: ["This body fits, so there is no mask, blur, or button."],
  },
];

type CardId = (typeof cards)[number]["id"];

export function MaterialCardFadeAccordion() {
  const [openId, setOpenId] = useState<CardId | null>(null);

  function toggle(id: CardId) {
    setOpenId((current) => (current === id ? null : id));
  }

  return (
    <>
      <p className="intro">
        A collapsed card keeps the top of its body and lets the rest fade and
        blur away. Show more opens it. One card is open at a time. A body that
        already fits has no fade and no button.
      </p>
      <Stack spacing={1.5}>
        {cards.map((card) => (
          <FadeCard
            key={card.id}
            card={card}
            open={openId === card.id}
            onToggle={() => toggle(card.id)}
          />
        ))}
      </Stack>
    </>
  );
}

function FadeCard({
  card,
  open,
  onToggle,
}: {
  card: FadeCardCopy;
  open: boolean;
  onToggle: () => void;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const clipRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const reactId = useId();
  const panelId = `${reactId}-body`;
  const buttonId = `${reactId}-button`;
  const overflows = useContentOverflow(contentRef);
  const collapsed = overflows && !open;

  useClippedFocus(clipRef, contentRef, collapsed);

  function handleToggle() {
    if (open) rootRef.current?.scrollIntoView({ block: "nearest" });
    onToggle();
  }

  return (
    <Card ref={rootRef} variant="outlined">
      <CardHeader
        title={card.title}
        slotProps={{ title: { component: "h3", variant: "subtitle1" } }}
      />
      <div className="fade-card-shell">
        <div
          id={panelId}
          ref={clipRef}
          className="fade-card-clip"
          data-collapsed={collapsed}
          role={overflows ? "region" : undefined}
          aria-labelledby={overflows ? buttonId : undefined}
        >
          <div ref={contentRef} className="fade-card-content">
            <CardContent>
              <Stack spacing={1.5}>
                {card.paragraphs.map((paragraph) => (
                  <Typography key={paragraph}>{paragraph}</Typography>
                ))}
                {card.link ? (
                  <Typography>
                    <Link href={card.link.href}>{card.link.label}</Link>
                  </Typography>
                ) : null}
              </Stack>
            </CardContent>
          </div>
        </div>
        {collapsed ? <div className="fade-card-blur" aria-hidden="true" /> : null}
      </div>
      {overflows ? (
        <CardActions>
          <Button
            id={buttonId}
            size="small"
            aria-expanded={open}
            aria-controls={panelId}
            onClick={handleToggle}
            endIcon={
              <ExpandMoreIcon
                sx={{
                  transform: open ? "rotate(180deg)" : "none",
                  transition: "transform 150ms ease",
                  "@media (prefers-reduced-motion: reduce)": { transition: "none" },
                }}
              />
            }
          >
            {open ? "Show less" : "Show more"}
          </Button>
        </CardActions>
      ) : null}
    </Card>
  );
}
