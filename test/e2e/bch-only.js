/*
  E2E test for sweeping BCH only

  Before running the test, this test will check that each wallet is set up correctly.
  If they are not set up correctly, the test will exit and indicate what is wrong
  with the set-up for the test.
*/

// These are the WIF (private keys) used to operate the test.
const paperWif = 'KyvkSiN6gWjQenpkKSQzDh1JphuBYhsanGN5ZCL6bTy81fJL8ank'
const receiverWif = 'L22cDXNCqu2eWsGrZw7esnTyE91R7eZA1o7FND6pLGuEXrV8z4B8'

// Unit under test
const SweeperLib = require('../../index')

async function runTest () {
  try {
    // Instancing the library
    const sweeperLib = new SweeperLib(paperWif, receiverWif)
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
  //   `bchUTXOs: ${JSON.stringify(
  //     sweeperLib.UTXOsFromPaperWallet.bchUTXOs,
  //     null,
  //     2
  //   )}`
  // )
  if (sweeperLib.UTXOsFromPaperWallet.bchUTXOs.length === 0) {
    throw new Error(
      `Paper wallet does not have BCH. Send 0.00005 BCH to ${
        sweeperLib.paper.bchAddr
      }`
    )
  }

  // Ensure the Paper wallet has enough BCH to pay transaction fees.
  console.log(`Paper wallet balance: ${sweeperLib.BCHBalanceFromPaperWallet}`)
  if (sweeperLib.BCHBalanceFromPaperWallet < 5000) {
    throw new Error(
      `Receiver has less than 0.00005 BCH. Send 0.00005 BCH to ${
        sweeperLib.paper.bchAddr
      }`
    )
  }

  // console.log(
  //   `paper wallet SLP UTXOs: ${JSON.stringify(
  //     sweeperLib.UTXOsFromPaperWallet.tokenUTXOs,
  //     null,
  //     2
  //   )}`
  // )
  if (sweeperLib.UTXOsFromPaperWallet.tokenUTXOs.length > 0) {
    throw new Error(
      'Paper wallet has tokens. It should only have BCH for this test.'
    )
  }
  console.log('Setup is good. Continuing with test...')
  console.log(' ')
}
