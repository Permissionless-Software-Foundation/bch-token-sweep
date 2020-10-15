/* eslint-disable no-async-promise-executor */

/*
  Workflow for sweeping BCH and Tokens:
  - Expand the WIF information with Blockchain.expandWif()
  - Retrieve BCH and SLP token UTXO information from the blockchain with
    populateObjectFromNetwork()
  - Sweep with the sweepTo() method:
    -

*
Sweep a private key with a single token class and no BCH.
Sweep a private key with two classes of tokens and no BCH.
Sweep a prviate key with a single token class and some BCH.
Sweep a private key with a two classes of tokens and some BCH.
Sweep private key with single token class but multiple UTXOs and multiple BCH-only UTXOs.
Sweep private key with two token classes and multiple UTXOS of each, and multiple BCH-only UTXOs.
*

  TODO:

*/

'use strict'

// Public npm libraries
const BCHJS = require('@psf/bch-js')

// Local libraries
const TransactionLib = require('./lib/transactions')
const Blockchain = require('./lib/blockchain')

// Constants
const FULLSTACK_MAINNET_API_FREE = 'https://free-main.fullstack.cash/v3/'
const DEFAULT_BCH_WRAPPER = new BCHJS({ restURL: FULLSTACK_MAINNET_API_FREE })

class Sweeper {
  constructor (wifFromPaperWallet, wifFromReceiver, BCHWrapper) {
    // This is an instance of bch-js. It will default to its own instance if one
    // is not provided.
    this.bchWrapper = BCHWrapper
    if (!BCHWrapper) {
      this.bchWrapper = DEFAULT_BCH_WRAPPER
    }

    // Pass the bch-js instance to the other support libraries.
    const config = {
      bchjs: this.bchWrapper
    }

    // Encapsulate the support libraries.
    this.blockchain = new Blockchain(config)

    // Private key contained on the paper wallet.
    if (!wifFromPaperWallet) {
      throw new Error('WIF from paper wallet is required')
    }
    this.paper = this.blockchain.expandWif(wifFromPaperWallet)

    // ToDo: A WIF from the reciever should not be required in all use cases.
    // If there is BCH on the paper wallet, it can be used to pay transaction fees.
    if (!wifFromReceiver) {
      throw new Error('WIF from receiver is required')
    }
    this.receiver = this.blockchain.expandWif(wifFromReceiver)

    // Instantiate and encapsulate the transactions library.
    config.paperWif = wifFromPaperWallet
    config.receiverWif = wifFromReceiver
    this.transactions = new TransactionLib(config)
  }

  // Constructors are not able to make async calls, therefore we need this
  // function in order to finish populating the object.
  // This function retrieves UTXO and balance data from an indexer for the
  // paper wallet and reciever wallet.
  async populateObjectFromNetwork () {
    try {
      // Get the balance and UTXOs from the reciever wallet.
      this.BCHBalanceFromReceiver = await this.blockchain.getBalanceForCashAddr(
        this.receiver.bchAddr
      )
      const utxosFromReceiver = await this.blockchain.getUtxos(
        this.receiver.bchAddr
      )
      const filteredUtxosFromReceiver = await this.blockchain.filterUtxosByTokenAndBch(
        utxosFromReceiver
      )

      // Get the balance and UTXOs from the paper wallet.
      this.BCHBalanceFromPaperWallet = await this.blockchain.getBalanceForCashAddr(
        this.paper.bchAddr
      )
      const utxosFromPaperWallet = await this.blockchain.getUtxos(
        this.paper.bchAddr
      )
      const filteredUtxosFromPaperWallet = await this.blockchain.filterUtxosByTokenAndBch(
        utxosFromPaperWallet
      )

      // Set a bunch of values in the instance?
      this.UTXOsFromReceiver = {}
      this.UTXOsFromReceiver.bchUTXOs = filteredUtxosFromReceiver.bchUTXOs
      this.UTXOsFromPaperWallet = {}
      this.UTXOsFromPaperWallet.tokenUTXOs =
        filteredUtxosFromPaperWallet.tokenUTXOs
      this.UTXOsFromPaperWallet.bchUTXOs = filteredUtxosFromPaperWallet.bchUTXOs
    } catch (e) {
      console.error('Error in populateObjectFromNetwork()')
      // throw new Error(e.message)
      throw e
    }
  }

  // A support function. Returns an array of token IDs for the different
  // classes of tokens held on the paper wallet.
  getTokenIds (tokenUtxos) {
    try {
      const tokenIds = []

      if (!Array.isArray(tokenUtxos)) throw new Error('Input must be an array')

      // Loop through each UTXO.
      for (let i = 0; i < tokenUtxos.length; i++) {
        const utxo = tokenUtxos[i]

        // Has the token ID already been added to the array?
        const idExists = tokenIds.find(elem => elem === utxo.tokenId)
        // console.log(`idExists: ${JSON.stringify(idExists, null, 2)}`)

        // If not, add the token ID to the array.
        if (!idExists) tokenIds.push(utxo.tokenId)
      }

      return tokenIds
    } catch (err) {
      console.error('Error in getTokenIds()')
      throw err
    }
  }

  // Generates an returns an hex-encoded transaction, ready to be broadcast to
  // the BCH network, for sweeping tokens and/or BCH from a paper wallet.
  async sweepTo (toSLPAddr) {
    // console.log(
    //   `this.UTXOsFromPaperWallet: ${JSON.stringify(
    //     this.UTXOsFromPaperWallet,
    //     null,
    //     2
    //   )}`
    // )

    try {
      let hex = ''

      // Identify the token ID to be swept.
      const tokenIds = this.getTokenIds(this.UTXOsFromPaperWallet.tokenUTXOs)

      // If there are no token UTXOs, then this is a BCH-only sweep.
      if (tokenIds.length === 0) {
        // If there is no tokens AND no BCH, throw an error.
        if (this.UTXOsFromPaperWallet.bchUTXOs.length === 0) {
          throw new Error('No BCH or tokens found on paper wallet')
        }

        // If there is not enough BCH, throw an error
        if (this.BCHBalanceFromPaperWallet < 3000) {
          throw new Error('Not enough BCH on paper wallet to pay fees.')
        }

        // Generate a BCH-only sweep transaction.
        hex = this.transactions.buildSweepOnlyBchFromPaper(
          this.UTXOsFromPaperWallet.bchUTXOs
        )

        return hex
      }

      // Filter the token UTXOs for the selected token.
      const selectedTokenId = tokenIds[0]
      const selectedTokenUtxos = this.UTXOsFromPaperWallet.tokenUTXOs.filter(
        elem => elem.tokenId === selectedTokenId
      )

      // If the paper wallet has no BCH, pay the TX fees from the receiver wallet.
      if (this.UTXOsFromPaperWallet.bchUTXOs.length === 0) {
        // Retrieve *only* the token UTXOs for the selected token.

        console.log(
          'No BCH found on paper wallet. Sweeping with BCH from the reciever wallet.'
        )

        // Generate a token sweep using BCH from the receiver wallet to pay
        // transaction fees.
        hex = this.transactions.buildSweepSingleTokenWithoutBchFromPaper(
          selectedTokenUtxos,
          this.UTXOsFromReceiver.bchUTXOs
        )
      } else {
        // Sweep using BCH from the paper wallet to pay TX fees.

        console.log(
          'BCH found on paper wallet, sweeping with BCH from the paper wallet.'
        )

        // Generate a token sweep using BCH from the paper wallet to pay
        // transaction fees.
        hex = this.transactions.buildSweepSingleTokenWithBchFromPaper(
          selectedTokenUtxos,
          this.UTXOsFromPaperWallet.bchUTXOs
        )
      }

      return hex
    } catch (err) {
      console.error('Error in sweepTo()')
      throw err
    }
  }
}

module.exports = Sweeper
