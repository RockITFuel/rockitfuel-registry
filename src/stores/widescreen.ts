import { makePersisted } from "@solid-primitives/storage";
import { createSignal } from "solid-js";
import { isServer } from "solid-js/web";

const [baseSignal, setBaseSignal] = createSignal(false);
export const [isWidescreen, setIsWidescreen] = isServer
  ? [baseSignal, setBaseSignal]
  : makePersisted(createSignal(false), { name: "widescreen-mode" });

export const toggleWidescreen = () => setIsWidescreen((prev) => !prev);
