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

    it('should sweep the first 15 token UTXOs', async () => {
      /*
        TODO:
        To exercise this test case, create a script that can generate 20
        SLP token UTXOs of the same token.

        The behavior of the sweepTo() function is that it should only try to
        sweep the first 15 token UTXOs. Any UTXO lookup or hydration should
        use a POST call and only use up to 20 elements.
      */
      assert.equal(1, 1)
    })
  })
})
