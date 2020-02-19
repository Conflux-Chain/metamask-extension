export const WALLET_PREFIX = 'wallet_'

export const HISTORY_STORE_KEY = 'permissionsHistory'

export const LOG_STORE_KEY = 'permissionsLog'

export const METADATA_STORE_KEY = 'domainMetadata'

export const CAVEAT_NAMES = {
  exposedAccounts: 'exposedAccounts',
}

export const NOTIFICATION_NAMES = {
  accountsChanged: 'wallet_accountsChanged',
}

export const LOG_IGNORE_METHODS = ['wallet_sendDomainMetadata']

export const SAFE_METHODS = [
  'web3_sha3',
  'net_listening',
  'net_peerCount',
  'net_version',
  'eth_blockNumber',
  'eth_call',
  'eth_chainId',
  'eth_coinbase',
  'eth_estimateGas',
  'eth_gasPrice',
  'eth_getBalance',
  'eth_getBlockByHash',
  'eth_getBlockByNumber',
  'eth_getBlockTransactionCountByHash',
  'eth_getBlockTransactionCountByNumber',
  'eth_getCode',
  'eth_getFilterChanges',
  'eth_getFilterLogs',
  'eth_getLogs',
  'eth_getStorageAt',
  'eth_getTransactionByBlockHashAndIndex',
  'eth_getTransactionByBlockNumberAndIndex',
  'eth_getTransactionByHash',
  'eth_getTransactionCount',
  'eth_getTransactionReceipt',
  'eth_getUncleByBlockHashAndIndex',
  'eth_getUncleByBlockNumberAndIndex',
  'eth_getUncleCountByBlockHash',
  'eth_getUncleCountByBlockNumber',
  'eth_getWork',
  'eth_hashrate',
  'eth_mining',
  'eth_newBlockFilter',
  'eth_newFilter',
  'eth_newPendingTransactionFilter',
  'eth_protocolVersion',
  'eth_sendRawTransaction',
  'eth_sendTransaction',
  'eth_sign',
  'personal_sign',
  'eth_signTypedData',
  'eth_signTypedData_v1',
  'eth_signTypedData_v3',
  'eth_submitHashrate',
  'eth_submitWork',
  'eth_syncing',
  'eth_uninstallFilter',
  'eth_getEncryptionPublicKey',
  'eth_decrypt',
  'metamask_watchAsset',
  'wallet_watchAsset',
  'cfx_epochNumber',
  'cfx_call',
  'cfx_chainId',
  'cfx_coinbase',
  'cfx_estimateGas',
  'cfx_gasPrice',
  'cfx_getBalance',
  'cfx_getEpochByHash',
  'cfx_getEpochByNumber',
  'cfx_getEpochTransactionCountByHash',
  'cfx_getEpochTransactionCountByNumber',
  'cfx_getCode',
  'cfx_getFilterChanges',
  'cfx_getFilterLogs',
  'cfx_getLogs',
  'cfx_getStorageAt',
  'cfx_getTransactionByEpochHashAndIndex',
  'cfx_getTransactionByEpochNumberAndIndex',
  'cfx_getTransactionByHash',
  'cfx_getTransactionCount',
  'cfx_getTransactionReceipt',
  'cfx_getUncleByEpochHashAndIndex',
  'cfx_getUncleByEpochNumberAndIndex',
  'cfx_getUncleCountByEpochHash',
  'cfx_getUncleCountByEpochNumber',
  'cfx_getWork',
  'cfx_hashrate',
  'cfx_mining',
  'cfx_newEpochFilter',
  'cfx_newFilter',
  'cfx_newPendingTransactionFilter',
  'cfx_protocolVersion',
  'cfx_sendRawTransaction',
  'cfx_sendTransaction',
  'cfx_sign',
  'cfx_signTypedData',
  'cfx_signTypedData_v1',
  'cfx_signTypedData_v3',
  'cfx_submitHashrate',
  'cfx_submitWork',
  'cfx_syncing',
  'cfx_uninstallFilter',
  'cfx_getEncryptionPublicKey',
  'cfx_decrypt',
]
