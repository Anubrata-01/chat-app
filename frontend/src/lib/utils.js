import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"
import animationData from "@/assets/Animation - 1725420822299.json"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}


export const animationDefaultOptions={
  loop:true,
  autoplay:true,
  animationData
}