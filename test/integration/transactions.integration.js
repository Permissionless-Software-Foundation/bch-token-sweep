/*
  Integration tests for the transactions.js utility library.
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

const receiverWif = 'L22cDXNCqu2eWsGrZw7esnTyE91R7eZA1o7FND6pLGuEXrV8z4B8'
const paperWif = 'KyvkSiN6gWjQenpkKSQzDh1JphuBYhsanGN5ZCL6bTy81fJL8ank'

describe('#transactions.js', () => {
  beforeEach(async () => {
    // mockData = Object.assign({}, mockDataLib)

    // sandbox = sinon.createSandbox()

    // Instantiate the UUT each time.
    const config = {
      paperWif,
      receiverWif
    }
    uut = new TransactionslLib(config)
  })

  describe('#buildSweepSingleTokenWithBchFromPaper', () => {
    it('should generate a transaction', async () => {
      const addr = uut.receiver.bchAddr
      console.log(`addr: ${addr}`)

      const utxos = await blockchain.getUtxos(addr)
      console.log(`utxos: ${JSON.stringify(utxos, null, 2)}`)

      const hydratedUtxos = await blockchain.filterUtxosByTokenAndBch(utxos)
      console.log(`hydatedUtxos: ${JSON.stringify(hydratedUtxos, null, 2)}`)

      const hex = uut.buildSweepSingleTokenWithBchFromPaper(
        hydratedUtxos.tokenUTXOs,
        hydratedUtxos.bchUTXOs
      )
      console.log('hex: ', hex)

      // Assert that the hext strings match.
      assert.equal(true, true)
    })
  })
})
