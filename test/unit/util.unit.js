/*
  Integration tests for the util.js utility library.
*/

// npm libraries
const chai = require('chai')
const { mockSingleSweepWithBch } = require('../unit/mocks/util-mocks')
const BCHJS = require('@psf/bch-js')
const bchjs = new BCHJS()
// Locally global variables.
const assert = chai.assert

// Unit under test
const UtilLib = require('../../lib/util')

describe('#util.js', () => {
  describe('#buildSweepSingleTokenWithBchFromPaper', () => {
    it('should match the expected hex for sucessful transaction', async () => {
      // Generate an EC Pair to simulate the scanning of a WIF from a paper wallet.
      const rootSeedPaper = await bchjs.Mnemonic.toSeed(
        mockSingleSweepWithBch.mnemonic
      )
      const masterHDNodePaper = bchjs.HDNode.fromSeed(rootSeedPaper)
      const accountPaper = bchjs.HDNode.derivePath(
        masterHDNodePaper,
        "m/44'/245'/0'"
      )
      const changePaper = bchjs.HDNode.derivePath(accountPaper, '0/0')
      const ECPairPaper = bchjs.HDNode.toKeyPair(changePaper)

      // Test the library.
      const util = new UtilLib(
        bchjs,
        undefined,
        ECPairPaper,
        mockSingleSweepWithBch.toCashAddr,
        mockSingleSweepWithBch.toSlp
      )
      const hex = util.buildSweepSingleTokenWithBchFromPaper(
        mockSingleSweepWithBch.tokenUTXOs,
        mockSingleSweepWithBch.bchUTXOs
      )

      // Assert that the hext strings match.
      assert.equal(hex, mockSingleSweepWithBch.resultHex)
    })
  })
})
