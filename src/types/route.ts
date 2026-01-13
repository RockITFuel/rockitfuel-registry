import type { Component } from "solid-js";

export type Route = {
  title: string;
  href: string;
  icon: Component;
  roles?: string[];
};
