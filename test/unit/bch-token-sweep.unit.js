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
  const receiverCashAddr =
    'bitcoincash:qz726wyev5tk9d6vm23d5m4mrg92w4ke75dgkpne2j'
  const receiverSlpAddress =
    'simpleledger: qz726wyev5tk9d6vm23d5m4mrg92w4ke75pna6xe5v'

  const paperWIF = 'KyvkSiN6gWjQenpkKSQzDh1JphuBYhsanGN5ZCL6bTy81fJL8ank'
  const paperCashAddr = 'bitcoincash:qzzdt404ypq8hmrgctca8qm80u44k5fn3u5fzq6wft'

  // Restore the sandbox before each test.
  beforeEach(() => {
    sandbox = sinon.createSandbox()
    uut = new SweeperLib(paperWIF, receiverWIF)
  })

  afterEach(() => sandbox.restore())

  describe('#constructor', () => {
    it('should instantiate the sweep library', () => {
      const sweeperLib = new SweeperLib(paperWIF, receiverWIF)
      // console.log('sweeperLib: ', sweeperLib)

      // Assert that the WIFs were recieved and decoded correctly.
      assert.equal(sweeperLib.WIFFromPaperWallet, paperWIF)
      assert.equal(sweeperLib.CashAddrFromPaperWallet, paperCashAddr)

      assert.equal(sweeperLib.WIFFromReceiver, receiverWIF)
      assert.equal(sweeperLib.CashAddrFromReceiver, receiverCashAddr)
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
  })

  describe('#populateObjectFromNetwork', () => {
    it('should populate the Class instance with data from the blockchain', async () => {
      // Mock the function that make network calls.
      mockUtxos()

      // Populate the instance with UTXO data.
      await uut.populateObjectFromNetwork()

      assert.equal(true, true, 'Not throwing an error is a success.')
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

  describe('#sweepTo', () => {
    it('should return a hex transaction for sweeping tokens when paper wallet has no BCH', async () => {
      // Mock the function that make network calls.
      mockUtxos()

      // Populate the instance with UTXO data.
      await uut.populateObjectFromNetwork()

      // Constructing the sweep transaction
      const transactionHex = await uut.sweepTo(receiverSlpAddress)
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
