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
    it('should do something', async () => {
      try {
        // Change for WIF of a paper wallet with tokens
        const paperWIF = 'KzFKj4YvVGeU3kpvZwzAwi1ufFj1pvjtVpCxHUpFDeBqqcGR7z8R'

        // Receiver SLP Address
        const slpAddress = 'simpleledger:qpssff7ppah43rhugcs7uvd60qth44sad5je7x6grv'

        // Receiver WIF address
        const WIFFromReceiver = 'Ky3bWfHTyGP1fhnHKYxZa8KJYpmRguGQFbc8dUX6R4rG7dPmm3vQ'

        // Instancing the library
        const sweeperLib = new SweeperLib(paperWIF, WIFFromReceiver)
        await sweeperLib.populateObjectFromNetwork()

        // Constructing the sweep transaction
        const transactionHex = await sweeperLib.sweepTo(slpAddress)
        const txId = await sweeperLib.broadcast(transactionHex)

        assert.isString(transactionHex)
        assert.isString(txId)

        console.log('Transaction ID', txId)
        console.log(`https://explorer.bitcoin.com/bch/tx/${txId}`)
      } catch (error) {
        assert.equal(true, false)
      }
    })
  })
})
