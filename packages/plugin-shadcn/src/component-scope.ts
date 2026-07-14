"use client";

import * as React from "react";
import * as UI from "./ui";

export const shadcnComponentScope = {
  React,
  Fragment: React.Fragment,
  ...UI,
} as Record<string, unknown>;

export { INSTALLED_SHADCN_COMPONENTS } from "./installed-components";
