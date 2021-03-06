module.exports = {
  personal_sign: { index: 1 },
  cfx_sign: { index: 0 },
  cfx_signTypedData_v4: { index: 0, from: true },
  cfx_signTypedData_v3: { index: 0, from: true },
  cfx_signTypedData_v2: { index: 0, from: true },
  cfx_signTypedData: { index: 0, from: true },
  eth_getBalance: { index: 0 },
  eth_getStakingBalance: { index: 0 },
  eth_getCollateralForStorage: { index: 0 },
  eth_getAdmin: { index: 0 },
  eth_getCode: { index: 0 },
  eth_getStorageAt: { index: 0 },
  eth_getStorageRoot: { index: 0 },
  eth_getSponsorInfo: { index: 0 },
  eth_getTransactionCount: { index: 0 },
  cfx_getBalance: { index: 0 },
  cfx_getStakingBalance: { index: 0 },
  cfx_getCollateralForStorage: { index: 0 },
  cfx_getAdmin: { index: 0 },
  cfx_getCode: { index: 0 },
  cfx_getStorageAt: { index: 0 },
  cfx_getStorageRoot: { index: 0 },
  cfx_getSponsorInfo: { index: 0 },
  cfx_getNextNonce: { index: 0 },
  cfx_getTransactionCount: { index: 0 },
  eth_call: {
    index: 0,
    children: [{ object: true, keys: ['from', 'to'] }],
  },
  cfx_call: {
    index: 0,
    children: [{ object: true, keys: ['from', 'to'] }],
  },
  cfx_sendTransaction: {
    index: 0,
    children: [{ object: true, keys: ['from', 'to'] }],
  },
  eth_estimateGas: {
    index: 0,
    children: [{ object: true, keys: ['from', 'to'] }],
  },
  cfx_estimateGasAndCollateral: {
    index: 0,
    children: [{ object: true, keys: ['from', 'to'] }],
  },
  cfx_getAccount: { index: 0 },
  cfx_getDepositList: { index: 0 },
  cfx_getVoteList: { index: 0 },
  cfx_getLogs: {
    object: true,
    keys: ['address'],
  },
  eth_getAccount: { index: 0 },
  eth_getDepositList: { index: 0 },
  eth_getVoteList: { index: 0 },
  eth_getLogs: {
    object: true,
    keys: ['address'],
  },
  cfx_checkBalanceAgainstTransaction: {
    index: [0, 1],
  },
  eth_checkBalanceAgainstTransaction: {
    index: [0, 1],
  },
}
