import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import Identicon from '../../ui/identicon'
import Tooltip from '../../ui/tooltip-v2'
import copyToClipboard from 'copy-to-clipboard'
import AddressWarning from '../../ui/address-warning'
import { base32AddressSlicer } from '../../../helpers/utils/util'

export default class AccountDetails extends Component {
  static contextTypes = {
    t: PropTypes.func.isRequired,
    metricsEvent: PropTypes.func,
  }

  static defaultProps = {
    hideSidebar: () => {},
    showAccountDetailModal: () => {},
  }

  static propTypes = {
    hideSidebar: PropTypes.func,
    showAccountDetailModal: PropTypes.func,
    showConnectedSites: PropTypes.func.isRequired,
    label: PropTypes.string.isRequired,
    selectedBase32Address: PropTypes.string.isRequired,
    checksummedAddress: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
  }

  state = {
    hasCopied: false,
    copyToClipboardPressed: false,
  }

  copyAddress() {
    copyToClipboard(this.props.selectedBase32Address)
    this.context.metricsEvent({
      eventOpts: {
        category: 'Navigation',
        action: 'Home',
        name: 'Copied Address',
      },
    })
    this.setState({ hasCopied: true })
    setTimeout(() => this.setState({ hasCopied: false }), 3000)
  }

  render() {
    const { t } = this.context

    const {
      hideSidebar,
      showAccountDetailModal,
      showConnectedSites,
      label,
      checksummedAddress,
      selectedBase32Address,
      name,
    } = this.props

    const { hasCopied, copyToClipboardPressed } = this.state

    return (
      <div>
        <div className="flex-column account-details">
          <div
            className="account-details__sidebar-close"
            onClick={hideSidebar}
          />
          <div className="account-details__keyring-label allcaps">{label}</div>
          <div className="flex-column flex-center account-details__name-container">
            <Identicon
              diameter={54}
              address={checksummedAddress}
              onClick={showAccountDetailModal}
            />
            <span className="account-details__account-name">{name}</span>
            <div className="account-details__details-buttons">
              <button
                className="btn-secondary account-details__details-button"
                onClick={showAccountDetailModal}
              >
                {t('details')}
              </button>
              <button
                className="btn-secondary account-details__details-button"
                onClick={showConnectedSites}
              >
                {t('connectedSites')}
              </button>
            </div>
          </div>
        </div>
        <Tooltip
          position="bottom"
          html={
            (
<AddressWarning warning={' ' + t('base32AddressNoticeShort')}>
              {hasCopied ? t('copiedExclamation') : t('copyToClipboard')}
</AddressWarning>
)
          }
          wrapperClassName="account-details__tooltip is-warning"
        >
          <button
            className={classnames({
              'account-details__address': true,
              'account-details__address__pressed': copyToClipboardPressed,
            })}
            onClick={() => this.copyAddress()}
            onMouseDown={() => this.setState({ copyToClipboardPressed: true })}
            onMouseUp={() => this.setState({ copyToClipboardPressed: false })}
          >
            {base32AddressSlicer(selectedBase32Address)}
            <i className="fa fa-clipboard" style={{ marginLeft: '8px' }} />
          </button>
        </Tooltip>
      </div>
    )
  }
}
