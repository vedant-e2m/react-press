"use client";

import * as React from "react";
import * as Mantine from "@mantine/core";
import { MantineProvider } from "@mantine/core";
import type { UiProviderClient } from "@nextpress/core";

export const mantineComponentScope = {
  React,
  Fragment: React.Fragment,
  ...Mantine,
} as Record<string, unknown>;

function MantineProviderWrapper({ children }: { children: React.ReactNode }) {
  return <MantineProvider>{children}</MantineProvider>;
}

export const mantineClientProvider: UiProviderClient = {
  providerId: "mantine",
  getComponentScope() {
    return mantineComponentScope;
  },
  ProviderWrapper: MantineProviderWrapper,
};
