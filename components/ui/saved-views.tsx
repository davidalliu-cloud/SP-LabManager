"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

/**
 * Named answers to the questions people actually open a register to ask.
 *
 * Each view is just a set of filter values, and the filters already live in the
 * query string - so a view is a link, it survives a reload, and it can be sent
 * to a colleague. Nothing new is stored anywhere.
 */
export type SavedView = {
  key: string;
  label: string;
  /** Only non-default values. An empty object is the register's default view. */
  params: Record<string, string>;
};

/** Filters only. `page` is position, not a description of what you are looking at. */
function filterParamsOf(searchParams: URLSearchParams | null): Record<string, string> {
  const out: Record<string, string> = {};
  if (!searchParams) return out;
  searchParams.forEach((value, key) => {
    if (key !== "page" && value) out[key] = value;
  });
  return out;
}

function sameView(current: Record<string, string>, view: Record<string, string>) {
  const currentKeys = Object.keys(current);
  const viewKeys = Object.keys(view);
  if (currentKeys.length !== viewKeys.length) return false;
  return viewKeys.every((key) => current[key] === view[key]);
}

function href(basePath: string, params: Record<string, string>) {
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) if (value) query.set(key, value);
  const search = query.toString();
  return search ? `${basePath}?${search}` : basePath;
}

export function SavedViews({ views, basePath }: { views: SavedView[]; basePath: string }) {
  const searchParams = useSearchParams();
  const current = filterParamsOf(searchParams);

  return (
    <nav className="no-print mb-3 flex flex-wrap items-center gap-2" aria-label="Pamje të ruajtura">
      {views.map((view) => {
        const active = sameView(current, view.params);
        return (
          <Link
            key={view.key}
            href={href(basePath, view.params)}
            aria-current={active ? "page" : undefined}
            className={
              active
                ? "rounded-full border border-lab-burgundy bg-lab-burgundy px-3 py-1 text-xs font-semibold text-white"
                : "rounded-full border border-line bg-white px-3 py-1 text-xs font-semibold text-ink transition hover:border-lab-burgundy hover:text-lab-burgundy"
            }
          >
            {view.label}
          </Link>
        );
      })}
    </nav>
  );
}
