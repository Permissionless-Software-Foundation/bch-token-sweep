/*
  An npm JavaScript library for front end web apps. Implements a minimal
  Bitcoin Cash wallet.
*/

/* eslint-disable no-async-promise-executor */
/*
*
Sweep a private key with a single token class and no BCH.
Sweep a private key with two classes of tokens and no BCH.
Sweep a prviate key with a single token class and some BCH.
Sweep a private key with a two classes of tokens and some BCH.
Sweep private key with single token class but multiple UTXOs and multiple BCH-only UTXOs.
Sweep private key with two token classes and multiple UTXOS of each, and multiple BCH-only UTXOs.
*
*/

'use strict'

const BCHJS = require('@psf/bch-js')
const UtilLib = require('./lib/util')
const FULLSTACK_MAINNET_API_FREE = 'https://free-main.fullstack.cash/v3/'
const DEFAULT_BCH_WRAPPER = new BCHJS({ restURL: FULLSTACK_MAINNET_API_FREE })

class Sweeper {
  constructor (WIFFromPaperWallet, WIFFromReceiver, BCHWrapper) {
    this.bchWrapper = BCHWrapper
    if (!BCHWrapper) {
      this.bchWrapper = DEFAULT_BCH_WRAPPER
    }

    if (!WIFFromPaperWallet) {
      throw new Error('WIF from paper wallet not found')
    }

    if (!WIFFromReceiver) {
      throw new Error('WIF from receiver not found')
    }

    this.WIFFromPaperWallet = WIFFromPaperWallet
    this.WIFFromReceiver = WIFFromReceiver
    this.ECPairFromReceiver = this.bchWrapper.ECPair.fromWIF(
      this.WIFFromReceiver
    )
    this.CashAddrFromReceiver = this.bchWrapper.ECPair.toCashAddress(
      this.ECPairFromReceiver
    )
    this.ECPairFromPaperWallet = this.bchWrapper.ECPair.fromWIF(
      this.WIFFromPaperWallet
    )
    this.CashAddrFromPaperWallet = this.bchWrapper.ECPair.toCashAddress(
      this.ECPairFromPaperWallet
    )
  }

  async getBalanceForCashAddr (cashAddr) {
    try {
      const balanceResult = await this.bchWrapper.Electrumx.balance(cashAddr)
      if (balanceResult.success) {
        return balanceResult.confirmed + balanceResult.unconfirmed
      } else {
        throw new Error('Error fetching balance from API')
      }
    } catch (e) {
      throw new Error(`Could not get balance for ${cashAddr}`)
    }
  }

  async getUtxos (cashAddr) {
    try {
      const utxoResponse = await this.bchWrapper.Electrumx.utxo(cashAddr)
      if (!utxoResponse.success) {
        throw new Error('Error fetching UTXOs from Electrumx')
      }
      return utxoResponse.utxos
    } catch (e) {
      throw new Error(
        `Could not get UTXOs for ${cashAddr}, details: ${e.message}`
      )
    }
  }

  async filterUtxosByTokenAndBch (utxos) {
    try {
      const utxosWithTokenDetails = await this.bchWrapper.SLP.Utils.tokenUtxoDetails(
        utxos
      )
      return {
        tokenUTXOs: utxosWithTokenDetails.filter(utxo => utxo.isValid),
        bchUTXOS: utxosWithTokenDetails.filter(utxo => !utxo.isValid)
      }
    } catch (e) {
      throw new Error(`Could not get details of UTXOs, details: ${e.message}`)
    }
  }

  async build () {
    try {
      this.BCHBalanceFromReceiver = await this.getBalanceForCashAddr(
        this.CashAddrFromReceiver
      )
      this.BCHBalanceFromPaperWallet = await this.getBalanceForCashAddr(
        this.CashAddrFromPaperWallet
      )
      const utxosFromReceiver = await this.getUtxos(this.CashAddrFromReceiver)
      const utxosFromPaperWallet = await this.getUtxos(
        this.CashAddrFromPaperWallet
      )
      const filteredUtxosFromReceiver = await this.filterUtxosByTokenAndBch(
        utxosFromReceiver
      )
      const filteredUtxosFromPaperWallet = await this.filterUtxosByTokenAndBch(
        utxosFromPaperWallet
      )
      this.UTXOsFromReceiver = {}
      this.UTXOsFromReceiver.bchUTXOs = filteredUtxosFromReceiver.bchUTXOS
      this.UTXOsFromPaperWallet = {}
      this.UTXOsFromPaperWallet.tokenUTXOs =
        filteredUtxosFromPaperWallet.tokenUTXOs
      this.UTXOsFromPaperWallet.bchUTXOs = filteredUtxosFromPaperWallet.bchUTXOS
    } catch (e) {
      throw new Error(e.message)
    }
  }

  async sweepTo (toSLPAddr, tokenId) {
    let txId
    if (tokenId) {
      // Single Token
      if (this.utxosFromPaperWallet.bchUTXOs.length === 0) {
        // Sweep with own BCH
        const tokenUtxos = this.UTXOsFromPaperWallet.tokenUTXOs.filter(
          utxo => utxo.tokenId === tokenId
        )
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
      } else {
        // Sweep using BCH from paper wallet
        const tokenUtxos = this.UTXOsFromPaperWallet.tokenUTXOs.filter(
          utxo => utxo.tokenId === tokenId
        )
        const util = new UtilLib(
          this.bchWrapper,
          this.ECPairFromReceiver,
          this.ECPairFromPaperWallet,
          this.CashAddrFromReceiver,
          toSLPAddr
        )
        const hex = util.buildSweepSingleTokenWithBchFromPaper(
          tokenUtxos,
          this.UTXOsFromPaperWallet.bchUTXOs
        )
        txId = await this.bchWrapper.RawTransactions.sendRawTransaction(hex)
      }
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
    }
    return txId
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
