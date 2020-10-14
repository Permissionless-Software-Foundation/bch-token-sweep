/*
  Unit tests for the main index.js file.
*/

// External npm libraries
const assert = require('chai').assert
const sinon = require('sinon')

// Local libraries
const SweeperLib = require('../../index.js')
const mockData = require('./mocks/bch-token-sweep-mocks.js')

let sandbox
let uut

describe('#index.js', () => {
  // Wallets used for testing.
  const receiverWIF = 'L22cDXNCqu2eWsGrZw7esnTyE91R7eZA1o7FND6pLGuEXrV8z4B8'
  // const receiverCashAddr =
  //   'bitcoincash:qz726wyev5tk9d6vm23d5m4mrg92w4ke75dgkpne2j'
  // const receiverSlpAddress =
  // 'simpleledger: qz726wyev5tk9d6vm23d5m4mrg92w4ke75pna6xe5v'

  const paperWIF = 'KyvkSiN6gWjQenpkKSQzDh1JphuBYhsanGN5ZCL6bTy81fJL8ank'
  // const paperCashAddr = 'bitcoincash:qzzdt404ypq8hmrgctca8qm80u44k5fn3u5fzq6wft'

  // Restore the sandbox before each test.
  beforeEach(() => {
    sandbox = sinon.createSandbox()

    uut = new SweeperLib(paperWIF, receiverWIF)
  })

  afterEach(() => sandbox.restore())

  describe('#constructor', () => {
    it('should instantiate the sweep library', () => {
      uut = new SweeperLib(paperWIF, receiverWIF)

      assert.property(uut.paper, 'wif')
      assert.property(uut.paper, 'ecPair')
      assert.property(uut.paper, 'bchAddr')
      assert.property(uut.paper, 'slpAddr')

      assert.property(uut.receiver, 'wif')
      assert.property(uut.receiver, 'ecPair')
      assert.property(uut.receiver, 'bchAddr')
      assert.property(uut.receiver, 'slpAddr')
    })

    it('should throw an error if paper wallet wif is not included', () => {
      try {
        uut = new SweeperLib()
      } catch (err) {
        assert.include(err.message, 'WIF from paper wallet is required')
      }
    })

    it('should throw an error if receiver wallet wif is not included', () => {
      try {
        uut = new SweeperLib(paperWIF)
      } catch (err) {
        assert.include(err.message, 'WIF from receiver is required')
      }
    })
  })

  describe('#populateObjectFromNetwork', () => {
    it('should populate the instance with UTXO data', async () => {
      // Mock the function that make network calls.
      mockUtxos()

      await uut.populateObjectFromNetwork()
      // console.log('uut: ', uut)

      // Assert that the instance has the balance and utxo information.
      assert.equal(uut.BCHBalanceFromReceiver, 10000)
      assert.equal(uut.BCHBalanceFromPaperWallet, 546)

      assert.equal(
        uut.UTXOsFromReceiver.bchUTXOs,
        mockData.filteredUtxosFromReceiver.bchUTXOs
      )
      assert.equal(
        uut.UTXOsFromPaperWallet.tokenUTXOs,
        mockData.filteredUtxosFromPaperWallet.tokenUTXOs
      )
      assert.equal(
        uut.UTXOsFromPaperWallet.bchUTXOs,
        mockData.filteredUtxosFromPaperWallet.bchUTXOs
      )
    })

    it('should handle and throw an error', async () => {
      try {
        sandbox
          .stub(uut.blockchain, 'getBalanceForCashAddr')
          .rejects(new Error('test error'))

        // Populate the instance with UTXO data.
        await uut.populateObjectFromNetwork()

        assert.equal(true, false, 'Unexpect result')
      } catch (err) {
        // console.log(err)
        assert.include(err.message, 'test error')
      }
    })
  })

  describe('#getTokenIds', () => {
    it('should return token ID for a single UTXO', () => {
      const result = uut.getTokenIds(
        mockData.filteredUtxosFromPaperWallet.tokenUTXOs
      )
      // console.log(`result: ${JSON.stringify(result, null, 2)}`)

      assert.isArray(result)
      assert.equal(result.length, 1)
    })

    it('should return token ID for a single UTXO', () => {
      const result = uut.getTokenIds(mockData.mockTwoTokenUtxos)
      // console.log(`result: ${JSON.stringify(result, null, 2)}`)

      assert.isArray(result)
      assert.equal(result.length, 2)
    })

    it('should throw an error if input is not an array', () => {
      try {
        uut.getTokenIds('12345')

        assert.equal(true, false, 'Unexpected result')
      } catch (err) {
        // console.log(err)
        assert.include(err.message, 'Input must be an array')
      }
    })
  })

  describe('#sweepTo', () => {
    it('should return a hex transaction for sweeping tokens when paper wallet has no BCH', async () => {
      // Mock the function that make network calls.
      mockUtxos()

      // Populate the instance with UTXO data.
      await uut.populateObjectFromNetwork()

      // Constructing the sweep transaction
      const transactionHex = await uut.sweepTo(uut.receiver.slpAddr)
      // console.log('transactionHex: ', transactionHex)

      // The function should return a hex encoded string representing a transaction.
      assert.isString(transactionHex)
    })
  })
})

// Mocks the UTXOs for different tests.
function mockUtxos () {
  sandbox
    .stub(uut.blockchain, 'getBalanceForCashAddr')
    // The reciever wallet.
    .onCall(0)
    .resolves(10000)
    // The paper wallet.
    .onCall(1)
    .resolves(546)
  sandbox
    .stub(uut.blockchain, 'getUtxos')
    // The reciever wallet.
    .onCall(0)
    .resolves(mockData.utxosFromReceiver)
    // The paper wallet.
    .onCall(1)
    .resolves(mockData.utxosFromPaperWallet)
  sandbox
    .stub(uut.blockchain, 'filterUtxosByTokenAndBch')
    // The reciever wallet.
    .onCall(0)
    .resolves(mockData.filteredUtxosFromReceiver)
    // The paper wallet.
    .onCall(1)
    .resolves(mockData.filteredUtxosFromPaperWallet)
}
