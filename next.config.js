const withPWA = require("next-pwa");

const defaultConfig = {
  reactStrictMode: true,
};

const PWAConfig = {
  pwa: {
    dest: "public",
  },
};

const appConfig =
  process.env.NODE_ENV === "production"
    ? withPWA({
      ...defaultConfig,
      ...PWAConfig,
    })
    : defaultConfig;

module.exports = appConfig;
