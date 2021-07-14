/*
  Integration tests for the index.js main library.
*/

// npm libraries
const assert = require('chai').assert

// const { mockSingleSweepWithBch } = require('../unit/mocks/util-mocks')
const BCHJS = require('@psf/bch-js')
const bchjs = new BCHJS()
// Locally global variables.

// Unit under test
const SweeperLib = require('../../index')
let uut

describe('#index.js', () => {
  describe('#sweepTo', () => {
    it('should throw an error when there are no UTXOs', async () => {
      try {
        const wif = 'KxtteuKQ2enad5jH2o5eGkSaTgas49kWmvADW6qqhLAURrxuUo7m'
        const sweepToAddr =
          'simpleledger:qqcun9hyykrlcfwpkgakryk55mdnuczvt5v60t0zqj'

        uut = new SweeperLib(wif, wif, bchjs)
        await uut.populateObjectFromNetwork()

        await uut.sweepTo(sweepToAddr)
      } catch (err) {
        // console.log('err: ', err)
        assert.include(err.message, 'No BCH or tokens found on paper wallet')
      }
    })

    it('should sweep the first 5 token UTXOs', async () => {
      const paperWif = 'Kx2MD7FBdWhQyA7Hf1L17DAZ2mcvDXVaJkFHfXRDysBjUafY1CJS'
      const receiverWif = 'L3TU7JMULx6GGXMAt3UDHNt6XXsfNQL8EwLBjZQ1ZMFV36PKecwW'
      const sweepToAddr =
        'simpleledger:qzaw2tcjyylu0zrwcauaqtyvt7m3wzzgkvg5alvsx3'

      const limit = 5
      uut = new SweeperLib(paperWif, receiverWif, bchjs, 0, sweepToAddr)
      uut.limitOfTokenUtxos = limit

      await uut.populateObjectFromNetwork()

      await uut.sweepTo()
      assert.equal(uut.UTXOsFromPaperWallet.tokenUTXOs.length, limit)
    })
  })
})
