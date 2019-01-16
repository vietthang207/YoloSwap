export const accountActionTypes = {
  SET_BALANCE_LOADING: 'ACCOUNT.SET_BALANCE_LOADING',
  CONNECT_TO_SCATTER: 'ACCOUNT.CONNECT_TO_SCATTER',
  DISCONNECT_FROM_SCATTER: 'ACCOUNT.DISCONNECT_FROM_SCATTER',
  SET_SCATTER_EOS: 'ACCOUNT.SET_SCATTER_EOS',
  SET_SCATTER_ACCOUNT: 'ACCOUNT.SET_SCATTER_ACCOUNT',
  SET_SCATTER_LOADING: 'ACCOUNT.SET_SCATTER_LOADING',
};

export function connectToScatter(isIdentityNeeded = true) {
  return {
    type: accountActionTypes.CONNECT_TO_SCATTER,
    payload: isIdentityNeeded
  }
}

export function disconnectFromScatter() {
  return {
    type: accountActionTypes.DISCONNECT_FROM_SCATTER
  }
}

export function setScatterEos(eos) {
  return {
    type: accountActionTypes.SET_SCATTER_EOS,
    payload: eos
  }
}

export function setScatterAccount(account) {
  return {
    type: accountActionTypes.SET_SCATTER_ACCOUNT,
    payload: account
  }
}

export function setScatterLoading(isLoading) {
  return {
    type: accountActionTypes.SET_SCATTER_LOADING,
    payload: isLoading
  }
}

export function setBalanceLoading(isLoading) {
  return {
    type: accountActionTypes.SET_BALANCE_LOADING,
    payload: isLoading
  }
}
