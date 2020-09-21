/*
  Integration tests for the util.js utility library.
*/

// npm libraries
const chai = require('chai')

const assert = chai.assert

// Unit under test
const SweeperLib = require('../../index')

describe('#index.js', () => {
  describe('#Sweep tokens', () => {
    it('should sweep tokens', async () => {
      try {
        // Reciever Info. Can be generated with get-key command from slp-cli-wallet.
        // Send BCH to this address to pay for transaction fees.
        const wIFFromReceiver =
          'L22cDXNCqu2eWsGrZw7esnTyE91R7eZA1o7FND6pLGuEXrV8z4B8'
        const slpAddress =
          'simpleledger: qz726wyev5tk9d6vm23d5m4mrg92w4ke75pna6xe5v'
        // bitcoincash:qz726wyev5tk9d6vm23d5m4mrg92w4ke75dgkpne2j

        // Paper wallet info. Can also be generated with get-key command from
        // slp-cli-wallet.
        // Send tokens to this address to sweep them.
        const paperWIF = 'KyvkSiN6gWjQenpkKSQzDh1JphuBYhsanGN5ZCL6bTy81fJL8ank'
        // bitcoincash:qzzdt404ypq8hmrgctca8qm80u44k5fn3u5fzq6wft
        // simpleledger:qzzdt404ypq8hmrgctca8qm80u44k5fn3ucjfm0wh4

        // Instancing the library
        const sweeperLib = new SweeperLib(paperWIF, wIFFromReceiver)
        await sweeperLib.populateObjectFromNetwork()

        // Constructing the sweep transaction
        const transactionHex = await sweeperLib.sweepTo(slpAddress)
        // console.log('transactionHex: ', transactionHex)

        // Broadcast the transaction to the network.
        const txId = await sweeperLib.broadcast(transactionHex)

        assert.isString(transactionHex)
        assert.isString(txId)

        console.log('Transaction ID', txId)
        console.log(`https://explorer.bitcoin.com/bch/tx/${txId}`)
      } catch (error) {
        console.error('Error: ', error)
        assert.equal(true, false)
      }
    })
  })
})
