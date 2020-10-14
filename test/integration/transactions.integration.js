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
// Locally global variables.

const Blockchain = require('../../lib/blockchain')
const blockchain = new Blockchain()

// Unit under test
const TransactionslLib = require('../../lib/transactions')
let uut

const receiverWif = 'L3nSksvTtHHBRP3HNMDhy6hDKpu88PQvrLGzLJn3FYX2diKqC1GD'
const paperWif = 'KxtteuKQ2enad5jH2o5eGkSaTgas49kWmvADW6qqhLAURrxuUo7m'

describe('#transactions.js', () => {
  beforeEach(async () => {
    // Instantiate the UUT each time.
    const config = {
      paperWif,
      receiverWif
    }
    uut = new TransactionslLib(config)
  })

  describe('#buildSweepSingleTokenWithBchFromPaper', () => {
    it('should generate a transaction', async () => {
      const addr = uut.paper.bchAddr
      // console.log(`addr: ${addr}`)

      const utxos = await blockchain.getUtxos(addr)
      // console.log(`utxos: ${JSON.stringify(utxos, null, 2)}`)

      const hydratedUtxos = await blockchain.filterUtxosByTokenAndBch(utxos)
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
      const paperUtxos = await blockchain.getUtxos(uut.paper.bchAddr)
      // console.log(`paperUtxos: ${JSON.stringify(paperUtxos, null, 2)}`)

      const paperHydratedUtxos = await blockchain.filterUtxosByTokenAndBch(
        paperUtxos
      )
      // console.log(
      //   `paperHydratedUtxos: ${JSON.stringify(paperHydratedUtxos, null, 2)}`
      // )

      const receiverUtxos = await blockchain.getUtxos(uut.receiver.bchAddr)
      // console.log(`receiverUtxos: ${JSON.stringify(receiverUtxos, null, 2)}`)

      const receiverHydratedUtxos = await blockchain.filterUtxosByTokenAndBch(
        receiverUtxos
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
})
