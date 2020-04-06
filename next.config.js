const Dotenv = require("dotenv-webpack");

module.exports = {
  webpack: (config) => {
    config.plugins.push(new Dotenv({ path: "./.env" }));
    return config;
  },
};
