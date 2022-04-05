// npm libraries
const assert = require('chai').assert
// const BCHJS = require('@psf/bch-js')
const Wallet = require('minimal-slp-wallet/index')

// Locally global variables.
// const bchjs = new BCHJS()
const advancedOptions = {
  noUpdate: true,
  interface: 'consumer-api'
}
const wallet = new Wallet(undefined, advancedOptions)

// Unit under test
const Blockchain = require('../../lib/blockchain')
const uut = new Blockchain({ wallet })

describe('#blockchain', () => {
  beforeEach(() => {
    // uut = new Blockchain()
  })

  describe('#getBalanceForCashAddr', () => {
    it('should get a balance for an address', async () => {
      const addr = 'bitcoincash:qr69kyzha07dcecrsvjwsj4s6slnlq4r8c30lxnur3'

      const result = await uut.getBalanceForCashAddr(addr)
      // console.log(`result: ${JSON.stringify(result, null, 2)}`)

      assert.isNumber(result)
    })
  })

  // describe('#getUtxos', () => {
  //   it('should get utxos for an address', async () => {
  //     const addr = 'bitcoincash:qr69kyzha07dcecrsvjwsj4s6slnlq4r8c30lxnur3'
  //
  //     const result = await uut.getUtxos(addr)
  //     console.log(`result: ${JSON.stringify(result, null, 2)}`)
  //
  //     assert.isArray(result.bchUtxos)
  //     assert.isArray(result.slpUtxos)
  //   })
  // })

  // describe('#filterUtxosByTokenAndBch', () => {
  //   it('should hydrate and filter UTXOs', async () => {
  //     const utxos = [
  //       {
  //         height: 654089,
  //         tx_hash: 'c5f82fdb0fc15fe5b002b9b96ec1ac7dbf38e838d07cea8e17ed54f8cbec6868',
  //         tx_pos: 1,
  //         value: 546
  //       },
  //       {
  //         height: 654089,
  //         tx_hash: 'c5f82fdb0fc15fe5b002b9b96ec1ac7dbf38e838d07cea8e17ed54f8cbec6868',
  //         tx_pos: 2,
  //         value: 9561
  //       }
  //     ]
  //
  //     const result = await uut.filterUtxosByTokenAndBch(utxos)
  //     // console.log(`result: ${JSON.stringify(result, null, 2)}`)
  //
  //     assert.property(result, 'tokenUTXOs')
  //     assert.property(result, 'bchUTXOs')
  //   })
  // })

  describe('#filterUtxosByTokenAndBch2', () => {
    it('should get filtered UTXOs for an address', async () => {
      const address = 'bitcoincash:qr69kyzha07dcecrsvjwsj4s6slnlq4r8c30lxnur3'

      const result = await uut.filterUtxosByTokenAndBch2(address)
      // console.log(`result: ${JSON.stringify(result, null, 2)}`)

      assert.property(result, 'tokenUTXOs')
      assert.property(result, 'bchUTXOs')
    })
  })
})
