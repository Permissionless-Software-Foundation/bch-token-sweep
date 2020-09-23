/*
  Unit tests for the main index.js file.
*/

// External npm libraries
const assert = require('chai').assert

const SweeperLib = require('../../index.js')

describe('#index.js', () => {
  describe('constructor', () => {
    it('should instantiate the sweep library', () => {
      const receiverWIF =
        'L22cDXNCqu2eWsGrZw7esnTyE91R7eZA1o7FND6pLGuEXrV8z4B8'
      const receiverCashAddr = 'bitcoincash:qz726wyev5tk9d6vm23d5m4mrg92w4ke75dgkpne2j'

      const paperWIF = 'KyvkSiN6gWjQenpkKSQzDh1JphuBYhsanGN5ZCL6bTy81fJL8ank'
      const paperCashAddr = 'bitcoincash:qzzdt404ypq8hmrgctca8qm80u44k5fn3u5fzq6wft'

      const sweeperLib = new SweeperLib(paperWIF, receiverWIF)
      // console.log('sweeperLib: ', sweeperLib)

      // Assert that the WIFs were recieved and decoded correctly.
      assert.equal(sweeperLib.WIFFromPaperWallet, paperWIF)
      assert.equal(sweeperLib.CashAddrFromPaperWallet, paperCashAddr)

      assert.equal(sweeperLib.WIFFromReceiver, receiverWIF)
      assert.equal(sweeperLib.CashAddrFromReceiver, receiverCashAddr)
    })
  })
})
