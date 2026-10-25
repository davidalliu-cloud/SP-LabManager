"use client";

import { useRef, useState } from "react";

/**
 * The "i" beside a label, and what it explains.
 *
 * Every field of an offer writes one specific sentence into the Word document,
 * and which sentence is not guessable from the label — "Zbritja mbi prag"
 * changes no price, it promises one later. So the explanation lives next to
 * the field rather than in anyone's head.
 *
 * It opens on hover and on focus, so a mouse, a keyboard and a finger all
 * reach it. The panel is positioned absolutely, which means it must not be
 * used inside a container that scrolls horizontally — there it would be
 * clipped, and a `title` attribute is the better tool.
 *
 * These sit inside the `<label>` that wraps a field, and a click anywhere in a
 * label is forwarded to that label's control, so asking for an explanation
 * would otherwise also open the select beneath it. Hence the preventDefault.
 */

/** Matches `w-72`. Measured against the viewport to decide which way to open. */
const PANEL_WIDTH = 288;
const GUTTER = 16;

export function InfoHint({ label, children }: { label: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  // A field in the last column has no room to its right, and the panel would
  // run off the page — with pointer-events-none there would be no scrolling it
  // back into view either. So it opens leftwards instead.
  const [alignRight, setAlignRight] = useState(false);
  const anchor = useRef<HTMLSpanElement>(null);

  function show() {
    const box = anchor.current?.getBoundingClientRect();
    if (box) setAlignRight(box.left + PANEL_WIDTH > document.documentElement.clientWidth - GUTTER);
    setOpen(true);
  }

  return (
    <span
      ref={anchor}
      className="relative ml-1 inline-flex align-middle"
      onMouseEnter={show}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        aria-label={`Shpjegim: ${label}`}
        aria-expanded={open}
        onClick={(event) => {
          event.preventDefault();
          if (open) setOpen(false);
          else show();
        }}
        onFocus={show}
        onBlur={() => setOpen(false)}
        className="flex h-[15px] w-[15px] items-center justify-center rounded-full border border-lab-mist text-[10px] font-bold italic normal-case leading-none tracking-normal text-muted transition hover:border-lab-burgundy hover:bg-lab-burgundy hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-lab-burgundy"
      >
        i
      </button>
      {open ? (
        <span
          role="tooltip"
          className={`pointer-events-none absolute top-6 z-30 block w-72 rounded-md border border-lab-mist bg-white p-3 text-xs font-normal normal-case leading-5 tracking-normal text-ink shadow-lg ${
            alignRight ? "right-0" : "left-0"
          }`}
        >
          {children}
        </span>
      ) : null}
    </span>
  );
}
