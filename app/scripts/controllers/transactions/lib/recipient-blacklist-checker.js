import Config from './recipient-blacklist.js'

/** @module*/
export default {
  checkAccount,
}

/**
 * Checks if a specified account on a specified network is blacklisted.
  @param {number} networkId
  @param {string} account
*/
function checkAccount (networkId, account) {
  const mainnetId = 1029
  if (networkId !== mainnetId) {
    return
  }

  const accountToCheck = account.toLowerCase()
  if (Config.blacklist.includes(accountToCheck)) {
    throw new Error('Recipient is a public account')
  }
}
