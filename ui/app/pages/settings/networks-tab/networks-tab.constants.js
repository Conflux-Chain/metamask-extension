const defaultNetworksData = [
  {
    labelKey: 'mainnet',
    iconColor: '#4890cc',
    providerType: 'mainnet',
    rpcUrl: 'http://portal-main.confluxrpc.com',
    ticker: 'CFX',
    blockExplorerUrl: 'https://confluxscan.io',
  },
  {
    labelKey: 'testnet',
    iconColor: '#FF4A8D',
    providerType: 'testnet',
    rpcUrl: 'http://portal-test.confluxrpc.com',
    ticker: 'CFX',
    blockExplorerUrl: 'https://testnet.confluxscan.io',
  },
  {
    labelKey: 'localhost',
    iconColor: 'white',
    providerType: 'localhost',
    rpcUrl: 'http://localhost:12537/',
    // border: '1px solid #6A737D',
    ticker: 'CFX',
    blockExplorerUrl: '',
  },
]

export { defaultNetworksData }
