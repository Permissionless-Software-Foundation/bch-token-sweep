/*
  Unit tests for the util.js utility library.

  TODO: Testing strategy: Start with all the small subfunctions, and work up
  the complexity until we get to the parent sweepTo() function.
*/

// npm libraries
const assert = require('chai').assert
const BCHJS = require('@psf/bch-js')
const sinon = require('sinon')

// Locally global variables.
const bchjs = new BCHJS()
let sandbox
let mockData
let uut

// Mocking data.
const mockDataLib = require('../unit/mocks/transactions-mocks')

// Unit under test
const TransactionsLib = require('../../lib/transactions')

describe('#util.js', () => {
  beforeEach(async () => {
    // uut = new Blockchain()

    mockData = Object.assign({}, mockDataLib)

    sandbox = sinon.createSandbox()

    // Generate
    const rootSeedPaper = await bchjs.Mnemonic.toSeed(
      mockData.mockSingleSweepWithBch.mnemonic
    )
    const masterHDNodePaper = bchjs.HDNode.fromSeed(rootSeedPaper)
    const accountPaper = bchjs.HDNode.derivePath(
      masterHDNodePaper,
      "m/44'/245'/0'"
    )
    const changePaper = bchjs.HDNode.derivePath(accountPaper, '0/0')
    const ECPairPaper = bchjs.HDNode.toKeyPair(changePaper)

    uut = new TransactionsLib(
      bchjs,
      undefined,
      ECPairPaper,
      mockData.mockSingleSweepWithBch.toCashAddr,
      mockData.mockSingleSweepWithBch.toSlp
    )
  })

  afterEach(() => sandbox.restore())

  describe('#calculateSendCost', () => {
    it('should calculate fee with no inputs', () => {
      const result = uut.calculateSendCost(0, 0, 2)
      // console.log(`result: ${result}`)

      assert.equal(result, 930)
    })
  })

  // describe('#buildSweepSingleTokenWithBchFromPaper', () => {
  //   it('should match the expected hex for sucessful transaction', async () => {
  //     // Generate an EC Pair to simulate the scanning of a WIF from a paper wallet.
  //     const rootSeedPaper = await bchjs.Mnemonic.toSeed(
  //       mockData.mockSingleSweepWithBch.mnemonic
  //     )
  //     const masterHDNodePaper = bchjs.HDNode.fromSeed(rootSeedPaper)
  //     const accountPaper = bchjs.HDNode.derivePath(
  //       masterHDNodePaper,
  //       "m/44'/245'/0'"
  //     )
  //     const changePaper = bchjs.HDNode.derivePath(accountPaper, '0/0')
  //     const ECPairPaper = bchjs.HDNode.toKeyPair(changePaper)
  //
  //     // Test the library.
  //     const util = new TransactionsLib(
  //       bchjs,
  //       undefined,
  //       ECPairPaper,
  //       mockData.mockSingleSweepWithBch.toCashAddr,
  //       mockData.mockSingleSweepWithBch.toSlp
  //     )
  //     const hex = util.buildSweepSingleTokenWithBchFromPaper(
  //       mockData.mockSingleSweepWithBch.tokenUTXOs,
  //       mockData.mockSingleSweepWithBch.bchUTXOs
  //     )
  //
  //     // Assert that the hext strings match.
  //     assert.equal(hex, mockData.mockSingleSweepWithBch.resultHex)
  //   })
  // })
})
