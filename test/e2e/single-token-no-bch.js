/*
  This E2E test is a negative test case: it's expected to throw an error.

  This tests the corner case of where a user has an SLP token on a paper wallet,
  but neither the paper wallet nor the receiver wallet have BCH.
*/

// These are the WIF (private keys) used to operate the test.
const paperWif = 'KyvkSiN6gWjQenpkKSQzDh1JphuBYhsanGN5ZCL6bTy81fJL8ank'
const receiverWif = 'L22cDXNCqu2eWsGrZw7esnTyE91R7eZA1o7FND6pLGuEXrV8z4B8'

// Unit under test
const SweeperLib = require('../../index')

const BCHJS = require('@psf/bch-js')
const bchjs = new BCHJS()

async function runTest () {
  try {
    // Instancing the library
    const sweeperLib = new SweeperLib(paperWif, receiverWif, bchjs)
    await sweeperLib.populateObjectFromNetwork()

    await checkSetup(sweeperLib)

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

// Check to ensure the test is set up correctly.
async function checkSetup (sweeperLib) {
  // console.log(
  //   `receiving wallet BCH UTXOs: ${JSON.stringify(
  //     sweeperLib.UTXOsFromReceiver.bchUTXOs,
  //     null,
  //     2
  //   )}`
  // )
  // Ensure the Reciever has no UTXOs.
  if (sweeperLib.UTXOsFromReceiver.bchUTXOs.length > 0) {
    throw new Error(
      'Receiver has BCH. Use the cleanup tool to sweep all funds from the wallet.'
    )
  }

  // console.log(
  //   `paper wallet BCH UTXOs: ${JSON.stringify(
  //     sweeperLib.UTXOsFromPaperWallet.bchUTXOs,
  //     null,
  //     2
  //   )}`
  // )
  console.log(`sweeperLib.paper.bchAddr: ${sweeperLib.paper.bchAddr}`)
  if (sweeperLib.UTXOsFromPaperWallet.bchUTXOs.length > 0) {
    throw new Error(
      'Paper wallet has BCH. Use the cleanup tool to sweep all funds from the paper wallet.'
    )
  }

  // console.log(
  //   `paper wallet token UTXOs: ${JSON.stringify(
  //     sweeperLib.UTXOsFromPaperWallet.tokenUTXOs,
  //     null,
  //     2
  //   )}`
  // )
  if (sweeperLib.UTXOsFromPaperWallet.tokenUTXOs.length !== 1) {
    throw new Error(
      `Paper wallet does not have any tokens! Send some SLP tokens to ${
        sweeperLib.paper.slpAddr
      }`
    )
  }
  console.log('Tokens found on paper wallet. Test is good to go!')
  console.log(' ')
}
