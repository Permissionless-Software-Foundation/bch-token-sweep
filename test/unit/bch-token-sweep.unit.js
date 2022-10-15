/*
  Unit tests for the main index.js file.
*/

// External npm libraries
const assert = require('chai').assert
const sinon = require('sinon')
const cloneDeep = require('lodash.clonedeep')
// const BCHJS = require('@psf/bch-js')
const Wallet = require('minimal-slp-wallet')

// Local libraries
const SweeperLib = require('../../index.js')
const mockDataLib = require('./mocks/bch-token-sweep-mocks.js')

let sandbox
let uut
let mockData
// const bchjs = new BCHJS()

const advancedOptions = {
  noUpdate: true,
  interface: 'consumer-api'
}
const wallet = new Wallet(undefined, advancedOptions)

describe('#index.js', () => {
  // Wallets used for testing.
  const receiverWIF = 'L22cDXNCqu2eWsGrZw7esnTyE91R7eZA1o7FND6pLGuEXrV8z4B8'
  const paperWIF = 'KyvkSiN6gWjQenpkKSQzDh1JphuBYhsanGN5ZCL6bTy81fJL8ank'

  // Restore the sandbox before each test.
  beforeEach(() => {
    sandbox = sinon.createSandbox()

    mockData = cloneDeep(mockDataLib)

    uut = new SweeperLib(paperWIF, receiverWIF, wallet)
  })

  afterEach(() => sandbox.restore())

  describe('#constructor', () => {
    it('should instantiate the sweep library', () => {
      uut = new SweeperLib(paperWIF, receiverWIF, wallet)

      assert.property(uut.paper, 'wif')
      assert.property(uut.paper, 'ecPair')
      assert.property(uut.paper, 'bchAddr')
      assert.property(uut.paper, 'slpAddr')

      assert.property(uut.receiver, 'wif')
      assert.property(uut.receiver, 'ecPair')
      assert.property(uut.receiver, 'bchAddr')
      assert.property(uut.receiver, 'slpAddr')
    })

    it('should throw an error if wallet is not included', () => {
      try {
        uut = new SweeperLib()
      } catch (err) {
        assert.include(
          err.message,
          'minimal-slp-wallet instance must be passed when instantiating.'
        )
      }
    })

    it('should throw an error if paper wallet wif is not included', () => {
      try {
        uut = new SweeperLib(undefined, undefined, wallet)
      } catch (err) {
        assert.include(err.message, 'WIF from paper wallet is required')
      }
    })

    it('should throw an error if receiver wallet wif is not included', () => {
      try {
        uut = new SweeperLib(paperWIF, undefined, wallet)
      } catch (err) {
        assert.include(err.message, 'WIF from receiver is required')
      }
    })

    it('should instantiate with a to-address', () => {
      const toAddr = 'bitcoincash:qpqug5fmpgm0mpc4hep3cu3tm7fr7yvnjcwlq46dvk'

      uut = new SweeperLib(paperWIF, receiverWIF, wallet, 2000, toAddr)

      assert.equal(uut.toAddr, toAddr)
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

    // it('should limit utxos from paper wallet', async () => {
    //   // Mock the function that make network calls.
    //   mockWithLimiter()
    //   uut.limitOfTokenUtxos = 0
    //   await uut.populateObjectFromNetwork()
    //   // console.log('uut: ', uut)
    //
    //   assert.equal(uut.UTXOsFromPaperWallet.tokenUTXOs.length, 0)
    // })

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

    it('should return token IDs for two token class UTXOs', () => {
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

    it('should return an empty array if given an empty array', () => {
      const result = uut.getTokenIds([])

      assert.equal(result.length, 0)
    })
  })

  describe('#sweepTo', () => {
    it('should throw an error if paper wallet has no tokens or BCH', async () => {
      try {
        // Mock the function that make network calls.
        mockUtxos()

        // Populate the instance with UTXO data.
        await uut.populateObjectFromNetwork()

        // Force paper wallet UTXOs to be empty.
        uut.UTXOsFromPaperWallet.tokenUTXOs = []
        uut.UTXOsFromPaperWallet.bchUTXOs = []

        await uut.sweepTo(uut.receiver.slpAddr)
      } catch (err) {
        console.log(err)
        assert.include(err.message, 'No BCH or tokens found on paper wallet')
      }
    })

    it('should generate a BCH-only transaction if paper wallet has no tokens', async () => {
      // Mock the function that make network calls.
      mockUtxos()

      // Populate the instance with UTXO data.
      await uut.populateObjectFromNetwork()

      // Force paper wallet token UTXOs to be empty.
      uut.UTXOsFromPaperWallet.tokenUTXOs = []

      // Force paper wallet to have a BCH UTXO.
      uut.UTXOsFromPaperWallet.bchUTXOs =
        mockData.filteredUtxosFromReceiver.bchUTXOs
      uut.BCHBalanceFromPaperWallet = 10000

      const hex = await uut.sweepTo(uut.receiver.slpAddr)

      assert.isString(hex)
    })

    it('should throw error if both paper and receiver wallet does not have enough BCH to pay tx fees', async () => {
      try {
        // Mock the function that make network calls.
        mockUtxos()

        // Populate the instance with UTXO data.
        await uut.populateObjectFromNetwork()

        // Force paper wallet token UTXOs to be empty.
        uut.UTXOsFromPaperWallet.tokenUTXOs = []

        // Force paper wallet to have a BCH UTXO.
        uut.UTXOsFromPaperWallet.bchUTXOs = mockData.utxosFromPaperWallet
        uut.BCHBalanceFromReceiver = 546

        // Force receiver to have only dust
        uut.BCHBalanceFromReceiver = 546
        uut.UTXOsFromReceiver.bchUTXOs = mockData.utxosFromPaperWallet

        await uut.sweepTo(uut.receiver.slpAddr)

        assert.fail('Unexpected result')
      } catch (err) {
        assert.include(
          err.message,
          'Not enough BCH on the paper wallet to pay fees. Send more BCH to the paper wallet in order to sweep it.'
        )
      }
    })

    it('should generate a token-sweep tx if paper wallet has a single token and no BCH', async () => {
      // Mock the function that make network calls.
      mockUtxos()

      // Populate the instance with UTXO data.
      await uut.populateObjectFromNetwork()

      const hex = await uut.sweepTo(uut.receiver.slpAddr)

      assert.isString(hex)
    })

    it('should generate a token-sweep tx if paper wallet has a single NFT and no BCH', async () => {
      // Customize mock data for NFT
      mockData.filteredUtxosFromPaperWallet.nftUTXOs = mockData.filteredUtxosFromPaperWallet.tokenUTXOs
      mockData.filteredUtxosFromPaperWallet.tokenUTXOs = []
      // console.log('mockData.filteredUtxosFromPaperWallet: ', mockData.filteredUtxosFromPaperWallet)

      // Mock the function that make network calls.
      mockUtxos()

      // Populate the instance with UTXO data.
      await uut.populateObjectFromNetwork()

      uut.UTXOsFromPaperWallet.nftUtxos = mockData.filteredUtxosFromPaperWallet.nftUTXOs

      const hex = await uut.sweepTo(uut.receiver.slpAddr)

      assert.isString(hex)
    })

    it('should generate a token-sweep tx if paper wallet has two token types and no BCH', async () => {
      // Mock the function that make network calls.
      mockUtxos()

      // Populate the instance with UTXO data.
      await uut.populateObjectFromNetwork()

      // Force paper wallet token UTXOs to contain two token types.
      uut.UTXOsFromPaperWallet.tokenUTXOs = mockData.mockTwoTokenUtxos

      const hex = await uut.sweepTo(uut.receiver.slpAddr)

      assert.isString(hex)
    })

    it('should generate a token-sweep tx if paper wallet has a single token and BCH', async () => {
      // Mock the function that make network calls.
      mockUtxos()

      // Populate the instance with UTXO data.
      await uut.populateObjectFromNetwork()

      // Force paper wallet to have BCH.
      uut.BCHBalanceFromPaperWallet = 5000

      // Force receiver to have only dust
      uut.BCHBalanceFromReceiver = 546
      uut.UTXOsFromReceiver.bchUTXOs = mockData.utxosFromPaperWallet

      // Adjust values
      uut.paper = uut.blockchain.expandWif(
        'KxtteuKQ2enad5jH2o5eGkSaTgas49kWmvADW6qqhLAURrxuUo7m'
      )
      uut.UTXOsFromPaperWallet = mockData.mockAllPaperUtxosOneToken

      const hex = await uut.sweepTo(uut.receiver.slpAddr)

      assert.isString(hex)
    })

    it('should generate a token-sweep tx if paper wallet has two tokens and BCH', async () => {
      // Mock the function that make network calls.
      mockUtxos()

      // Populate the instance with UTXO data.
      await uut.populateObjectFromNetwork()

      // Adjust values
      uut.paper = uut.blockchain.expandWif(
        'KxtteuKQ2enad5jH2o5eGkSaTgas49kWmvADW6qqhLAURrxuUo7m'
      )
      uut.UTXOsFromPaperWallet = mockData.mockAllPaperUtxosTwoTokens

      const hex = await uut.sweepTo(uut.receiver.slpAddr)

      assert.isString(hex)
    })

    it('should throw error if paper has a token, but both paper and receiver wallet does not have enough BCH to pay tx fees', async () => {
      try {
        // Mock the function that make network calls.
        mockUtxos()

        // Populate the instance with UTXO data.
        await uut.populateObjectFromNetwork()

        // Force receiver to have only dust
        uut.BCHBalanceFromReceiver = 546
        uut.UTXOsFromReceiver.bchUTXOs = mockData.utxosFromPaperWallet

        await uut.sweepTo(uut.receiver.slpAddr)

        assert.fail('Unexpected result')
      } catch (err) {
        assert.include(
          err.message,
          'Not enough BCH on paper wallet or receiver wallet to pay fees.'
        )
      }
    })

    it('should choose receiver to pay fees for paper wallet with no BCH and a bunch of tokens', async () => {
      // Mock the function that make network calls.
      mockUtxos()

      // Populate the instance with UTXO data.
      await uut.populateObjectFromNetwork()

      // Force paper wallet to have a ton of token UTXOs and no BCH.
      uut.BCHBalanceFromPaperWallet = 10000
      uut.UTXOsFromPaperWallet = mockData.mockPaperWalletWithLotsOfTokens

      const hex = await uut.sweepTo(uut.receiver.slpAddr)

      assert.isString(hex)
    })

    it('should ignore a minting baton', async () => {
      // Mock the function that make network calls.
      mockUtxos()

      // Populate the instance with UTXO data.
      await uut.populateObjectFromNetwork()

      // Force the token UTXOs to have a minting baton UTXO.
      uut.UTXOsFromPaperWallet.tokenUTXOs = mockData.tokenUtxosWithMintingBaton
      // console.log(
      //   `uut.UTXOsFromPaperWallet.tokenUTXOs: ${JSON.stringify(
      //     uut.UTXOsFromPaperWallet.tokenUTXOs,
      //     null,
      //     2
      //   )}`
      // )

      const hex = await uut.sweepTo(uut.receiver.slpAddr)

      assert.isString(hex)
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
  // sandbox
  //   .stub(uut.blockchain, 'getUtxos')
  //   // The reciever wallet.
  //   .onCall(0)
  //   .resolves(mockData.utxosFromReceiver)
  //   // The paper wallet.
  //   .onCall(1)
  //   .resolves(mockData.utxosFromPaperWallet)
  sandbox.stub(uut.blockchain, 'filterUtxosByTokenAndBch2')
    // The reciever wallet.
    .onCall(0)
    .resolves(mockData.filteredUtxosFromReceiver)
    // The paper wallet.
    .onCall(1)
    .resolves(mockData.filteredUtxosFromPaperWallet)
}

// function mockWithLimiter () {
//   sandbox
//     .stub(uut.blockchain, 'getBalanceForCashAddr')
//     // The reciever wallet.
//     .onCall(0)
//     .resolves(10000)
//     // The paper wallet.
//     .onCall(1)
//     .resolves(546)
//   sandbox
//     .stub(uut.blockchain, 'getUtxos')
//     // The reciever wallet.
//     .onCall(0)
//     .resolves(mockData.utxosFromReceiver)
//     // The paper wallet.
//     .onCall(1)
//     .resolves(mockData.utxosFromPaperWallet)
//   sandbox
//     .stub(uut.blockchain.bchjs.SLP.Utils, 'hydrateUtxos')
//     // The reciever wallet.
//     .onCall(0)
//     .resolves({ slpUtxos: [{ utxos: mockData.mockTwoTokenUtxos }] })
// }
