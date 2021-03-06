import envConfig from "./env";

const appConfig = {
  MARKET_BASED_TOKENS: [envConfig.EOS, envConfig.USD],
  MARKET_RATE_FETCHING_INTERVAL: 10000,
  MIN_CONVERSION_RATE: "0.01",
  SCATTER_ERROR_TYPE: 'scatter',
  DEFAULT_RATE_AMOUNT: 1,
  NEW_LISTING_TOKEN_DAYS: 7,
};

export default appConfig;
