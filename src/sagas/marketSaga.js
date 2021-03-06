import { delay } from 'redux-saga';
import { takeLatest, call, put, select } from 'redux-saga/effects';
import { getRates } from "../services/network_service";
import * as marketActions from "../actions/marketAction";
import * as tokenActions from "../actions/tokenAction";
import appConfig from "../config/app";
import envConfig from "../config/env";
import { callFetchMarketRates } from "../services/api_service";
import { fetchTokensByIds } from "../services/coingecko_service";
import * as _ from 'underscore';

const getTokens = state => state.token.tokens;
const getAccountState = state => state.account;

function* fetchMarketRatesChannel() {
  yield call(fetchMarketRates);

  while (true) {
    yield call(fetchMarketRates, true);
  }
}

function* fetchMarketRates(isBackgroundLoading = false) {
  yield call(setLoading, true, isBackgroundLoading);

  try {
    let tokensWithRate = yield call(getTokensWithRateFromAPI);

    if (!tokensWithRate) {
      tokensWithRate = yield call(getTokensWithRateFromBlockChain);
    }

    yield put(tokenActions.setTokens(tokensWithRate));
  } catch (e) {
    console.log(e);
  }

  yield call(setLoading, false, isBackgroundLoading);

  yield call(delay, appConfig.MARKET_RATE_FETCHING_INTERVAL);
}

function* getTokensWithRateFromAPI() {
  let tokens = yield select(getTokens);
  let marketRateData;

  try {
    marketRateData = yield call(callFetchMarketRates);
  } catch (e) {
    return false;
  }

  if (!marketRateData.length) {
    return false;
  }

  return tokens.map((token, index) => {
    if (token.symbol === envConfig.EOS.symbol) {
      return token;
    }

    const tokenMarketRate = marketRateData[index - 1];

    token.sellRate = tokenMarketRate.sellRate;
    token.buyRate = tokenMarketRate.buyRate;
    token.sellRateUsd = tokenMarketRate.sellRateUsd;
    token.buyRateUsd = tokenMarketRate.buyRateUsd;
    token.usdChangePercentage = tokenMarketRate.usdChangePercentage;
    token.eosChangePercentage = tokenMarketRate.eosChangePercentage;

    return token;
  });
}

function* getTokensWithRateFromBlockChain() {
  let srcSymbols = [], destSymbols = [], srcAmounts = [], tokenIds = [];
  const account = yield select(getAccountState);
  let tokens = yield select(getTokens);

  tokens.forEach((token) => {
    tokenIds.push(token.id);

    if (token.symbol !== envConfig.EOS.symbol) {
      srcSymbols.push(token.symbol);
      destSymbols.push(envConfig.EOS.symbol);
      srcAmounts.push(1);
    }
  });

  let sellRates = yield call(getRates, getMarketRateParams(account.eos, srcSymbols, destSymbols, srcAmounts));
  let buyRates = yield call(getRates, getMarketRateParams(account.eos, destSymbols, srcSymbols, srcAmounts));
  const usdBasedTokens = yield call(fetchTokensByIds, tokenIds);
  const eosBasedTokens = yield call(fetchTokensByIds, tokenIds, envConfig.EOS.id);
  const eosData = findTokenById(usdBasedTokens, envConfig.EOS.id);
  const eosUSDPrice = eosData && eosData.current_price ? eosData.current_price : 0;

  tokens = yield select(getTokens);

  return tokens.map((token, index) => {
    if (token.symbol === envConfig.EOS.symbol) {
      return token;
    }

    const sellRate = sellRates[index - 1];
    const buyRate = buyRates[index - 1] ? 1 / buyRates[index - 1] : 0;
    const tokenId = tokenIds[index];
    const usdBasedToken = findTokenById(usdBasedTokens, tokenId);
    const eosBasedToken = findTokenById(eosBasedTokens, tokenId);

    token.sellRate = sellRate;
    token.buyRate = buyRate;
    token.sellRateUsd = eosUSDPrice * sellRate;
    token.buyRateUsd = eosUSDPrice * buyRate;
    token.usdChangePercentage = getChangePercentage(usdBasedToken);
    token.eosChangePercentage = getChangePercentage(eosBasedToken);

    return token;
  });
}

function getMarketRateParams(eos, srcSymbols, destSymbols, srcAmounts) {
  return {
    eos: eos,
    srcSymbols: srcSymbols,
    destSymbols: destSymbols,
    srcAmounts: srcAmounts,
    networkAccount: envConfig.NETWORK_ACCOUNT,
    eosTokenAccount: envConfig.EOS.account
  };
}

function* setLoading(isLoading, isBackgroundLoading = false) {
  if (isBackgroundLoading) {
    yield put(marketActions.setBackgroundLoading(isLoading));
  } else {
    yield put(marketActions.setLoading(isLoading));
  }
}

function findTokenById(tokens, tokenId) {
  return _.find(tokens, (token) => { return token.id === tokenId });
}

function getChangePercentage(tokenData) {
  return tokenData && tokenData.price_change_percentage_24h ? tokenData.price_change_percentage_24h: 0;
}

export default function* marketWatcher() {
  yield takeLatest(
    marketActions.marketActionTypes.FETCH_MARKET_RATES, fetchMarketRatesChannel);
}
