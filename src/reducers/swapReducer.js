import { swapActionTypes } from '../actions/swapAction';
import envConfig from '../config/env';

const initialState = {
  sourceToken: envConfig.EOS,
  destToken: envConfig.TOKENS[1],
  sourceAmount: '',
  destAmount: 0,
  tokenPairRate: 0,
  fluctuatingRate: 0,
  isTokenPairRateLoading: true,
  error: null
};

export default function swapReducer(state = initialState, action) {
  switch (action.type) {
    case swapActionTypes.SET_SOURCE_TOKEN: {
      return {
        ...state,
        sourceToken: action.payload,
        sourceAmount: '',
      }
    }
    case swapActionTypes.SET_DEST_TOKEN: {
      return {
        ...state,
        destToken: action.payload
      }
    }
    case swapActionTypes.SET_SOURCE_AMOUNT: {
      return {
        ...state,
        sourceAmount: action.payload,
        error: ''
      }
    }
    case swapActionTypes.SET_DEST_AMOUNT: {
      return {
        ...state,
        destAmount: action.payload
      }
    }
    case swapActionTypes.SET_TOKEN_PAIR_RATE: {
      return {
        ...state,
        tokenPairRate: action.payload
      }
    }
    case swapActionTypes.SET_FLUCTUATING_RATE: {
      return {
        ...state,
        fluctuatingRate: action.payload
      }
    }
    case swapActionTypes.SET_TOKEN_PAIR_RATE_LOADING: {
      return {
        ...state,
        isTokenPairRateLoading: action.payload
      }
    }
    case swapActionTypes.SET_ERROR: {
      return {
        ...state,
        error: action.payload
      }
    }
    case swapActionTypes.SET_SOURCE_AND_DEST_TOKEN: {
      const { srcToken, destToken } = action.payload;

      return {
        ...state,
        sourceAmount: '',
        sourceToken: srcToken,
        destToken: destToken,
      }
    }
    default:
      return state;
  }
}
