import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import markdoc from "@astrojs/markdoc";
import keystatic from "@keystatic/astro";
import tailwindcss from "@tailwindcss/vite";
import netlify from "@astrojs/netlify";

// The public pages are static (SSG). The Keystatic admin at /keystatic needs
// on-demand rendering, which is why an adapter is configured. Swap `netlify()`
// for `@astrojs/node` if you'd rather run/deploy on a Node host.
export default defineConfig({
  site: "https://health-inequalities.example",
  output: "static",
  adapter: netlify(),
  integrations: [react(), markdoc(), keystatic()],
  vite: {
    plugins: [tailwindcss()],
  },
});
