export const config = () => {
  const protocol = "https";
  const apiDomain = "defra.systems";

  const apiEnvHosts = {
    development: protocol + "://api.dev." + apiDomain,
    test: "https://api.test." + apiDomain,
    production: protocol + "://api." + apiDomain,
  };

  const apiEnvCookieHosts = {
    development: protocol + "://dev." + apiDomain,
    test: protocol + "://test." + apiDomain,
    production: protocol + "://" + apiDomain,
  };

  const storeFrontDomain = "defra.systems";
  const storeFrontEnvHosts = {
    development: protocol + "://dev." + storeFrontDomain,
    test: protocol + "://test." + storeFrontDomain,
    production: protocol + "://" + storeFrontDomain,
  };

  const networkIds = {
    development: [31337, 3, 4, 5, 42, 1],
    test: [3, 4, 5, 42],
    production: [1],
  };

  const openseaApiEnvHosts = {
    development: "https://testnets-api.opensea.io",
    test: "https://testnets-api.opensea.io",
    production: "https://api.opensea.io",
  };

  const openseaEnvHosts = {
    development: "https://testnets.opensea.io",
    test: "https://testnets.opensea.io",
    production: "https://opensea.io",
  };

  return {
    env: process.env.REACT_APP_NODE_ENV || "development",
    apiHost:
      process.env.REACT_APP_NODE_ENV != null
        ? apiEnvHosts[process.env.REACT_APP_NODE_ENV]
        : // : "https://mintverse-api-o2hjm.ondigitalocean.app",
          "http://localhost:4000",
    apiCookieHost:
      process.env.REACT_APP_NODE_ENV != null
        ? apiEnvCookieHosts[process.env.REACT_APP_NODE_ENV]
        : // : "https://mintverse-api-o2hjm.ondigitalocean.app",
          "http://localhost:4000",
    allowedNetworkIds:
      process.env.REACT_APP_NODE_ENV != null
        ? networkIds[process.env.REACT_APP_NODE_ENV]
        : networkIds.development,
    storeFrontHost:
      process.env.REACT_APP_NODE_ENV != null
        ? storeFrontEnvHosts[process.env.REACT_APP_NODE_ENV]
        : "http://localhost:3002",
    openseaApi:
      process.env.REACT_APP_NODE_ENV != null
        ? openseaApiEnvHosts[process.env.REACT_APP_NODE_ENV]
        : "https://testnets-api.opensea.io",
    openseaHost:
      process.env.REACT_APP_NODE_ENV != null
        ? openseaEnvHosts[process.env.REACT_APP_NODE_ENV]
        : "https://testnets.opensea.io",
    builderPublicKey: "bd8e098c51b3493a88549a38c4ad9ab3",
  };
};
