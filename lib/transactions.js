/*
  This library contains methods for buiding sweeping transactions.
*/

// Public npm libraries
// const wallet = require('@psf/bch-js')
const BigNumber = require('bignumber.js')
const bchDonation = require('bch-donation')

// Send the Permissionless Software Foundation a donation to thank them for creating
// and maintaining this software.
const PSF_DEFAULT_DONATION = 2000

const Blockchain = require('./blockchain')

class TransactionsLib {
  constructor (config) {
    this.config = config

    // This is an instance of bch-js. It will default to its own instance if one
    // is not provided.
    if (this.config.wallet) {
      this.wallet = config.wallet
      // } else this.wallet = DEFAULT_BCH_WRAPPER
    } else throw new Error('bch-js instance must be passed when instantiating.')

    this.blockchain = new Blockchain(this.config)

    // Expand information for the paper wallet WIF
    if (!this.config.paperWif) throw new Error('wif for paper wallet required')
    this.paper = this.blockchain.expandWif(this.config.paperWif)

    // Expand information for the receiver wallet WIF
    if (!this.config.receiverWif) {
      throw new Error('wif for receiver wallet required')
    }
    this.receiver = this.blockchain.expandWif(this.config.receiverWif)

    this.donation = config.donation
    if (!this.donation) this.donation = PSF_DEFAULT_DONATION
  }

  // Calculate the miner fees that need to be paid for a transaction.
  calculateSendCost (inputLength, sendOpReturnLength, bchInputLength) {
    let estimatedFee = this.wallet.bchjs.BitcoinCash.getByteCount(
      { P2PKH: inputLength + bchInputLength }, // Adds BCH Input
      { P2PKH: 3 }
    )

    estimatedFee += sendOpReturnLength
    estimatedFee += 10 // added to account for OP_RETURN ammount of 0000000000000000
    estimatedFee += 546 // added for non-fee SLP output
    estimatedFee += this.donation // Donation to PSF for creating this software.

    return estimatedFee
  }

  // Sweep a single token from the paper wallet. It assumes the paper wallet
  // contains enough BCH to pay for the transaction fee.
  buildSweepSingleTokenWithBchFromPaper (
    tokenUTXOsFromPaper,
    bchUTXOsFromPaper,
    toAddr
  ) {
    try {
      if (bchUTXOsFromPaper.length === 0) {
        throw new Error('BCH UTXOs array is empty')
      }

      if (tokenUTXOsFromPaper.length === 0) {
        throw new Error('Token UTXOs array is empty')
      }

      const transactionBuilder = new this.wallet.bchjs.TransactionBuilder()

      const quantityOfTokensToSend = tokenUTXOsFromPaper.reduce(
        (acc, utxo) =>
          new BigNumber(utxo.tokenQty).decimalPlaces(utxo.decimals).plus(acc),
        0
      )

      const slpOpReturn = this.wallet.bchjs.SLP.TokenType1.generateSendOpReturn(
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
        totalAmount += tokenUtxo.value
        transactionBuilder.addInput(tokenUtxo.tx_hash, tokenUtxo.tx_pos)
      })
      bchUTXOsFromPaper.forEach(bchUtxo => {
        totalAmount += bchUtxo.value
        transactionBuilder.addInput(bchUtxo.tx_hash, bchUtxo.tx_pos)
      })

      // Add outputs to the transaction.
      transactionBuilder.addOutput(slpOpReturn.script, 0)

      if (!toAddr) toAddr = this.receiver.bchAddr
      // console.log('bch-token-sweep toAddr: ', toAddr)

      transactionBuilder.addOutput(toAddr, 546)

      transactionBuilder.addOutput(toAddr, totalAmount - fee)

      // Send a 2000 sat donation to PSF to thank them for creating this awesome software.
      transactionBuilder.addOutput(bchDonation('psf').donations, this.donation)

      // Sign each input.
      tokenUTXOsFromPaper.forEach((utxo, index) =>
        transactionBuilder.sign(
          index,
          this.paper.ecPair,
          undefined,
          transactionBuilder.hashTypes.SIGHASH_ALL,
          utxo.value
        )
      )
      bchUTXOsFromPaper.forEach((bchUtxo, index) =>
        transactionBuilder.sign(
          tokenUTXOsFromPaper.length + index,
          this.paper.ecPair,
          undefined,
          transactionBuilder.hashTypes.SIGHASH_ALL,
          bchUtxo.value
        )
      )

      // Build the transaction and return the hex.
      const hex = transactionBuilder.build().toHex()
      return hex
    } catch (err) {
      console.error(
        'Error in transactions.js/buildSweepSingleTokenWithBchFromPaper()'
      )
      throw err
    }
  }

  // Sweep a single token from the paper wallet. It assumes the transaction fees
  // will be paid from the wallet, and not from UTXOs on the paper wallet.
  buildSweepSingleTokenWithoutBchFromPaper (
    tokenUTXOsFromPaper,
    bchUTXOsFromReceiver,
    toAddr
  ) {
    try {
      if (bchUTXOsFromReceiver.length === 0) {
        throw new Error('BCH UTXOs array is empty')
      }

      if (tokenUTXOsFromPaper.length === 0) {
        throw new Error('Token UTXOs array is empty')
      }

      const transactionBuilder = new this.wallet.bchjs.TransactionBuilder()

      const quantityOfTokensToSend = tokenUTXOsFromPaper.reduce(
        (acc, utxo) =>
          new BigNumber(utxo.tokenQty).decimalPlaces(utxo.decimals).plus(acc),
        0
      )

      let slpOpReturn
      if (tokenUTXOsFromPaper[0].tokenType === 65) {
        // NFT
        slpOpReturn = this.wallet.bchjs.SLP.NFT1.generateNFTChildSendOpReturn(
          tokenUTXOsFromPaper,
          quantityOfTokensToSend
        )
      } else {
        // Fungible Token
        slpOpReturn = this.wallet.bchjs.SLP.TokenType1.generateSendOpReturn(
          tokenUTXOsFromPaper,
          quantityOfTokensToSend
        )
      }

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
        bchUtxo => bchUtxo.value > fee
      )[0]
      transactionBuilder.addInput(
        selectedBchUtxo.tx_hash,
        selectedBchUtxo.tx_pos
      )

      // Add outputs to the transaction.
      transactionBuilder.addOutput(slpOpReturn.script, 0)

      if (!toAddr) toAddr = this.receiver.bchAddr
      // console.log('bch-token-sweep toAddr: ', toAddr)

      transactionBuilder.addOutput(toAddr, 546)
      transactionBuilder.addOutput(
        toAddr,
        selectedBchUtxo.value + tokenUTXOsFromPaper.length * 546 - fee
      )

      // Send a 2000 sat donation to PSF to thank them for creating this awesome software.
      transactionBuilder.addOutput(bchDonation('psf').donations, this.donation)

      // Sign token inputs from the paper wallet.
      tokenUTXOsFromPaper.forEach((utxo, index) =>
        transactionBuilder.sign(
          index,
          this.paper.ecPair,
          undefined,
          transactionBuilder.hashTypes.SIGHASH_ALL,
          utxo.value
        )
      )

      // Sign the BCH inputs from the receiver wallet.
      transactionBuilder.sign(
        tokenUTXOsFromPaper.length,
        this.receiver.ecPair,
        undefined,
        transactionBuilder.hashTypes.SIGHASH_ALL,
        selectedBchUtxo.value
      )

      // Build the transaction into a hex string.
      const hex = transactionBuilder.build().toHex()
      return hex
    } catch (err) {
      console.error(
        'Error in transactions.js/buildSweepSingleTokenWithoutBchFromPaper()'
      )
      throw err
    }
  }

  // Sweep only BCH from the paper wallet (no tokens).
  // TX fees are paid by the paper wallet.
  buildSweepOnlyBchFromPaper (bchUTXOsFromPaper, toAddr) {
    try {
      if (bchUTXOsFromPaper.length === 0) {
        throw new Error('BCH UTXOs array is empty')
      }

      const transactionBuilder = new this.wallet.bchjs.TransactionBuilder()

      const fee = this.calculateSendCost(0, 0, bchUTXOsFromPaper.length)

      // Add inputs to the transaction.
      let totalAmount = 0
      bchUTXOsFromPaper.forEach(bchUtxo => {
        totalAmount += bchUtxo.value
        transactionBuilder.addInput(bchUtxo.tx_hash, bchUtxo.tx_pos)
      })

      // console.log(`totalAmount: ${totalAmount}`)
      // console.log(`fee: ${fee}`)

      // Add outputs to the transaction.
      const legacyAddr = this.wallet.bchjs.Address.toLegacyAddress(this.receiver.bchAddr)
      if (!toAddr) toAddr = legacyAddr
      // console.log('bch-token-sweep toAddr: ', toAddr)
      transactionBuilder.addOutput(toAddr, totalAmount - fee)

      // Send a 2000 sat donation to PSF to thank them for creating this awesome software.
      transactionBuilder.addOutput(bchDonation('psf').donations, this.donation)

      // Sign each input.
      bchUTXOsFromPaper.forEach((bchUtxo, index) =>
        transactionBuilder.sign(
          index,
          this.paper.ecPair,
          undefined,
          transactionBuilder.hashTypes.SIGHASH_ALL,
          bchUtxo.value
        )
      )

      // Build the transaction and return the hex.
      const hex = transactionBuilder.build().toHex()
      return hex
    } catch (err) {
      console.error('Error in transactions.js/buildSweepOnlyBchFromPaper()')
      throw err
    }
  }
}

module.exports = TransactionsLib
