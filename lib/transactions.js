/*
  This library contains methods for buiding sweeping transactions.
*/

// Public npm libraries
const BCHJS = require('@psf/bch-js')
const BigNumber = require('bignumber.js')

// Constants
const FULLSTACK_MAINNET_API_FREE = 'https://free-main.fullstack.cash/v3/'
const DEFAULT_BCH_WRAPPER = new BCHJS({ restURL: FULLSTACK_MAINNET_API_FREE })

const Blockchain = require('./blockchain')

class TransactionsLib {
  // TODO: pass in a single config object rather than separate objects.
  // constructor (
  //   bchjs,
  //   ECPairReceiver,
  //   ECPairPaper,
  //   toCashAddr,
  //   toSlpAddress
  // ) {
  //   this.bchjs = bchjs
  //   this.ECPairPaper = ECPairPaper // TODO: This should be an address, not an EC Pair.
  //   this.ECPairReceiver = ECPairReceiver
  //   this.toCashAddr = toCashAddr
  //   this.toSlpAddress = toSlpAddress
  // }

  constructor (config) {
    if (!config) this.config = {}
    else this.config = config

    // This is an instance of bch-js. It will default to its own instance if one
    // is not provided.
    if (this.config.bchjs) {
      this.bchjs = config.bchjs
    } else this.bchjs = DEFAULT_BCH_WRAPPER

    this.blockchain = new Blockchain()

    // Expand information for the paper wallet WIF
    if (!this.config.paperWif) throw new Error('wif for paper wallet required')
    this.paper = this.blockchain.expandWif(this.config.paperWif)

    // Expand information for the receiver wallet WIF
    if (!this.config.receiverWif) {
      throw new Error('wif for receiver wallet required')
    }
    this.receiver = this.blockchain.expandWif(this.config.receiverWif)
  }

  // Calculate the miner fees that need to be paid for a transaction.
  calculateSendCost (inputLength, sendOpReturnLength, bchInputLength) {
    let estimatedFee = this.bchjs.BitcoinCash.getByteCount(
      { P2PKH: inputLength + bchInputLength }, // Adds BCH Input
      { P2PKH: 2 }
    )

    estimatedFee += sendOpReturnLength
    estimatedFee += 10 // added to account for OP_RETURN ammount of 0000000000000000
    estimatedFee += 546 // added for non-fee SLP output

    return estimatedFee
  }

  // Sweep a single token from the paper wallet. It assumes the paper wallet
  // contains enough BCH to pay for the transaction fee.
  buildSweepSingleTokenWithBchFromPaper (
    tokenUTXOsFromPaper,
    bchUTXOsFromPaper
  ) {
    const transactionBuilder = new this.bchjs.TransactionBuilder()

    const quantityOfTokensToSend = tokenUTXOsFromPaper.reduce(
      (acc, utxo) =>
        new BigNumber(utxo.tokenQty).decimalPlaces(utxo.decimals).plus(acc),
      0
    )

    const slpOpReturn = this.bchjs.SLP.TokenType1.generateSendOpReturn(
      tokenUTXOsFromPaper,
      quantityOfTokensToSend
    )

    const fee = this.calculateSendCost(
      tokenUTXOsFromPaper.length,
      slpOpReturn.script.length,
      bchUTXOsFromPaper.length
    )

    // Add inputs to the transaction.
    let totalAmount = 0
    tokenUTXOsFromPaper.forEach(tokenUtxo => {
      totalAmount += tokenUtxo.satoshis
      transactionBuilder.addInput(tokenUtxo.tx_hash, tokenUtxo.tx_pos)
    })
    bchUTXOsFromPaper.forEach(bchUtxo => {
      totalAmount += bchUtxo.satoshis
      transactionBuilder.addInput(bchUtxo.tx_hash, bchUtxo.tx_pos)
    })

    // Add outputs to the transaction.
    transactionBuilder.addOutput(slpOpReturn.script, 0)
    transactionBuilder.addOutput(this.receiver.slpAddr, 546)
    transactionBuilder.addOutput(this.receiver.bchAddr, totalAmount - fee)

    // Sign each input.
    tokenUTXOsFromPaper.forEach((utxo, index) =>
      transactionBuilder.sign(
        index,
        this.paper.ecPair,
        undefined,
        transactionBuilder.hashTypes.SIGHASH_ALL,
        utxo.satoshis
      )
    )
    bchUTXOsFromPaper.forEach((bchUtxo, index) =>
      transactionBuilder.sign(
        tokenUTXOsFromPaper.length + index,
        this.paper.ecPair,
        undefined,
        transactionBuilder.hashTypes.SIGHASH_ALL,
        bchUtxo.satoshis
      )
    )

    // Build the transaction and return the hex.
    const hex = transactionBuilder.build().toHex()
    return hex
  }

  // Sweep a single token from the paper wallet. It assumes the transaction fees
  // will be paid from the wallet, and not from UTXOs on the paper wallet.
  buildSweepSingleTokenWithoutBchFromPaper (
    tokenUTXOsFromPaper,
    bchUTXOsFromReceiver
  ) {
    try {
      const transactionBuilder = new this.bchjs.TransactionBuilder()

      const quantityOfTokensToSend = tokenUTXOsFromPaper.reduce(
        (acc, utxo) =>
          new BigNumber(utxo.tokenQty).decimalPlaces(utxo.decimals).plus(acc),
        0
      )

      const slpOpReturn = this.bchjs.SLP.TokenType1.generateSendOpReturn(
        tokenUTXOsFromPaper,
        quantityOfTokensToSend
      )

      // Calculate the TX fee for the transaction.
      const fee = this.calculateSendCost(
        tokenUTXOsFromPaper.length,
        slpOpReturn.script.length,
        1
      )

      // Add token inputs.
      tokenUTXOsFromPaper.forEach(tokenUtxo =>
        transactionBuilder.addInput(tokenUtxo.tx_hash, tokenUtxo.tx_pos)
      )

      // Select a BCH UTXO from the wallet, to pay for TX fees.
      const selectedBchUtxo = bchUTXOsFromReceiver.filter(
        bchUtxo => bchUtxo.satoshis > fee
      )[0]
      transactionBuilder.addInput(
        selectedBchUtxo.tx_hash,
        selectedBchUtxo.tx_pos
      )

      // Add outputs to the transaction.
      transactionBuilder.addOutput(slpOpReturn.script, 0)
      transactionBuilder.addOutput(this.toCashAddr, 546)
      transactionBuilder.addOutput(
        this.toCashAddr,
        selectedBchUtxo.satoshis + tokenUTXOsFromPaper.length * 546 - fee
      )

      // Sign all the inputs.
      tokenUTXOsFromPaper.forEach((utxo, index) =>
        transactionBuilder.sign(
          index,
          this.ECPairPaper,
          undefined,
          transactionBuilder.hashTypes.SIGHASH_ALL,
          utxo.satoshis
        )
      )
      transactionBuilder.sign(
        tokenUTXOsFromPaper.length,
        this.ECPairReceiver,
        undefined,
        transactionBuilder.hashTypes.SIGHASH_ALL,
        selectedBchUtxo.satoshis
      )

      // Build the transaction into a hex string.
      const hex = transactionBuilder.build().toHex()
      return hex
    } catch (err) {
      console.error(
        'Error in util.js/buildSweepSingleTokenWithoutBchFromPaper()'
      )
      throw err
    }
  }

  // Sweep a single token from the paper wallet. It assumes the paper wallet
  // contains enough BCH to pay for the transaction fee.
  buildSweepOnlyBchFromPaper (bchUTXOsFromPaper) {
    try {
      const transactionBuilder = new this.bchjs.TransactionBuilder()

      // const quantityOfTokensToSend = tokenUTXOsFromPaper.reduce(
      //   (acc, utxo) =>
      //     new BigNumber(utxo.tokenQty).decimalPlaces(utxo.decimals).plus(acc),
      //   0
      // )

      // const slpOpReturn = this.bchjs.SLP.TokenType1.generateSendOpReturn(
      //   tokenUTXOsFromPaper,
      //   quantityOfTokensToSend
      // )

      const fee = this.calculateSendCost(0, 0, bchUTXOsFromPaper.length)

      // Add inputs to the transaction.
      let totalAmount = 0
      // tokenUTXOsFromPaper.forEach(tokenUtxo => {
      //   totalAmount += tokenUtxo.satoshis
      //   transactionBuilder.addInput(tokenUtxo.tx_hash, tokenUtxo.tx_pos)
      // })
      bchUTXOsFromPaper.forEach(bchUtxo => {
        totalAmount += bchUtxo.satoshis
        transactionBuilder.addInput(bchUtxo.tx_hash, bchUtxo.tx_pos)
      })

      // Add outputs to the transaction.
      // transactionBuilder.addOutput(slpOpReturn.script, 0)
      // transactionBuilder.addOutput(this.toSlpAddress, 546)
      transactionBuilder.addOutput(this.toCashAddr, totalAmount - fee)

      // Sign each input.
      // tokenUTXOsFromPaper.forEach((utxo, index) =>
      //   transactionBuilder.sign(
      //     index,
      //     this.ECPairPaper,
      //     undefined,
      //     transactionBuilder.hashTypes.SIGHASH_ALL,
      //     utxo.satoshis
      //   )
      // )
      bchUTXOsFromPaper.forEach((bchUtxo, index) =>
        transactionBuilder.sign(
          index,
          this.ECPairPaper,
          undefined,
          transactionBuilder.hashTypes.SIGHASH_ALL,
          bchUtxo.satoshis
        )
      )

      // Build the transaction and return the hex.
      const hex = transactionBuilder.build().toHex()
      return hex
    } catch (err) {
      console.error('Error in buildSweepOnlyBchFromPaper(): ', err)
      throw err
    }
  }
}

module.exports = TransactionsLib