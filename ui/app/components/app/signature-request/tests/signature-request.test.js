import React from 'react'
import assert from 'assert'
import shallow from '../../../../../lib/shallow-with-context'
import SignatureRequest from '../signature-request.component'

describe('Signature Request Component', function() {
  describe('render', function() {
    it('should render a div with one child', function() {
      const wrapper = shallow(
        <SignatureRequest
          network={2999}
          clearConfirmTransaction={() => {}}
          cancel={() => {}}
          sign={() => {}}
          txData={{
            msgParams: {
              data: '{"message": {"from": {"name": "hello"}}}',
              from: '0x1111111111111111111111111111111111111111',
            },
          }}
        />
      )

      assert(wrapper.is('div'))
      assert.equal(wrapper.length, 1)
      assert(wrapper.hasClass('signature-request'))
    })
  })
})
