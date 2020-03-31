import assert from 'assert'
import recipientBlackListChecker from '../../../../../app/scripts/controllers/transactions/lib/recipient-blacklist-checker'
import {
  ROPSTEN_CODE,
  RINKEBY_CODE,
  KOVAN_CODE,
  GOERLI_CODE,
} from '../../../../../app/scripts/controllers/network/enums'
import KeyringController from 'cfx-keyring-controller'

describe('Recipient Blacklist Checker', function () {
  describe('#checkAccount', function () {
    let publicAccounts

    before(async function () {
      const damnedMnemonic =
        'candy maple cake sugar pudding cream honey rich smooth crumble sweet treat'
      const keyringController = new KeyringController({})
      const Keyring = keyringController.getKeyringClassForType('HD Key Tree')
      const opts = {
        mnemonic: damnedMnemonic,
        numberOfAccounts: 10,
      }
      const keyring = new Keyring(opts)
      publicAccounts = await keyring.getAccounts()
    })

    it('does not fail on test networks', function () {
      let callCount = 0
      const networks = [ROPSTEN_CODE, RINKEBY_CODE, KOVAN_CODE, GOERLI_CODE]
      for (const networkId in networks) {
        publicAccounts.forEach((account) => {
          recipientBlackListChecker.checkAccount(networkId, account)
          callCount++
        })
      }
      assert.equal(callCount, 40)
    })

    it('fails on mainnet', function () {
      const mainnetId = 1
      let callCount = 0
      publicAccounts.forEach((account) => {
        try {
          recipientBlackListChecker.checkAccount(mainnetId, account)
          assert.fail('function should have thrown an error')
        } catch (err) {
          assert.equal(err.message, 'Recipient is a public account')
        }
        callCount++
      })
      assert.equal(callCount, 10)
    })

    it('fails for public account - uppercase', function () {
      const mainnetId = 1
      const publicAccount = '0X19396F8115517E26FA78EC7F1EE73681DD3D1E54'
      try {
        recipientBlackListChecker.checkAccount(mainnetId, publicAccount)
        assert.fail('function should have thrown an error')
      } catch (err) {
        assert.equal(err.message, 'Recipient is a public account')
      }
    })

    it('fails for public account - lowercase', async function () {
      const mainnetId = 1
      const publicAccount = '0x19396f8115517e26fa78ec7f1ee73681dd3d1e54'
      try {
        await recipientBlackListChecker.checkAccount(mainnetId, publicAccount)
        assert.fail('function should have thrown an error')
      } catch (err) {
        assert.equal(err.message, 'Recipient is a public account')
      }
    })
  })
})
