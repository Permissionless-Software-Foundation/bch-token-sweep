// npm libraries
const assert = require('chai').assert
const sinon = require('sinon')
const BCHJS = require('@psf/bch-js')

// Locally global variables.
const bchjs = new BCHJS()
const mockDataLib = require('./mocks/blockchain-mocks')
let mockData
let sandbox

// Unit under test
const Blockchain = require('../../lib/blockchain')
let uut

describe('#blockchain', () => {
  beforeEach(() => {
    uut = new Blockchain()

    mockData = Object.assign({}, mockDataLib)

    sandbox = sinon.createSandbox()
  })

  afterEach(() => sandbox.restore())

  describe('#constructor', () => {
    it('should instantiate the class', () => {
      uut = new Blockchain()

      assert.property(uut, 'config')
    })

    it('should accept an instance of bch-js', () => {
      const config = {
        bchjs: bchjs
      }

      uut = new Blockchain(config)

      assert.property(uut, 'config')
    })
  })

  describe('#getBalanceForCashAddr', () => {
    it('should get a balance for an address', async () => {
      // Mock live network calls.
      sandbox
        .stub(uut.bchjs.Electrumx, 'balance')
        .resolves(mockData.mockBalance)

      const addr = 'bitcoincash:qz726wyev5tk9d6vm23d5m4mrg92w4ke75dgkpne2j'

      const result = await uut.getBalanceForCashAddr(addr)
      // console.log(`result: ${JSON.stringify(result, null, 2)}`)

      assert.isNumber(result)
    })

    it('should handle and throw an error', async () => {
      try {
        // Force an error.
        sandbox.stub(uut.bchjs.Electrumx, 'balance').rejects('test error')

        const addr = 'bitcoincash:qz726wyev5tk9d6vm23d5m4mrg92w4ke75dgkpne2j'

        await uut.getBalanceForCashAddr(addr)

        assert.equal(true, false, 'Unexpected result')
      } catch (err) {
        assert.include(err.message, 'Could not get balance for')
      }
    })
  })

  describe('#getUtxos', () => {
    it('should get utxos for an address', async () => {
      // Mock live network calls.
      sandbox
        .stub(uut.bchjs.Electrumx, 'utxo')
        .resolves({ utxos: mockData.mockUtxos })

      const addr = 'bitcoincash:qz726wyev5tk9d6vm23d5m4mrg92w4ke75dgkpne2j'

      const result = await uut.getUtxos(addr)
      // console.log(`result: ${JSON.stringify(result, null, 2)}`)

      assert.isArray(result)
    })

    it('should handle and throw an error', async () => {
      try {
        // Force an error.
        sandbox
          .stub(uut.bchjs.Electrumx, 'utxo')
          .rejects('test error')

        const addr = 'bitcoincash:qz726wyev5tk9d6vm23d5m4mrg92w4ke75dgkpne2j'

        await uut.getUtxos(addr)

        assert.equal(true, false, 'Unexpected result')
      } catch (err) {
        assert.include(err.message, 'Could not get UTXOs')
      }
    })
  })
})
