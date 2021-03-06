import { multiplyCurrencies } from '../../helpers/utils/conversion-util'

const MIN_GAS_PRICE_DEC = '0'
const MIN_GAS_PRICE_HEX = parseInt(MIN_GAS_PRICE_DEC).toString(16)
const MIN_GAS_LIMIT_DEC = '21000'
const MIN_GAS_LIMIT_HEX = parseInt(MIN_GAS_LIMIT_DEC).toString(16)
const MAX_GAS_LIMIT_DEC = '100000000'
const MAX_GAS_LIMIT_HEX = parseInt(MAX_GAS_LIMIT_DEC).toString(16)

const MIN_GAS_TOTAL = multiplyCurrencies(MIN_GAS_LIMIT_HEX, MIN_GAS_PRICE_HEX, {
  toNumericBase: 'hex',
  multiplicandBase: 16,
  multiplierBase: 16,
})

const TOKEN_TRANSFER_FUNCTION_SIGNATURE = '0xa9059cbb'

const GAS_PRICE_TOO_LOW = 'gasPriceExtremelyLow'
const INSUFFICIENT_FUNDS_ERROR = 'insufficientFunds'
const INSUFFICIENT_TOKENS_ERROR = 'insufficientTokens'
const NEGATIVE_ETH_ERROR = 'negativeETH'
const INVALID_RECIPIENT_CHECKSUM_ERROR = 'invalidChecksumAddressRecipient'
const INVALID_RECIPIENT_0X_ERROR = 'invalid0XAddressRecipient'
const INVALID_RECIPIENT_CONTRACT_ERROR = 'invalidContractAddressRecipient'
const INVALID_RECIPIENT_ADDRESS_ERROR = 'invalidAddressRecipient'
const INVALID_ADDRESS_NETID_ERROR = 'invalidAddressNetId'
const INVALID_RECIPIENT_ADDRESS_NOT_ETH_NETWORK_ERROR =
  'invalidAddressRecipientNotEthNetwork'
const REQUIRED_ERROR = 'required'
const INVALID_HEX_ERROR = 'invalidHexData'
const KNOWN_RECIPIENT_ADDRESS_ERROR = 'knownAddressRecipient'

const SIMPLE_GAS_COST = '0x5208' // Hex for 21000, cost of a simple send.
const BASE_TOKEN_GAS_COST = '0x186a0' // Hex for 100000, a base estimate for token transfers.
const SIMPLE_STORAGE_COST = '0x0' // Hex for 0, cost of a simple send.

export {
  GAS_PRICE_TOO_LOW,
  INSUFFICIENT_FUNDS_ERROR,
  INSUFFICIENT_TOKENS_ERROR,
  INVALID_HEX_ERROR,
  INVALID_RECIPIENT_CHECKSUM_ERROR,
  INVALID_RECIPIENT_0X_ERROR,
  INVALID_RECIPIENT_CONTRACT_ERROR,
  INVALID_RECIPIENT_ADDRESS_ERROR,
  INVALID_ADDRESS_NETID_ERROR,
  KNOWN_RECIPIENT_ADDRESS_ERROR,
  INVALID_RECIPIENT_ADDRESS_NOT_ETH_NETWORK_ERROR,
  MIN_GAS_LIMIT_DEC,
  MIN_GAS_LIMIT_HEX,
  MAX_GAS_LIMIT_DEC,
  MAX_GAS_LIMIT_HEX,
  MIN_GAS_PRICE_DEC,
  MIN_GAS_PRICE_HEX,
  MIN_GAS_TOTAL,
  NEGATIVE_ETH_ERROR,
  REQUIRED_ERROR,
  SIMPLE_GAS_COST,
  TOKEN_TRANSFER_FUNCTION_SIGNATURE,
  BASE_TOKEN_GAS_COST,
  SIMPLE_STORAGE_COST,
}
