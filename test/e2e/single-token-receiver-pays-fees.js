/*
  E2E test for sweeping a single token and paying for tx fees with the recieving wallet.

  Before running the test, this test will check that each wallet is set up correctly.
  If they are not set up correctly, the test will exit and indicate what is wrong
  with the set-up for the test.
*/

// These are the WIF (private keys) used to operate the test.
// const paperWif = 'L3oM4q4tNUZkT3gHZJkw4Rt6nYWveUNeZZudG82zLJVmaauRAgkj'
// const receiverWif = 'KzSwx57BYjZEekjGPH9sWpivShkqgGxV41zmkNYbCEgxdwPzhKJo'

const paperWif = 'KxCUHjDY5jdyw9STQCrWfwg1Qka6CRam84wiXfiytMMPsV977DqQ'
// paperWif BCH address: bitcoincash:qzyntrfz75n2t4e6mm4k44nv97qqzt5t2y9ycv3nen
// paperWif SLP address: simpleledger:qzyntrfz75n2t4e6mm4k44nv97qqzt5t2yflnhyn8d
const receiverWif = 'L2uMNgBUWmu2hFhCAYhpvDdbQGxmSF4Ud5J8KiaDR7E8ojLrpL8b'
// receiverWif BCH address: bitcoincash:qr72xs9e9u6k06ysxc8u2n683j8edtzf9u2x37wljt
// receiverWif SLP address: simpleledger:qr72xs9e9u6k06ysxc8u2n683j8edtzf9uxa69mlv4

// const BCHJS = require('@psf/bch-js')
// const bchjs = new BCHJS()
const SlpWallet = require('minimal-slp-wallet')

// Unit under test
const SweeperLib = require('../../index')

async function runTest () {
  try {
    const wallet = new SlpWallet(receiverWif)
    await wallet.walletInfoPromise
    await wallet.initialize()

    // Instancing the library
    const sweeperLib = new SweeperLib(paperWif, receiverWif, wallet)
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
  // Ensure the Reciever has a UTXO.
  if (sweeperLib.UTXOsFromReceiver.bchUTXOs.length === 0) {
    throw new Error(
      `Receiver does not have BCH. Send 0.0001 BCH to ${
        sweeperLib.receiver.bchAddr
      }`
    )
  }

  // Ensure the Receiver has enough BCH to pay transaction fees.
  console.log(`Receiver balance: ${sweeperLib.BCHBalanceFromReceiver}`)
  if (sweeperLib.BCHBalanceFromReceiver < 5000) {
    throw new Error(
      `Receiver has less than 0.00005 BCH. Send BCH to ${
        sweeperLib.receiver.bchAddr
      } much to pay for transaction fees.`
    )
  }

  // console.log(
  //   `paper wallet SLP UTXOs: ${JSON.stringify(
  //     sweeperLib.UTXOsFromPaperWallet.tokenUTXOs,
  //     null,
  //     2
  //   )}`
  // )
  if (sweeperLib.UTXOsFromPaperWallet.tokenUTXOs.length === 0 && sweeperLib.UTXOsFromPaperWallet.nftUTXOs.length === 0) {
    throw new Error(
      `Paper wallet does not have any tokens! Send some SLP tokens to ${
        sweeperLib.paper.slpAddr
      }`
    )
  }
  console.log('Tokens found on paper wallet. Test is good to go!')
  console.log(' ')
}
