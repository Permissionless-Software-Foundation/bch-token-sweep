/*
  Used for cleaning up tests. Replace the receiverWif with the WIF for a
  web wallet (like wallet.fullstack.cash) to reclaim the tokens and BCH
  on the test wallets.
*/

// These are the WIF (private keys) used to operate the test.
const paperWif = 'KzSwx57BYjZEekjGPH9sWpivShkqgGxV41zmkNYbCEgxdwPzhKJo'
const receiverWif = ''

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
