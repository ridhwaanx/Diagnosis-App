"use client";

import { ThemeProvider, CssBaseline } from "@mui/material";
import theme from "@/theme/theme";

export default function ThemeProviderWrapper({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}
