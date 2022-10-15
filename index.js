/* eslint-disable no-async-promise-executor */

/*
  Workflow for sweeping BCH and Tokens:
  - Expand the WIF information with Blockchain.expandWif()
  - Retrieve BCH and SLP token UTXO information from the blockchain with
    populateObjectFromNetwork()
  - Sweep with the sweepTo()

  TODO:

*/

'use strict'

// Local libraries
const TransactionLib = require('./lib/transactions')
const Blockchain = require('./lib/blockchain')

// Constants
const SAFETY_SATS = 2000 // safety margin to prevent dust transactions issues.

class Sweeper {
  constructor (
    wifFromPaperWallet,
    wifFromReceiver,
    wallet, donation = 2000,
    toAddr
  ) {
    this.donation = donation

    // This is an instance of bch-js. It will default to its own instance if one
    // is not provided.
    this.wallet = wallet
    if (!wallet) {
      throw new Error('minimal-slp-wallet instance must be passed when instantiating.')
    }

    // Pass the bch-js instance to the other support libraries.
    const config = {
      wallet: this.wallet
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

    // If a to-address is not specified, assign it to the receiver wallet address.
    if (toAddr) this.toAddr = toAddr
    else this.toAddr = this.receiver.bchAddr
    // console.log(`toAddr: ${toAddr}`)

    // Instantiate and encapsulate the transactions library.
    config.paperWif = wifFromPaperWallet
    config.receiverWif = wifFromReceiver
    config.donation = donation
    this.transactions = new TransactionLib(config)
    this.limitOfTokenUtxos = 5

    // Bind 'this' object to all subfunctions
    this.populateObjectFromNetwork = this.populateObjectFromNetwork.bind(this)
    this.getTokenIds = this.getTokenIds.bind(this)
    this.sweepTo = this.sweepTo.bind(this)
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

      const filteredUtxosFromReceiver = await this.blockchain.filterUtxosByTokenAndBch2(this.receiver.bchAddr)
      // console.log(`filteredUtxosFromReceiver: ${JSON.stringify(filteredUtxosFromReceiver, null, 2)}`)

      // Get the balance and UTXOs from the paper wallet.
      this.BCHBalanceFromPaperWallet = await this.blockchain.getBalanceForCashAddr(
        this.paper.bchAddr
      )

      const filteredUtxosFromPaperWallet = await this.blockchain.filterUtxosByTokenAndBch2(this.paper.bchAddr)
      // console.log(`filteredUtxosFromPaperWallet: ${JSON.stringify(filteredUtxosFromPaperWallet, null, 2)}`)

      // Set a bunch of values in the instance?
      this.UTXOsFromReceiver = {}
      this.UTXOsFromReceiver.bchUTXOs = filteredUtxosFromReceiver.bchUTXOs
      this.UTXOsFromPaperWallet = {}
      this.UTXOsFromPaperWallet.tokenUTXOs =
        filteredUtxosFromPaperWallet.tokenUTXOs
      this.UTXOsFromPaperWallet.nftUTXOs = filteredUtxosFromPaperWallet.nftUTXOs
      this.UTXOsFromPaperWallet.bchUTXOs = filteredUtxosFromPaperWallet.bchUTXOs
      // console.log('this.UTXOsFromPaperWallet: ', this.UTXOsFromPaperWallet)
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
        const idExists = tokenIds.find((elem) => elem === utxo.tokenId)
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

  // Generates and returns an hex-encoded transaction, ready to be broadcast to
  // the BCH network, for sweeping tokens and/or BCH from a paper wallet.
  async sweepTo (toSLPAddr) {
    // Used for debugging.
    // console.log(`Paper wallet address: ${this.paper.bchAddr}`)
    // console.log(
    //   `this.BCHBalanceFromPaperWallet: ${this.BCHBalanceFromPaperWallet}`
    // )
    // console.log(
    //   `this.UTXOsFromPaperWallet: ${JSON.stringify(
    //     this.UTXOsFromPaperWallet,
    //     null,
    //     2
    //   )}`
    // )
    // console.log(`Receiver address: ${this.receiver.bchAddr}`)
    // console.log(`this.BCHBalanceFromReceiver: ${this.BCHBalanceFromReceiver}`)
    // console.log(
    //   `this.UTXOsFromReceiver: ${JSON.stringify(
    //     this.UTXOsFromReceiver,
    //     null,
    //     2
    //   )}`
    // )

    try {
      let hex = ''

      // Identify the token ID to be swept.
      let tokenIds = this.getTokenIds(this.UTXOsFromPaperWallet.tokenUTXOs)

      // Check NFT UTXOs if there are no fungible tokens.
      if (tokenIds.length === 0 && this.UTXOsFromPaperWallet.nftUTXOs) {
        tokenIds = this.getTokenIds(this.UTXOsFromPaperWallet.nftUTXOs)
      }
      // console.log('tokenIds: ', tokenIds)

      // If there are no token UTXOs, then this is a BCH-only sweep.
      if (tokenIds.length === 0) {
        // If there is no tokens AND no BCH, throw an error.
        if (this.UTXOsFromPaperWallet.bchUTXOs.length === 0) {
          throw new Error('No BCH or tokens found on paper wallet')
        }

        // If there is not enough BCH, throw an error
        if (this.BCHBalanceFromPaperWallet < this.donation + SAFETY_SATS) {
          throw new Error(
            'Not enough BCH on the paper wallet to pay fees. Send more BCH to the paper wallet in order to sweep it.'
          )
        }

        // Generate a BCH-only sweep transaction.
        hex = this.transactions.buildSweepOnlyBchFromPaper(
          this.UTXOsFromPaperWallet.bchUTXOs,
          this.toAddr
        )

        return hex
      }
      // There *are* tokens on the paper wallet.

      // Filter the token UTXOs for the selected token.
      // Ignore minting batons.
      const selectedTokenId = tokenIds[0]
      let selectedTokenUtxos = this.UTXOsFromPaperWallet.tokenUTXOs.filter(
        (elem) => elem.tokenId === selectedTokenId && elem.utxoType !== 'minting-baton'
      )

      // Get NFT UTXOs if there are no fungible token UTXOs.
      if (!selectedTokenUtxos.length) {
        selectedTokenUtxos = this.UTXOsFromPaperWallet.nftUTXOs.filter(
          (elem) => elem.tokenId === selectedTokenId
        )
      }
      // console.log(`selectedTokenUtxos: ${JSON.stringify(selectedTokenUtxos, null, 2)}`)

      // Calculate the non-token BCH available for spending on the paper wallet.
      const paperSpendableBch = this.blockchain.getNonTokenBch(
        this.UTXOsFromPaperWallet
      )
      // console.log(`paperSpendableBch: ${paperSpendableBch}`)

      // If the paper wallet does not have enough BCH, pay the TX fees from the
      // receiver wallet.
      // TODO: Calculate non-token BCH.
      if (paperSpendableBch < this.donation + SAFETY_SATS) {
        // Retrieve *only* the token UTXOs for the selected token.

        // If the receiver wallet does not have enough BCH, throw an error.
        if (this.BCHBalanceFromReceiver < this.donation + SAFETY_SATS) {
          throw new Error(
            'Not enough BCH on paper wallet or receiver wallet to pay fees.'
          )
        }

        console.log(
          'Not enough BCH found on paper wallet. Sweeping with BCH from the reciever wallet.'
        )

        // Generate a token sweep using BCH from the receiver wallet to pay
        // transaction fees.
        hex = this.transactions.buildSweepSingleTokenWithoutBchFromPaper(
          selectedTokenUtxos,
          this.UTXOsFromReceiver.bchUTXOs,
          this.toAddr
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
          this.UTXOsFromPaperWallet.bchUTXOs,
          this.toAddr
        )
      }

      return hex
    } catch (err) {
      console.error('Error in sweepTo(): ', err)
      throw err
    }
  }
}

module.exports = Sweeper
