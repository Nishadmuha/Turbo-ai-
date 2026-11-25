// Website identity is authored locally. Blog SEO is supplied by each blog entry;
// reading a public page must not request global settings from the CMS server.
const settings = { siteName: "Turbo AI", defaultOg: "" };
export function useCmsSiteSettings() { return settings; }
