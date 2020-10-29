/*
  Used for cleaning up tests. Replace the receiverWif with the WIF for a
  web wallet (like wallet.fullstack.cash) to reclaim the tokens and BCH
  on the test wallets.
*/

// These are the WIF (private keys) used to operate the test.
const paperWif = 'KyvkSiN6gWjQenpkKSQzDh1JphuBYhsanGN5ZCL6bTy81fJL8ank'
// const paperWif = 'L22cDXNCqu2eWsGrZw7esnTyE91R7eZA1o7FND6pLGuEXrV8z4B8'
// const paperWif = 'KxtteuKQ2enad5jH2o5eGkSaTgas49kWmvADW6qqhLAURrxuUo7m'
// const paperWif = 'L3nSksvTtHHBRP3HNMDhy6hDKpu88PQvrLGzLJn3FYX2diKqC1GD'
const receiverWif = 'KzKisLyyEsxuNprn4v4E7jfWsYSG18ig7CU7EGS76b6sjnyazq1t'

// Unit under test
const SweeperLib = require('../../../index')

const BCHJS = require('@psf/bch-js')
const bchjs = new BCHJS()

async function runTest () {
  try {
    // Instancing the library
    const sweeperLib = new SweeperLib(paperWif, receiverWif, bchjs)
    await sweeperLib.populateObjectFromNetwork()

    const hex = await sweeperLib.sweepTo(sweeperLib.receiver.slpAddr)
    // console.log(`hex: ${hex}`)

    const txid = await sweeperLib.blockchain.broadcast(hex)

    console.log('Transaction ID', txid)
    console.log(`https://explorer.bitcoin.com/bch/tx/${txid}`)
  } catch (error) {
    console.error('Error in test: ', error)
  }
}
runTest()
