/*
  Unit tests for the main index.js file.
*/

// External npm libraries
const assert = require('chai').assert
const sinon = require('sinon')

// Local libraries
const SweeperLib = require('../../index.js')
const mockData = require('./mocks/bch-token-sweep-mocks.js')

describe('#index.js', () => {
  // Wallets used for testing.
  const receiverWIF = 'L22cDXNCqu2eWsGrZw7esnTyE91R7eZA1o7FND6pLGuEXrV8z4B8'
  const receiverCashAddr =
    'bitcoincash:qz726wyev5tk9d6vm23d5m4mrg92w4ke75dgkpne2j'

  const paperWIF = 'KyvkSiN6gWjQenpkKSQzDh1JphuBYhsanGN5ZCL6bTy81fJL8ank'
  const paperCashAddr = 'bitcoincash:qzzdt404ypq8hmrgctca8qm80u44k5fn3u5fzq6wft'

  let uut
  let sandbox

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
      sandbox
        .stub(uut, 'getBalanceForCashAddr')
        // The reciever wallet.
        .onCall(0)
        .resolves(10000)
        // The paper wallet.
        .onCall(1)
        .resolves(546)
      sandbox
        .stub(uut, 'getUtxos')
        // The reciever wallet.
        .onCall(0)
        .resolves(mockData.utxosFromReceiver)
        // The paper wallet.
        .onCall(1)
        .resolves(mockData.utxosFromPaperWallet)
      sandbox
        .stub(uut, 'filterUtxosByTokenAndBch')
        // The reciever wallet.
        .onCall(0)
        .resolves(mockData.filteredUtxosFromReceiver)
        // The paper wallet.
        .onCall(1)
        .resolves(mockData.filteredUtxosFromPaperWallet)

      await uut.populateObjectFromNetwork()
      // console.log('uut: ', uut)

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
})
