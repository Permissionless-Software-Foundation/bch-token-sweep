// npm libraries
const assert = require('chai').assert
// const BCHJS = require('@psf/bch-js')

// Locally global variables.
// const bchjs = new BCHJS()

// Unit under test
const Blockchain = require('../../lib/blockchain')
const uut = new Blockchain()

describe('#blockchain', () => {
  beforeEach(() => {
    // uut = new Blockchain()
  })

  describe('#getBalanceForCashAddr', () => {
    it('should get a balance for an address', async () => {
      const addr = 'bitcoincash:qz726wyev5tk9d6vm23d5m4mrg92w4ke75dgkpne2j'

      const result = await uut.getBalanceForCashAddr(addr)
      // console.log(`result: ${JSON.stringify(result, null, 2)}`)

      assert.isNumber(result)
    })
  })

  describe('#getUtxos', () => {
    it('should get utxos for an address', async () => {
      const addr = 'bitcoincash:qz726wyev5tk9d6vm23d5m4mrg92w4ke75dgkpne2j'

      const result = await uut.getUtxos(addr)
      console.log(`result: ${JSON.stringify(result, null, 2)}`)

      // assert.isNumber(result)
    })
  })
})
