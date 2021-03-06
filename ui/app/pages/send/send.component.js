import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  getHexDataErrorObject,
  getAmountErrorObject,
  getGasPriceErrorObject,
  getGasFeeErrorObject,
  getToAddressForGasUpdate,
  doesAmountErrorRequireUpdate,
} from './send.utils'
import { debounce } from 'lodash'
import {
  getToWarningObject,
  getToErrorObject,
} from './send-content/add-recipient/add-recipient'
import SendHeader from './send-header'
import AddRecipient from './send-content/add-recipient'
import SendContent from './send-content'
import SendFooter from './send-footer'
import EnsInput from './send-content/add-recipient/ens-input'

export default class SendTransactionScreen extends Component {
  static propTypes = {
    gasTotalCountSponsorshipInfo: PropTypes.string,
    addressBook: PropTypes.arrayOf(PropTypes.object),
    amount: PropTypes.string,
    amountConversionRate: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),
    blockGasLimit: PropTypes.string,
    conversionRate: PropTypes.number,
    editingTransactionId: PropTypes.string,
    fetchBasicGasEstimates: PropTypes.func.isRequired,
    from: PropTypes.object,
    storageLimit: PropTypes.string,
    gasLimit: PropTypes.string,
    gasPrice: PropTypes.string,
    gasTotal: PropTypes.string,
    storageTotal: PropTypes.string,
    sponsorshipInfoIsLoading: PropTypes.bool,
    hasHexData: PropTypes.bool,
    history: PropTypes.object,
    network: PropTypes.string,
    primaryCurrency: PropTypes.string,
    resetSendState: PropTypes.func.isRequired,
    selectedAddress: PropTypes.string,
    selectedToken: PropTypes.object,
    showHexData: PropTypes.bool,
    to: PropTypes.string,
    toNickname: PropTypes.string,
    tokens: PropTypes.array,
    tokenBalance: PropTypes.string,
    tokenContract: PropTypes.object,
    updateAndSetGasAndStorageLimit: PropTypes.func.isRequired,
    updateSendEnsResolution: PropTypes.func.isRequired,
    updateSendEnsResolutionError: PropTypes.func.isRequired,
    updateSendErrors: PropTypes.func.isRequired,
    updateSendTo: PropTypes.func.isRequired,
    updateSendTokenBalance: PropTypes.func.isRequired,
    updateToNicknameIfNecessary: PropTypes.func.isRequired,
    scanQrCode: PropTypes.func.isRequired,
    qrCodeDetected: PropTypes.func.isRequired,
    qrCodeData: PropTypes.object,
    trustedTokenMap: PropTypes.object,
    hexData: PropTypes.string,
  }

  static contextTypes = {
    t: PropTypes.func,
    // metricsEvent: PropTypes.func,
  }

  state = {
    hasAddressError: false,
    validatingAddress: false,
    query: '',
    toError: null,
    toWarning: null,
  }

  constructor(props) {
    super(props)
    this.dValidate = debounce(this.validate, 1000)
  }

  componentDidUpdate(prevProps) {
    const {
      gasPrice,
      amount,
      amountConversionRate,
      conversionRate,
      from: { address, balance },
      storageTotal,
      network,
      primaryCurrency,
      selectedToken,
      tokenBalance,
      updateSendErrors,
      updateSendTo,
      updateSendTokenBalance,
      tokenContract,
      to,
      toNickname,
      addressBook,
      updateToNicknameIfNecessary,
      qrCodeData,
      qrCodeDetected,
      gasTotalCountSponsorshipInfo,
      sponsorshipInfoIsLoading,
      showHexData,
      hexData,
    } = this.props

    let updateGas = false
    const {
      from: { balance: prevBalance },
      gasPrice: prevGasPrice,
      gasTotal: prevGasTotal,
      storageTotal: prevStorageTotal,
      sponsorshipInfoIsLoading: prevSponsorshipInfoIsLoading,
      tokenBalance: prevTokenBalance,
      network: prevNetwork,
      selectedToken: prevSelectedToken,
      to: prevTo,
      gasTotalCountSponsorshipInfo: prevGasTotalCountSponsorshipInfo,
      sendErrors: prevSendErrors = {},
    } = prevProps

    const uninitialized = [prevBalance, prevGasTotal].every(n => n === null)
    const sendErrors = {}
    let hexDataErrorRequiresUpdate = false

    if (showHexData) {
      const hexDataError = getHexDataErrorObject(hexData)
      if (prevSendErrors.hexData !== hexDataError.hexData) {
        Object.assign(sendErrors, hexDataError)
        hexDataErrorRequiresUpdate = true
      }
    }

    const amountErrorRequiresUpdate = doesAmountErrorRequireUpdate({
      gasPrice,
      prevGasPrice,
      balance,
      storageTotal,
      prevStorageTotal,
      gasTotal: gasTotalCountSponsorshipInfo,
      prevBalance,
      prevGasTotal: prevGasTotalCountSponsorshipInfo,
      prevTokenBalance,
      selectedToken,
      tokenBalance,
      sponsorshipInfoIsLoading,
      prevSponsorshipInfoIsLoading,
    })

    if (amountErrorRequiresUpdate) {
      const amountErrorObject = getAmountErrorObject({
        amount,
        amountConversionRate,
        balance,
        conversionRate,
        gasTotal: gasTotalCountSponsorshipInfo,
        primaryCurrency,
        selectedToken,
        tokenBalance,
      })
      const gasPriceError = getGasPriceErrorObject({ gasPrice })

      const gasAndCollateralFeeErrorObject = selectedToken
        ? getGasFeeErrorObject({
            amountConversionRate,
            balance,
            conversionRate,
            gasTotal: gasTotalCountSponsorshipInfo,
            primaryCurrency,
            selectedToken,
          })
        : { gasAndCollateralFee: null }
      Object.assign(
        sendErrors,
        amountErrorObject,
        gasAndCollateralFeeErrorObject,
        gasPriceError
      )
    }

    if (amountErrorRequiresUpdate || hexDataErrorRequiresUpdate) {
      updateSendErrors(sendErrors)
    }

    if (!uninitialized) {
      if (network !== prevNetwork && network !== 'loading') {
        updateSendTokenBalance({
          selectedToken,
          tokenContract,
          address,
        })
        updateToNicknameIfNecessary(to, toNickname, addressBook)
        updateGas = true
      }
    }

    const prevTokenAddress = prevSelectedToken && prevSelectedToken.address
    const selectedTokenAddress = selectedToken && selectedToken.address

    if (selectedTokenAddress && prevTokenAddress !== selectedTokenAddress) {
      this.updateSendToken()
      updateGas = true
    }

    let scannedAddress
    if (qrCodeData) {
      if (qrCodeData.type === 'address') {
        scannedAddress = qrCodeData.values.address.toLowerCase()
        const currentAddress = prevTo && prevTo.toLowerCase()
        if (currentAddress !== scannedAddress) {
          updateSendTo(scannedAddress)
          updateGas = true
          // Clean up QR code data after handling
          qrCodeDetected(null)
        }
      }
    }

    if (updateGas) {
      if (scannedAddress) {
        this.updateGas({ to: scannedAddress })
      } else {
        this.updateGas()
      }
    }
  }

  componentDidMount() {
    this.props.fetchBasicGasEstimates().then(() => {
      this.updateGas()
    })
  }

  UNSAFE_componentWillMount() {
    this.updateSendToken()

    // Show QR Scanner modal  if ?scan=true
    if (window.location.search === '?scan=true') {
      this.props.scanQrCode()

      // Clear the queryString param after showing the modal
      const cleanUrl = location.href.split('?')[0]
      history.pushState({}, null, `${cleanUrl}`)
      window.location.hash = '#send'
    }
  }

  componentWillUnmount() {
    this.props.resetSendState()
  }

  onRecipientInputChange = query => {
    if (query) {
      this.dValidate(query)
    } else {
      this.validate(query)
    }

    this.setState({
      query,
    })
  }

  validate(query) {
    const {
      hasHexData,
      tokens,
      selectedToken,
      network,
      trustedTokenMap,
    } = this.props

    if (!query) {
      return this.setState({ toError: '', toWarning: '' })
    }

    this.setState({
      ...this.state,
      hasAddressError: false,
      validatingAddress: true,
    })

    Promise.all([
      getToErrorObject(query, null, hasHexData, tokens, selectedToken, network),
      getToWarningObject(query, null, tokens, selectedToken, trustedTokenMap),
    ]).then(([toErrorObject, toWarningObject]) =>
      this.setState({
        hasAddressError: Boolean(toErrorObject && toErrorObject.to),
        validatingAddress: false,
        toError: toErrorObject.to,
        toWarning: toWarningObject.to,
      })
    )
  }

  updateSendToken() {
    const {
      from: { address },
      selectedToken,
      tokenContract,
      updateSendTokenBalance,
    } = this.props

    updateSendTokenBalance({
      selectedToken,
      tokenContract,
      address,
    })
  }

  updateGas({ to: updatedToAddress, amount: value, data } = {}) {
    const {
      amount,
      blockGasLimit,
      editingTransactionId,
      storageLimit,
      gasLimit,
      gasPrice,
      selectedAddress,
      selectedToken = {},
      to: currentToAddress,
      updateAndSetGasAndStorageLimit,
    } = this.props

    updateAndSetGasAndStorageLimit({
      blockGasLimit,
      editingTransactionId,
      storageLimit,
      gasLimit,
      gasPrice,
      selectedAddress,
      selectedToken,
      to: getToAddressForGasUpdate(updatedToAddress, currentToAddress),
      value: value || amount,
      data,
    })
  }

  render() {
    const { history, to } = this.props
    let content

    if (to) {
      content = this.renderSendContent()
    } else {
      content = this.renderAddRecipient()
    }

    return (
      <div className="page-container">
        <SendHeader history={history} />
        {this.renderInput()}
        {this.renderAddressWarning()}
        {content}
      </div>
    )
  }

  renderAddressWarning() {
    const { to } = this.props
    const { t } = this.context
    const isContract = to && to.startsWith('0x8')
    return (
      <div
        className="send__address-warning-row"
        style={{ fontSize: isContract ? 'smaller' : 'unset' }}
      >
        {isContract && t('confluxContractAddressWarningSend')}
        {!to && t('confluxAddressWarningSend')}
      </div>
    )
  }

  renderInput() {
    return (
      <EnsInput
        className="send__to-row"
        scanQrCode={_ => {
          /* this.context.metricsEvent({ */
          /*   eventOpts: { */
          /*     category: 'Transactions', */
          /*     action: 'Edit Screen', */
          /*     name: 'Used QR scanner', */
          /*   }, */
          /* }) */
          this.props.scanQrCode()
        }}
        onChange={this.onRecipientInputChange}
        onValidAddressTyped={address => this.props.updateSendTo(address, '')}
        onPaste={text => {
          this.props.updateSendTo(text) && this.updateGas()
        }}
        onReset={() => this.props.updateSendTo('', '')}
        updateEnsResolution={this.props.updateSendEnsResolution}
        updateEnsResolutionError={this.props.updateSendEnsResolutionError}
      />
    )
  }

  renderAddRecipient() {
    const {
      toError,
      toWarning,
      validatingAddress,
      hasAddressError,
    } = this.state

    return (
      <AddRecipient
        updateGas={({ to, amount, data } = {}) =>
          this.updateGas({ to, amount, data })
        }
        query={hasAddressError || validatingAddress ? '' : this.state.query}
        toError={toError}
        toWarning={toWarning}
      />
    )
  }

  renderSendContent() {
    const { history, showHexData } = this.props

    return [
      <SendContent
        key="send-content"
        updateGas={({ to, amount, data } = {}) =>
          this.updateGas({ to, amount, data })
        }
        showHexData={showHexData}
      />,
      <SendFooter key="send-footer" history={history} />,
    ]
  }
}
