const PLUS_KEY = "meridian.plus";

export function readPlus(): boolean {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(PLUS_KEY) === "on";
}

export function writePlus(on: boolean) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(PLUS_KEY, on ? "on" : "off");
}
