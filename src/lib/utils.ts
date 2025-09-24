import { type ClassValue, clsx } from "clsx"
import { extendTailwindMerge, twMerge } from "tailwind-merge"
import { cubicOut } from "svelte/easing"
import type { TransitionConfig } from "svelte/transition"
import type { SupabaseClient } from "@supabase/supabase-js"

const customTwMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [
        "text-h1",
        "text-h2",
        "text-body1",
        "text-body2",
        "text-body3",
        "text-btn",
      ],
    },
  },
})

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

type FlyAndScaleParams = {
  y?: number
  x?: number
  start?: number
  duration?: number
}

export const flyAndScale = (
  node: Element,
  params: FlyAndScaleParams = { y: -8, x: 0, start: 0.95, duration: 150 },
): TransitionConfig => {
  const style = getComputedStyle(node)
  const transform = style.transform === "none" ? "" : style.transform

  const scaleConversion = (
    valueA: number,
    scaleA: [number, number],
    scaleB: [number, number],
  ) => {
    const [minA, maxA] = scaleA
    const [minB, maxB] = scaleB

    const percentage = (valueA - minA) / (maxA - minA)
    const valueB = percentage * (maxB - minB) + minB

    return valueB
  }

  const styleToString = (
    style: Record<string, number | string | undefined>,
  ): string => {
    return Object.keys(style).reduce((str, key) => {
      if (style[key] === undefined) return str
      return str + `${key}:${style[key]};`
    }, "")
  }

  return {
    duration: params.duration ?? 200,
    delay: 0,
    css: (t) => {
      const y = scaleConversion(t, [0, 1], [params.y ?? 5, 0])
      const x = scaleConversion(t, [0, 1], [params.x ?? 0, 0])
      const scale = scaleConversion(t, [0, 1], [params.start ?? 0.95, 1])

      return styleToString({
        transform: `${transform} translate3d(${x}px, ${y}px, 0) scale(${scale})`,
        opacity: t,
      })
    },
    easing: cubicOut,
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type WithoutChild<T> = T extends { child?: any } ? Omit<T, "child"> : T
export type WithoutChildrenOrChild<T> = WithoutChildren<WithoutChild<T>>
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type WithoutChildren<T> = T extends { children?: any }
  ? Omit<T, "children">
  : T
export type WithElementRef<T, U extends HTMLElement = HTMLElement> = T & {
  ref?: U | null
}

export const isBrowser = typeof document !== "undefined"

/**
 * Slugify function to create consistent IDs (same as table of contents)
 * @param text The heading text to convert to a slug
 * @returns A URL-friendly slug
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w]+/g, "-")
    .replace(/(^-|-$)/g, "")
}

export async function fetchAllWithBuilder<T>(
  supabase: SupabaseClient,
  buildQuery: (supabase: SupabaseClient) => any,
  batchSize: number = 1000,
): Promise<{ data: T[] | null; error: any }> {
  const allData: T[] = []
  let rangeStart = 0
  let rangeEnd = batchSize - 1
  let hasMore = true

  while (hasMore) {
    const query = buildQuery(supabase).range(rangeStart, rangeEnd)
    const { data, error } = await query

    if (error) {
      return { data: null, error }
    }

    if (data && data.length > 0) {
      allData.push(...data)

      if (data.length < batchSize) {
        hasMore = false
      } else {
        rangeStart = rangeEnd + 1
        rangeEnd = rangeStart + batchSize - 1
      }
    } else {
      hasMore = false
    }
  }

  return { data: allData, error: null }
}

export function formatNumber(number: number) {
  return new Intl.NumberFormat().format(number)
}

export const BREAKPOINTS = {
  sm: {
    unit: "px",
    value: 640,
  },
  md: {
    unit: "px",
    value: 768,
  },
  lg: {
    unit: "px",
    value: 1024,
  },
  xl: {
    unit: "px",
    value: 1280,
  },
  "2xl": {
    unit: "px",
    value: 1536,
  },
} as const
