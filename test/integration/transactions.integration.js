/*
  Integration tests for the transactions.js utility library.

  These tests assume the WIFs used have been prepared. If the tests fail, it's
  most likely due to the funds on the WIFs changing or being drained.
*/

// npm libraries
const assert = require('chai').assert
// const { mockSingleSweepWithBch } = require('../unit/mocks/util-mocks')
// const BCHJS = require('@psf/bch-js')
// const bchjs = new BCHJS()
const Wallet = require('minimal-slp-wallet/index')

const advancedOptions = {
  noUpdate: true,
  interface: 'consumer-api'
}
const wallet = new Wallet(undefined, advancedOptions)

const Blockchain = require('../../lib/blockchain')
const blockchain = new Blockchain({ wallet })

// Unit under test
const TransactionslLib = require('../../lib/transactions')
let uut

// bitcoincash:qr0lcfnvsc5m4fqznazvvmm905s8dhwakytl725943
const receiverWif = 'KwMkZ4odtbBzRKdEjYBUMgx7CE6wYxVb7b2N4V7QYa5gaGhmZMug'

// bitcoincash:qr4yscpw9jgq8ltajfeknpj32kamkf9knujffcdhyq
const paperWif = 'L5nkYNwao1UFCJfKrk7Uh1MSRPyyectSbTcXDBdKvV9rTpuUUPGi'

describe('#transactions.js', () => {
  beforeEach(async () => {
    // Instantiate the UUT each time.
    const config = {
      paperWif,
      receiverWif,
      wallet
    }
    uut = new TransactionslLib(config)
  })

  describe('#buildSweepSingleTokenWithBchFromPaper', () => {
    it('should generate a transaction', async () => {
      const addr = uut.paper.bchAddr

      const hydratedUtxos = await blockchain.filterUtxosByTokenAndBch2(addr)
      // console.log(`hydatedUtxos: ${JSON.stringify(hydratedUtxos, null, 2)}`)

      const hex = uut.buildSweepSingleTokenWithBchFromPaper(
        hydratedUtxos.tokenUTXOs,
        hydratedUtxos.bchUTXOs
      )
      // console.log('hex: ', hex)

      // Assert that the returned hex is a string
      assert.isString(hex)
    })
  })

  describe('#buildSweepSingleTokenWithoutBchFromPaper', () => {
    it('should generate a transaction', async () => {
      // const paperUtxos = await blockchain.getUtxos(uut.paper.bchAddr)
      // console.log(`paperUtxos: ${JSON.stringify(paperUtxos, null, 2)}`)

      const paperHydratedUtxos = await blockchain.filterUtxosByTokenAndBch2(
        uut.paper.bchAddr
      )
      // console.log(
      //   `paperHydratedUtxos: ${JSON.stringify(paperHydratedUtxos, null, 2)}`
      // )

      // const receiverUtxos = await blockchain.getUtxos(uut.receiver.bchAddr)
      // console.log(`receiverUtxos: ${JSON.stringify(receiverUtxos, null, 2)}`)

      const receiverHydratedUtxos = await blockchain.filterUtxosByTokenAndBch2(
        uut.receiver.bchAddr
      )
      // console.log(
      //   `receiverHydratedUtxos: ${JSON.stringify(
      //     receiverHydratedUtxos,
      //     null,
      //     2
      //   )}`
      // )

      const hex = uut.buildSweepSingleTokenWithoutBchFromPaper(
        paperHydratedUtxos.tokenUTXOs,
        receiverHydratedUtxos.bchUTXOs
      )
      // console.log('hex: ', hex)

      // Assert that the returned hex is a string
      assert.isString(hex)
    })
  })

  describe('#buildSweepOnlyBchFromPaper', () => {
    it('should generate a transaction', async () => {
      // const paperUtxos = await blockchain.getUtxos(uut.paper.bchAddr)
      // console.log(`paperUtxos: ${JSON.stringify(paperUtxos, null, 2)}`)

      const paperHydratedUtxos = await blockchain.filterUtxosByTokenAndBch2(
        uut.paper.bchAddr
      )
      // console.log(
      //   `paperHydratedUtxos: ${JSON.stringify(paperHydratedUtxos, null, 2)}`
      // )

      const hex = uut.buildSweepOnlyBchFromPaper(paperHydratedUtxos.bchUTXOs)
      // console.log('hex: ', hex)

      // Assert that the returned hex is a string
      assert.isString(hex)
    })
  })
})
