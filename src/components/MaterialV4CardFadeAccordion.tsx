import "./materialV4Dom.ts";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardHeader from "@material-ui/core/CardHeader";
import Link from "@material-ui/core/Link";
import Typography from "@material-ui/core/Typography";
import { createTheme, makeStyles, StylesProvider, ThemeProvider } from "@material-ui/core/styles";
import ExpandMoreIconModule from "@material-ui/icons/ExpandMore";
import { useId, useRef, useState, type ComponentType } from "react";
import type { SvgIconProps } from "@material-ui/core/SvgIcon";
import { useClippedFocus, useContentOverflow } from "./useFadeClip.ts";

// Vite's prebundle keeps this icon's CommonJS `exports` object as the default.
const ExpandMoreIcon: ComponentType<SvgIconProps> =
  typeof ExpandMoreIconModule === "function"
    ? ExpandMoreIconModule
    : (ExpandMoreIconModule as { default: ComponentType<SvgIconProps> }).default;

const v4Theme = createTheme({
  palette: {
    primary: { main: "#c4492c", contrastText: "#fffaf3" },
    text: { primary: "#221e1a", secondary: "#6b635a" },
    divider: "#e4d9c8",
    background: { paper: "#fffdf9", default: "#f3eee4" },
  },
  shape: { borderRadius: 16 },
  typography: {
    fontFamily: 'Outfit, "Avenir Next", "Segoe UI", sans-serif',
  },
});

const useStyles = makeStyles(
  (theme) => ({
    list: {
      display: "flex",
      flexDirection: "column",
      gap: theme.spacing(1.5),
    },
    shell: {
      position: "relative",
    },
    clip: {
      "--fade-collapsed": "152px",
      overflow: "hidden",
      "@supports (interpolate-size: allow-keywords)": {
        "interpolate-size": "allow-keywords",
        height: "auto",
        transition: "height 220ms ease",
      },
      "@media (prefers-reduced-motion: reduce)": {
        transition: "none",
      },
    },
    clipCollapsed: {
      height: "var(--fade-collapsed)",
      WebkitMaskImage: "linear-gradient(to bottom, #000 60%, transparent 100%)",
      maskImage: "linear-gradient(to bottom, #000 60%, transparent 100%)",
    },
    // The blur sits outside the masked clip. A mask on the clip would fade this strip too.
    blur: {
      position: "absolute",
      right: 0,
      bottom: 0,
      left: 0,
      height: "40%",
      pointerEvents: "none",
      WebkitBackdropFilter: "blur(4px)",
      backdropFilter: "blur(4px)",
      WebkitMaskImage: "linear-gradient(to bottom, transparent, #000)",
      maskImage: "linear-gradient(to bottom, transparent, #000)",
    },
    body: {
      display: "flex",
      flexDirection: "column",
      gap: theme.spacing(1.5),
    },
    title: {
      fontFamily: 'Fraunces, "Iowan Old Style", Palatino, serif',
      fontSize: "1.05rem",
      fontWeight: 560,
      letterSpacing: "-0.02em",
      lineHeight: 1.3,
    },
    chevron: {
      transition: "transform 150ms ease",
      "@media (prefers-reduced-motion: reduce)": {
        transition: "none",
      },
    },
    chevronOpen: {
      transform: "rotate(180deg)",
    },
  }),
  { name: "V4FadeCard" },
);

type FadeCardCopy = {
  id: string;
  title: string;
  paragraphs: readonly string[];
  link?: { href: string; label: string };
};

const cards: readonly FadeCardCopy[] = [
  {
    id: "preview",
    title: "makeStyles owns the fade",
    paragraphs: [
      "Collapsing this card does not unmount the body. makeStyles clips it to a short height, and the rest stays underneath that window.",
      "The cut is a mask on the collapsed class, a gradient from solid to clear. A second class blurs that edge. Nothing here paints a colored bar.",
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
    link: { href: "#section-05", label: "A link under the fold" },
  },
  {
    id: "short",
    title: "A short body is left alone",
    paragraphs: ["This body fits, so there is no mask, blur, or button."],
  },
];

type CardId = (typeof cards)[number]["id"];

export function MaterialV4CardFadeAccordion() {
  return (
    <>
      <p className="intro">
        The same faded card, drawn with @material-ui/core 4.12.4. The mask, the
        blur, and the chevron come from makeStyles. Show more opens the body.
        One card is open at a time. A body that already fits has no fade and no
        button.
      </p>
      <StylesProvider injectFirst>
        <ThemeProvider theme={v4Theme}>
          <FadeCardList />
        </ThemeProvider>
      </StylesProvider>
    </>
  );
}

function FadeCardList() {
  const classes = useStyles();
  const [openId, setOpenId] = useState<CardId | null>(null);

  function toggle(id: CardId) {
    setOpenId((current) => (current === id ? null : id));
  }

  return (
    <div className={classes.list}>
      {cards.map((card) => (
        <FadeCard
          key={card.id}
          card={card}
          open={openId === card.id}
          onToggle={() => toggle(card.id)}
        />
      ))}
    </div>
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
  const classes = useStyles();
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
    <div ref={rootRef}>
      <Card variant="outlined">
        <CardHeader
          title={card.title}
          classes={{ title: classes.title }}
          titleTypographyProps={{ component: "h3", variant: "subtitle1" }}
        />
        <div className={classes.shell}>
          <div
            id={panelId}
            ref={clipRef}
            className={collapsed ? `${classes.clip} ${classes.clipCollapsed}` : classes.clip}
            data-collapsed={collapsed}
            role={overflows ? "region" : undefined}
            aria-labelledby={overflows ? buttonId : undefined}
          >
            <div ref={contentRef}>
              <CardContent>
                <div className={classes.body}>
                  {card.paragraphs.map((paragraph) => (
                    <Typography key={paragraph}>{paragraph}</Typography>
                  ))}
                  {card.link ? (
                    <Typography>
                      <Link href={card.link.href} color="primary" underline="always">
                        {card.link.label}
                      </Link>
                    </Typography>
                  ) : null}
                </div>
              </CardContent>
            </div>
          </div>
          {collapsed ? <div className={classes.blur} aria-hidden="true" /> : null}
        </div>
        {overflows ? (
          <CardActions>
            <Button
              id={buttonId}
              size="small"
              color="primary"
              aria-expanded={open}
              aria-controls={panelId}
              onClick={handleToggle}
              endIcon={
                <ExpandMoreIcon
                  className={open ? `${classes.chevron} ${classes.chevronOpen}` : classes.chevron}
                />
              }
            >
              {open ? "Show less" : "Show more"}
            </Button>
          </CardActions>
        ) : null}
      </Card>
    </div>
  );
}
