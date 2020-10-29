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
const receiverWif = 'L22cDXNCqu2eWsGrZw7esnTyE91R7eZA1o7FND6pLGuEXrV8z4B8'
const paperWif = 'KyvkSiN6gWjQenpkKSQzDh1JphuBYhsanGN5ZCL6bTy81fJL8ank'

// Unit under test
const TransactionsLib = require('../../lib/transactions')

describe('#transactions.js', () => {
  beforeEach(async () => {
    mockData = Object.assign({}, mockDataLib)

    sandbox = sinon.createSandbox()

    // Instantiate the UUT each time.
    const config = {
      paperWif,
      receiverWif,
      bchjs
    }
    uut = new TransactionsLib(config)
  })

  afterEach(() => sandbox.restore())

  describe('#constructor', () => {
    it('should throw an error if paper wallet wif is not included', () => {
      try {
        const config = { bchjs }
        uut = new TransactionsLib(config)
      } catch (err) {
        assert.include(err.message, 'wif for paper wallet required')
      }
    })

    it('should throw an error if receiver wallet wif is not included', () => {
      try {
        const config = { paperWif, bchjs }
        uut = new TransactionsLib(config)
      } catch (err) {
        assert.include(err.message, 'wif for receiver wallet required')
      }
    })

    it('should accept an instance of bch-js', () => {
      const config = {
        bchjs,
        paperWif,
        receiverWif
      }

      uut = new TransactionsLib(config)

      assert.property(uut, 'config')
    })

    it('should throw an error if instance of bch-js is not passed in', () => {
      try {
        uut = new TransactionsLib({})

        assert.fail('Unexpected result')
      } catch (err) {
        assert.include(
          err.message,
          'bch-js instance must be passed when instantiating.'
        )
      }
    })
  })

  describe('#calculateSendCost', () => {
    it('should calculate fee with no inputs', () => {
      const result = uut.calculateSendCost(0, 0, 2)
      // console.log(`result: ${result}`)

      assert.equal(result, 2964)
    })
  })

  describe('#buildSweepSingleTokenWithBchFromPaper', () => {
    it('should match the expected hex for sucessful transaction', async () => {
      const hex = uut.buildSweepSingleTokenWithBchFromPaper(
        mockData.mockPaperHydratedUtxos.tokenUTXOs,
        mockData.mockPaperHydratedUtxos.bchUTXOs
      )

      // The function should return a hex string.
      assert.isString(hex)
    })

    it('should catch and throw an error', () => {
      try {
        // Force an error.
        sandbox
          .stub(uut.bchjs, 'TransactionBuilder')
          .throws(new Error('test error'))

        uut.buildSweepSingleTokenWithBchFromPaper(
          mockData.mockPaperHydratedUtxos.tokenUTXOs,
          mockData.mockPaperHydratedUtxos.bchUTXOs
        )

        assert.equal(true, false, 'Unexpected result')
      } catch (err) {
        // console.log(err)
        assert.include(err.message, 'test error')
      }
    })
  })

  describe('#buildSweepSingleTokenWithoutBchFromPaper', () => {
    it('should match the expected hex for sucessful transaction', async () => {
      const hex = uut.buildSweepSingleTokenWithoutBchFromPaper(
        mockData.mockPaperHydratedUtxos.tokenUTXOs,
        mockData.mockReceiverHydratedUtxos.bchUTXOs
      )

      // The function should return a hex string.
      assert.isString(hex)
    })

    it('should catch and throw an error', () => {
      try {
        // Force an error.
        sandbox
          .stub(uut.bchjs, 'TransactionBuilder')
          .throws(new Error('test error'))

        uut.buildSweepSingleTokenWithoutBchFromPaper(
          mockData.mockPaperHydratedUtxos.tokenUTXOs,
          mockData.mockReceiverHydratedUtxos.bchUTXOs
        )

        assert.equal(true, false, 'Unexpected result')
      } catch (err) {
        // console.log(err)
        assert.include(err.message, 'test error')
      }
    })
  })

  describe('#buildSweepOnlyBchFromPaper', () => {
    it('should match the expected hex for sucessful transaction', async () => {
      const hex = uut.buildSweepOnlyBchFromPaper(
        mockData.mockPaperHydratedUtxos.bchUTXOs
      )

      // The function should return a hex string.
      assert.isString(hex)
    })

    it('should catch and throw an error', () => {
      try {
        // Force an error.
        sandbox
          .stub(uut.bchjs, 'TransactionBuilder')
          .throws(new Error('test error'))

        uut.buildSweepOnlyBchFromPaper(mockData.mockPaperHydratedUtxos.bchUTXOs)

        assert.equal(true, false, 'Unexpected result')
      } catch (err) {
        // console.log(err)
        assert.include(err.message, 'test error')
      }
    })
  })
})
