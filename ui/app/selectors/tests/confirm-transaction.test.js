import assert from 'assert'
import {
  unconfirmedTransactionsCountSelector,
  tokenAmountAndToAddressSelector,
  approveTokenAmountAndToAddressSelector,
  sendTokenTokenAmountAndToAddressSelector,
  contractExchangeRateSelector,
} from '../confirm-transaction'

describe('Confirm Transaction Selector', function() {
  describe('unconfirmedTransactionsCountSelector', function() {
    const state = {
      metamask: {
        unapprovedTxs: {
          1: {
            metamaskNetworkId: 'test',
          },
          2: {
            metmaskNetworkId: 'other network',
          },
        },
        unapprovedMsgCount: 1,
        unapprovedPersonalMsgCount: 1,
        unapprovedTypedMessagesCount: 1,
        network: 'test',
      },
    }

    it('returns number of txs in unapprovedTxs state with the same network plus unapproved signing method counts', function() {
      assert.equal(unconfirmedTransactionsCountSelector(state), 4)
    })
  })

  describe('tokenAmountAndToAddressSelector', function() {
    const state = {
      confirmTransaction: {
        tokenData: {
          name: 'transfer',
          params: [
            {
              name: '_to',
              value: '0x1dcd5d886577d5081b0c52e242ef29e70be3e7bc',
              type: 'address',
            },
            {
              name: '_value',
              value: '1',
              type: 'uint256',
            },
          ],
        },
        tokenProps: {
          tokenDecimals: '2',
          tokenSymbol: 'META',
        },
      },
    }

    it('returns calulcated token amount based on token value and token decimals and recipient address', function() {
      assert.deepEqual(tokenAmountAndToAddressSelector(state), {
        toAddress: '0x1dcd5d886577d5081b0c52e242ef29e70be3e7bc',
        tokenAmount: 0.01,
      })
    })
  })

  describe('approveTokenAmountAndToAddressSelector', function() {
    const state = {
      confirmTransaction: {
        tokenData: {
          name: 'approve',
          params: [
            {
              name: '_spender',
              value: '0x1dcd5d886577d5081b0c52e242ef29e70be3e7bc',
              type: 'address',
            },
            {
              name: '_value',
              value: '1',
              type: 'uint256',
            },
          ],
        },
        tokenProps: {
          tokenDecimals: '2',
          tokenSymbol: 'META',
        },
      },
    }

    it('returns token amount and recipient for approve token allocation spending', function() {
      assert.deepEqual(approveTokenAmountAndToAddressSelector(state), {
        toAddress: '0x1dcd5d886577d5081b0c52e242ef29e70be3e7bc',
        tokenAmount: 0.01,
      })
    })
  })

  describe('sendTokenTokenAmountAndToAddressSelector', function() {
    const state = {
      confirmTransaction: {
        tokenData: {
          name: 'transfer',
          params: [
            {
              name: '_to',
              value: '0x1dcd5d886577d5081b0c52e242ef29e70be3e7bc',
              type: 'address',
            },
            {
              name: '_value',
              value: '1',
              type: 'uint256',
            },
          ],
        },
        tokenProps: {
          tokenDecimals: '2',
          tokenSymbol: 'META',
        },
      },
    }

    it('returns token address and calculated token amount', function() {
      assert.deepEqual(sendTokenTokenAmountAndToAddressSelector(state), {
        toAddress: '0x1dcd5d886577d5081b0c52e242ef29e70be3e7bc',
        tokenAmount: 0.01,
      })
    })
  })

  describe('contractExchangeRateSelector', function() {
    const state = {
      metamask: {
        contractExchangeRates: {
          '0xTokenAddress': '10',
        },
      },
      confirmTransaction: {
        txData: {
          txParams: {
            to: '0xTokenAddress',
          },
        },
      },
    }

    it('returns contract exchange rate in metamask state based on confirm transaction txParams token recipient', function() {
      assert.equal(contractExchangeRateSelector(state), 10)
    })
  })
})
