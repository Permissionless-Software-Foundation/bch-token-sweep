// npm libraries
const assert = require('chai').assert
const sinon = require('sinon')
// const wallet = require('@psf/bch-js')
const Wallet = require('minimal-slp-wallet')

// Locally global variables.
// const wallet = new wallet()
const mockDataLib = require('./mocks/blockchain-mocks')
let mockData
let sandbox

// Unit under test
const Blockchain = require('../../lib/blockchain')
let uut

const advancedOptions = {
  noUpdate: true,
  interface: 'consumer-api'
}
const wallet = new Wallet(undefined, advancedOptions)

describe('#blockchain', () => {
  beforeEach(async () => {
    await wallet.walletInfoPromise

    const config = { wallet }
    uut = new Blockchain(config)

    mockData = Object.assign({}, mockDataLib)

    sandbox = sinon.createSandbox()
  })

  afterEach(() => sandbox.restore())

  describe('#constructor', () => {
    it('should instantiate the class', () => {
      const config = { wallet }
      uut = new Blockchain(config)

      assert.property(uut, 'config')
    })

    it('should accept an instance of bch-js', () => {
      const config = {
        wallet: wallet
      }

      uut = new Blockchain(config)

      assert.property(uut, 'config')
    })

    it('should throw an error if instance of bch-js is not passed in', () => {
      try {
        uut = new Blockchain()

        assert.fail('Unexpected result')
      } catch (err) {
        assert.include(
          err.message,
          'bch-js instance must be passed when instantiating.'
        )
      }
    })
  })

  describe('#getBalanceForCashAddr', () => {
    it('should get a balance for an address', async () => {
      // Mock live network calls.
      // sandbox
      //   .stub(uut.wallet.Electrumx, 'balance')
      //   .resolves(mockData.mockBalance)
      sandbox.stub(uut.wallet, 'getBalance').resolves(1600)

      const addr = 'bitcoincash:qz726wyev5tk9d6vm23d5m4mrg92w4ke75dgkpne2j'

      const result = await uut.getBalanceForCashAddr(addr)
      // console.log(`result: ${JSON.stringify(result, null, 2)}`)

      assert.isNumber(result)
    })

    it('should handle and throw an error', async () => {
      try {
        // Force an error.
        sandbox.stub(uut.wallet, 'getBalance').rejects('test error')

        const addr = 'bitcoincash:qz726wyev5tk9d6vm23d5m4mrg92w4ke75dgkpne2j'

        await uut.getBalanceForCashAddr(addr)

        assert.equal(true, false, 'Unexpected result')
      } catch (err) {
        assert.include(err.message, 'Could not get balance for')
      }
    })
  })

  // describe('#getUtxos', () => {
  //   it('should get utxos for an address', async () => {
  //     // Mock live network calls.
  //     sandbox
  //       .stub(uut.wallet.Electrumx, 'utxo')
  //       .resolves({ utxos: mockData.mockUtxos })
  //
  //     const addr = 'bitcoincash:qz726wyev5tk9d6vm23d5m4mrg92w4ke75dgkpne2j'
  //
  //     const result = await uut.getUtxos(addr)
  //     // console.log(`result: ${JSON.stringify(result, null, 2)}`)
  //
  //     assert.isArray(result)
  //   })
  //
  //   it('should handle and throw an error', async () => {
  //     try {
  //       // Force an error.
  //       sandbox.stub(uut.wallet.Electrumx, 'utxo').rejects('test error')
  //
  //       const addr = 'bitcoincash:qz726wyev5tk9d6vm23d5m4mrg92w4ke75dgkpne2j'
  //
  //       await uut.getUtxos(addr)
  //
  //       assert.equal(true, false, 'Unexpected result')
  //     } catch (err) {
  //       assert.include(err.message, 'Could not get UTXOs')
  //     }
  //   })
  // })

  describe('#filterUtxosByTokenAndBch2', () => {
    it('should hydrate and filter UTXOs', async () => {
      // Mock dependencies
      sandbox.stub(uut.wallet, 'getUtxos').resolves(mockData.mockUtxoGetOut02)

      const result = await uut.filterUtxosByTokenAndBch2('fake-addr')
      // console.log('result: ', result)

      assert.property(result, 'tokenUTXOs')
      assert.property(result, 'bchUTXOs')

      assert.equal(result.tokenUTXOs.length, 1)
      assert.equal(result.bchUTXOs.length, 2)
    })

    it('should handle and throw an error', async () => {
      try {
        // Force an error.
        sandbox.stub(uut.wallet, 'getUtxos').rejects(new Error('test error'))

        await uut.filterUtxosByTokenAndBch2('fake-addr')

        assert.fail('Unexpected code path')
      } catch (err) {
        assert.include(err.message, 'test error')
      }
    })
  })

  describe('#broadcast', () => {
    it('should return a txid', async () => {
      // Mock live network calls.
      sandbox
        .stub(uut.wallet.ar, 'sendTx')
        .resolves('txid')

      const result = await uut.broadcast('mock hex')

      assert.equal(result, 'txid')
    })
  })

  describe('#expandWif', () => {
    it('should expand a WIF', () => {
      const wif = 'L22cDXNCqu2eWsGrZw7esnTyE91R7eZA1o7FND6pLGuEXrV8z4B8'

      const result = uut.expandWif(wif)
      // console.log('result: ', result)

      assert.property(result, 'wif')
      assert.property(result, 'ecPair')
      assert.property(result, 'bchAddr')
      assert.property(result, 'slpAddr')
    })
  })

  describe('#getNonTokenBch', () => {
    it('should calculate non-token BCH', () => {
      const utxoObj = mockData.mockPaperWallet

      const result = uut.getNonTokenBch(utxoObj)
      // console.log(`result: ${result}`)

      assert.equal(result, 19028)
    })
  })
})
