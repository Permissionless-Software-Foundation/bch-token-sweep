/*
  An example of a typical utility library. Things to notice:
  - This library is exported as a Class.
  - External dependencies are embedded into the class 'this' object: this.bitbox
  - `_this` maintains top-level context for `this`.
*/

'use strict'
const BigNumber = require('bignumber.js')

class UtilLib {
  constructor (bchWrapper, ECPairReceiver, ECPairPaper, toCashAddr, toSlpAddress) {
    this.bchWrapper = bchWrapper
    this.ECPairPaper = ECPairPaper
    this.ECPairReceiver = ECPairReceiver
    this.toCashAddr = toCashAddr
    this.toSlpAddress = toSlpAddress
  }

  calculateSendCost (inputLength, sendOpReturnLength, bchInputLength) {
    let estimatedFee = this.bchWrapper.BitcoinCash.getByteCount(
      { P2PKH: inputLength + bchInputLength }, // Adds BCH Input
      { P2PKH: 2 }
    )

    estimatedFee += sendOpReturnLength
    estimatedFee += 10 // added to account for OP_RETURN ammount of 0000000000000000
    estimatedFee += 546 // added for non-fee SLP output
    return estimatedFee
  }

  buildSweepSingleTokenWithoutBchFromPaper (tokenUTXOsFromPaper, bchUTXOsFromReceiver) {
    const transactionBuilder = new this.bchWrapper.TransactionBuilder()
    const quantityOfTokensToSend = tokenUTXOsFromPaper.reduce((acc, utxo) => new BigNumber(utxo.tokenQty).decimalPlaces(utxo.decimals).plus(acc), 0)
    const slpOpReturn = this.bchWrapper.SLP.TokenType1.generateSendOpReturn(tokenUTXOsFromPaper, quantityOfTokensToSend)
    const fee = this.calculateSendCost(tokenUTXOsFromPaper.length, slpOpReturn.script.length, 1)

    tokenUTXOsFromPaper.forEach(tokenUtxo => transactionBuilder.addInput(tokenUtxo.tx_hash, tokenUtxo.tx_pos))
    const selectedBchUtxo = bchUTXOsFromReceiver.filter(bchUtxo => bchUtxo.satoshis > fee)[0]
    transactionBuilder.addInput(selectedBchUtxo.tx_hash, selectedBchUtxo.tx_pos)

    transactionBuilder.addOutput(slpOpReturn.script, 0)
    transactionBuilder.addOutput(this.toSlpAddress, 546)
    transactionBuilder.addOutput(this.toCashAddr, (selectedBchUtxo.satoshis + (tokenUTXOsFromPaper.length * 546)) - fee)

    tokenUTXOsFromPaper.forEach((utxo, index) => transactionBuilder.sign(index, this.ECPairPaper, undefined, transactionBuilder.hashTypes.SIGHASH_ALL, utxo.satoshis))
    transactionBuilder.sign(tokenUTXOsFromPaper.length, this.ECPairReceiver, undefined, transactionBuilder.hashTypes.SIGHASH_ALL, selectedBchUtxo.satoshis)

    const hex = transactionBuilder.build().toHex()
    return hex
  }

  buildSweepSingleTokenWithBchFromPaper (tokenUTXOsFromPaper, bchUTXOsFromPaper) {
    const transactionBuilder = new this.bchWrapper.TransactionBuilder()
    const quantityOfTokensToSend = tokenUTXOsFromPaper.reduce((acc, utxo) => new BigNumber(utxo.tokenQty).decimalPlaces(utxo.decimals).plus(acc), 0)
    const slpOpReturn = this.bchWrapper.SLP.TokenType1.generateSendOpReturn(tokenUTXOsFromPaper, quantityOfTokensToSend)
    const fee = this.calculateSendCost(tokenUTXOsFromPaper.length, slpOpReturn.script.length, bchUTXOsFromPaper.length)

    let totalAmount = 0
    tokenUTXOsFromPaper.forEach(tokenUtxo => {
      totalAmount += tokenUtxo.satoshis
      transactionBuilder.addInput(tokenUtxo.tx_hash, tokenUtxo.tx_pos)
    })
    bchUTXOsFromPaper.forEach(bchUtxo => {
      totalAmount += bchUtxo.satoshis
      transactionBuilder.addInput(bchUtxo.tx_hash, bchUtxo.tx_pos)
    })

    transactionBuilder.addOutput(slpOpReturn.script, 0)
    transactionBuilder.addOutput(this.toSlpAddress, 546)
    transactionBuilder.addOutput(this.toCashAddr, (totalAmount - fee))

    tokenUTXOsFromPaper.forEach((utxo, index) => transactionBuilder.sign(index, this.ECPairPaper, undefined, transactionBuilder.hashTypes.SIGHASH_ALL, utxo.satoshis))
    bchUTXOsFromPaper.forEach((bchUtxo, index) => transactionBuilder.sign(tokenUTXOsFromPaper.length + index, this.ECPairPaper, undefined, transactionBuilder.hashTypes.SIGHASH_ALL, bchUtxo.satoshis))

    const hex = transactionBuilder.build().toHex()
    return hex
  }
}

module.exports = UtilLib
