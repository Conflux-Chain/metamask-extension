import {
  // ROPSTEN,
  // RINKEBY,
  // KOVAN,
  // GOERLI,
  MAINNET,
  TESTNET,
  MAINNET_CODE,
  TESTNET_CODE,
  // ROPSTEN_CODE,
  // RINKEBY_CODE,
  // KOVAN_CODE,
  // GOERLI_CODE,
  // ROPSTEN_DISPLAY_NAME,
  // RINKEBY_DISPLAY_NAME,
  // KOVAN_DISPLAY_NAME,
  // GOERLI_DISPLAY_NAME,
  MAINNET_DISPLAY_NAME,
  TESTNET_DISPLAY_NAME,
} from './enums'

const networkToNameMap = {
  // [ROPSTEN]: ROPSTEN_DISPLAY_NAME,
  // [RINKEBY]: RINKEBY_DISPLAY_NAME,
  // [KOVAN]: KOVAN_DISPLAY_NAME,
  [MAINNET]: MAINNET_DISPLAY_NAME,
  [MAINNET_CODE]: MAINNET_DISPLAY_NAME,
  [TESTNET]: TESTNET_DISPLAY_NAME,
  [TESTNET_CODE]: TESTNET_DISPLAY_NAME,
  // [GOERLI]: GOERLI_DISPLAY_NAME,
  // [ROPSTEN_CODE]: ROPSTEN_DISPLAY_NAME,
  // [RINKEBY_CODE]: RINKEBY_DISPLAY_NAME,
  // [KOVAN_CODE]: KOVAN_DISPLAY_NAME,
  // [GOERLI_CODE]: GOERLI_DISPLAY_NAME,
}

export const getNetworkDisplayName = (key) => networkToNameMap[key]

export function formatTxMetaForRpcResult (txMeta) {
  return {
    blockHash: txMeta.txReceipt ? txMeta.txReceipt.blockHash : null,
    blockNumber: txMeta.txReceipt ? txMeta.txReceipt.blockNumber : null,
    from: txMeta.txParams.from,
    gas: txMeta.txParams.gas,
    gasPrice: txMeta.txParams.gasPrice,
    hash: txMeta.hash,
    input: txMeta.txParams.data || '0x',
    nonce: txMeta.txParams.nonce,
    to: txMeta.txParams.to,
    transactionIndex: txMeta.txReceipt
      ? txMeta.txReceipt.transactionIndex
      : null,
    value: txMeta.txParams.value || '0x0',
    v: txMeta.v,
    r: txMeta.r,
    s: txMeta.s,
  }
}

export function getStatus (rpcUrl) {
  const body = JSON.stringify({
    id: 1,
    jsonrpc: '2.0',
    method: 'cfx_getStatus',
    params: [],
  })

  return fetch(rpcUrl, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body,
  })
    .then((res) => {
      if (res.ok) {
        return res.json()
      }
      throw new Error('request error, fallback to 0x0 chainId')
    })
    .then((json) => {
      if (!json.result) {
        return { chainId: '0x0' }
      }
      return json.result
    })
    .catch(() => {
      return {
        chaindId: '0x0',
      }
    })
}
