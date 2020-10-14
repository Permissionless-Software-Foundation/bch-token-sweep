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
const Split = require('./lib/split')
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
    this.split = new Split()

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

    // this.WIFFromPaperWallet = WIFFromPaperWallet
    // this.WIFFromReceiver = WIFFromReceiver
    // this.ECPairFromReceiver = this.bchWrapper.ECPair.fromWIF(
    //   this.WIFFromReceiver
    // )
    // this.CashAddrFromReceiver = this.bchWrapper.ECPair.toCashAddress(
    //   this.ECPairFromReceiver
    // )
    // this.ECPairFromPaperWallet = this.bchWrapper.ECPair.fromWIF(
    //   this.WIFFromPaperWallet
    // )
    // this.CashAddrFromPaperWallet = this.bchWrapper.ECPair.toCashAddress(
    //   this.ECPairFromPaperWallet
    // )
  }

  // Constructors are not able to make async calls, therefore we need this
  // function in order to finish populating the object.
  // This function retrieves UTXO and balance data from an indexer for the
  // paper wallet and reciever wallet.
  async populateObjectFromNetwork () {
    try {
      // Get the balance and UTXOs from the reciever wallet.
      this.BCHBalanceFromReceiver = await this.blockchain.getBalanceForCashAddr(
        this.CashAddrFromReceiver
      )
      const utxosFromReceiver = await this.blockchain.getUtxos(
        this.CashAddrFromReceiver
      )
      const filteredUtxosFromReceiver = await this.blockchain.filterUtxosByTokenAndBch(
        utxosFromReceiver
      )

      // Get the balance and UTXOs from the paper wallet.
      this.BCHBalanceFromPaperWallet = await this.blockchain.getBalanceForCashAddr(
        this.CashAddrFromPaperWallet
      )
      const utxosFromPaperWallet = await this.blockchain.getUtxos(
        this.CashAddrFromPaperWallet
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
  async sweepTo2 (toSLPAddr) {
    console.log(
      `this.UTXOsFromPaperWallet: ${JSON.stringify(
        this.UTXOsFromPaperWallet,
        null,
        2
      )}`
    )

    try {
      let hex = ''

      // Identify the token ID to be swept.
      const tokenIds = this.getTokenIds(this.UTXOsFromPaperWallet.tokenUTXOs)

      // If there are no token UTXOs, then this is a BCH-only sweep.
      if (tokenIds.length === 0) {
        if (this.UTXOsFromPaperWallet.bchUTXOs.length === 0) {
          throw new Error('No BCH or tokens found on paper wallet')
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
      console.error('Error in sweepTo2()')
      throw err
    }
  }

  // Sweep a paper wallet. Expects toSLPAddr to be the address to send the tokens
  // and BCH to.
  // For now, tokenId can be ignored. Will be used in future functionality.
  async sweepTo (toSLPAddr, tokenId = true) {
    try {
      // let txId
      let hex

      // Single Token
      if (tokenId) {
        // Sweep with BCH from the wallet, not the paper wallet.
        //
        // If the paper wallet has no BCH, pay the TX fees from the receiver wallet.
        if (this.UTXOsFromPaperWallet.bchUTXOs.length === 0) {
          // Retrieve *only* the token UTXOs for the selected token.

          console.log(
            'No BCH found on paper wallet. Sweeping with BCH from the reciever wallet.'
          )

          if (this.UTXOsFromPaperWallet.tokenUTXOs.length === 0) {
            throw new Error('No token UTXOs found on paper wallet')
          }

          // If no tokenId is been introduced as a parameter,
          // it will use all the tokens for the sweep
          // being that the tokenId parameter is true by default
          // asume that a new tokenId is introduced
          // if this is of type string.
          let tokenUtxos
          if (typeof tokenId === 'string') {
            // Retrieve *only* the token UTXOs for the selected token.
            tokenUtxos = this.UTXOsFromPaperWallet.tokenUTXOs.filter(
              utxo => utxo.tokenId === tokenId
            )
          } else {
            tokenUtxos = this.UTXOsFromPaperWallet.tokenUTXOs
          }
          // console.log(`tokenUtxos: ${JSON.stringify(tokenUtxos, null, 2)}`)

          // Generate a transaction to sweep the selected token from the paper wallet.
          // const util = new TransactionLib(
          //   this.bchWrapper,
          //   this.ECPairFromReceiver,
          //   this.ECPairFromPaperWallet,
          //   this.CashAddrFromReceiver,
          //   toSLPAddr
          // )

          hex = this.transactions.buildSweepSingleTokenWithoutBchFromPaper(
            tokenUtxos,
            this.UTXOsFromReceiver.bchUTXOs
          )
          // console.log('hex: ', hex)

          // Broadcast the transaction.
          // txId = await this.bchWrapper.RawTransactions.sendRawTransaction(hex)
        } else {
          // Sweep using BCH from the paper wallet to pay TX fees.

          console.log(
            'BCH found on paper wallet, sweeping with BCH from the paper wallet.'
          )

          let tokenUtxos

          // If the token ID was specified, sweep that token.
          if (typeof tokenId === 'string') {
            // Retrieve *only* the token UTXOs for the selected token.
            tokenUtxos = this.UTXOsFromPaperWallet.tokenUTXOs.filter(
              utxo => utxo.tokenId === tokenId
            )

            // If no token ID was specified, sweep... all the tokens?
          } else {
            tokenUtxos = this.UTXOsFromPaperWallet.tokenUTXOs
          }

          // Generate a transaction to sweep the selected token from the paper wallet.
          // const util = new TransactionLib(
          //   this.bchWrapper,
          //   this.ECPairFromReceiver,
          //   this.ECPairFromPaperWallet,
          //   this.CashAddrFromReceiver,
          //   toSLPAddr
          // )

          if (tokenUtxos.length) {
            hex = this.transactions.buildSweepSingleTokenWithBchFromPaper(
              tokenUtxos,
              this.UTXOsFromPaperWallet.bchUTXOs
            )
          } else {
            hex = this.transactions.buildSweepOnlyBchFromPaper(
              this.UTXOsFromPaperWallet.bchUTXOs
            )
          }

          // Broadcast the transaction.
          // txId = await this.bchWrapper.RawTransactions.sendRawTransaction(hex)
        }

        //

        /*
    For now, let's limit the scope to a single token per sweep. We can expand
    this functionality after we've nailed down the unit tests and functionality
    for the single-token sweep. Until then, users can simply do multiple sweeps
    if they have multiple tokens on a single paper wallet.
    } else {
      // Multiple Tokens

      const tokenUTXOsById = {}
      this.utxosFromPaperWallet.tokenUTXOs.forEach(tokenUtxo => {
        if (!tokenUTXOsById[tokenUtxo.tokenId]) {
          tokenUTXOsById[tokenUtxo.tokenId] = []
        }
        tokenUTXOsById[tokenUtxo.tokenId].push(tokenUtxo)
      })
      if (this.utxosFromPaperWallet.bchUTXOs.length === 0) {
        // Sweep with own BCH
        for (const tokenUtxos of tokenUTXOsById) {
          const util = new UtilLib(
            this.bchWrapper,
            this.ECPairFromReceiver,
            this.ECPairFromPaperWallet,
            this.CashAddrFromReceiver,
            toSLPAddr
          )
          const hex = util.buildSweepSingleTokenWithoutBchFromPaper(
            tokenUtxos,
            this.UTXOsFromReceiver.bchUTXOs
          )
          txId = await this.bchWrapper.RawTransactions.sendRawTransaction(hex)
        }
      } else {
        // Sweep using the paper wallet BCH
        for (const tokenUtxos of tokenUTXOsById) {
          const util = new UtilLib(
            this.bchWrapper,
            this.ECPairFromPaperWallet,
            this.ECPairFromPaperWallet,
            this.CashAddrFromReceiver,
            toSLPAddr
          )
          const hex = util.buildSweepSingleTokenWithoutBchFromPaper(
            tokenUtxos,
            this.UTXOsFromPaperWallet.bchUTXOs
          )
          txId = await this.bchWrapper.RawTransactions.sendRawTransaction(hex)
        }
      }
    */
      }

      return hex
    } catch (error) {
      console.error('Error in sweepTo()')
      throw error
    }
  }
}

// Example on how to integrate
// TODO: pass this to README
// (async () => {
//   const bchjs = new BCHJS({ restURL: FULLSTACK_MAINNET_API_FREE })
//   const rootSeed = await bchjs.Mnemonic.toSeed('scorpion like ten total bean venture boring discover half myself survey miss')
//   const masterHDNode = bchjs.HDNode.fromSeed(rootSeed)
//   const account = bchjs.HDNode.derivePath(masterHDNode, "m/44'/145'/0'")
//   const change = bchjs.HDNode.derivePath(account, '0/0')
//   const ECPair = bchjs.HDNode.toKeyPair(change)
//   const wifFromReceiver = bchjs.ECPair.toWIF(ECPair)

//   const rootSeedPaper = await bchjs.Mnemonic.toSeed('lesson invite sketch panther carry museum ridge need express borrow prosper begin')
//   const masterHDNodePaper = bchjs.HDNode.fromSeed(rootSeedPaper)
//   const accountPaper = bchjs.HDNode.derivePath(masterHDNodePaper, "m/44'/245'/0'")
//   const changePaper = bchjs.HDNode.derivePath(accountPaper, '0/0')
//   const ECPairPaper = bchjs.HDNode.toKeyPair(changePaper)
//   const wifFromReceiverPaper = bchjs.ECPair.toWIF(ECPairPaper)

//   const slpSweeper = new SLPSweeper(wifFromReceiverPaper, wifFromReceiver)
//   await slpSweeper.build()
//   await slpSweeper.sweepTo('simpleledger:qrpsz38l2lz3n6d4vk2rqp23qzymlngcrcw2lavrfv', '716daf7baf2f1c517e52a3f6ffd6f734d45eab20e87dc1c79108c5f0f6804888')
// })()

module.exports = Sweeper
