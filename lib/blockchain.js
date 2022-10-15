/*
  A utitlity library containing functions for interacting with blockchain data.
*/

// Public npm libraries
// const wallet = require('@psf/bch-js')

// Constants
// const FULLSTACK_MAINNET_API_FREE = 'https://free-main.fullstack.cash/v3/'
// const DEFAULT_BCH_WRAPPER = new wallet({ restURL: FULLSTACK_MAINNET_API_FREE })

class Blockchain {
  constructor (config) {
    if (!config) this.config = {}
    else this.config = config

    // This is an instance of bch-js. It will default to its own instance if one
    // is not provided.
    if (this.config.wallet) {
      this.wallet = config.wallet
    // } else this.wallet = DEFAULT_BCH_WRAPPER
    } else throw new Error('bch-js instance must be passed when instantiating.')
  }

  // Return the BCH balance for an address.
  async getBalanceForCashAddr (cashAddr) {
    try {
      const balanceResult = await this.wallet.getBalance(cashAddr)
      // console.log(`balanceResult: ${JSON.stringify(balanceResult, null, 2)}`)

      return balanceResult
    } catch (e) {
      // console.log(e)
      throw new Error(`Could not get balance for ${cashAddr}`)
    }
  }

  // Return UTXOs divided into token and BCH UTXOs.
  // This version uses the new psf-slp-indexer.
  // TODO: Expand functionality to work with NFTs.
  async filterUtxosByTokenAndBch2 (addr) {
    try {
      const utxos = await this.wallet.getUtxos(addr)
      // console.log(`utxos: ${JSON.stringify(utxos, null, 2)}`)

      const filteredUtxos = {
        bchUTXOs: utxos.bchUtxos,
        tokenUTXOs: utxos.slpUtxos.type1.tokens,
        nftUTXOs: []
      }

      // Try to extract the NFT UTXOs.
      try {
        filteredUtxos.nftUTXOs = utxos.slpUtxos.nft.tokens

        // Ensure this is an array.
        if (!filteredUtxos.nftUTXOs) filteredUtxos.nftUTXOs = []
      } catch (err) {
        /* exit quietly */
        // console.log('error adding NFT UTXOs: ', err)
      }

      // Add missing properties
      filteredUtxos.tokenUTXOs.map(x => {
        x.tokenQty = x.qtyStr
        return x
      })

      return filteredUtxos
    } catch (err) {
      console.error('Error in blockchain.js/filterUtxosByTokenAndBch2()')
      throw err
    }
  }

  async broadcast (hex) {
    const txId = await this.wallet.ar.sendTx(hex)
    return txId
  }

  // This function takes a WIF private key as input and returns an object of
  // expanded data. It includes an EC Pair, the BCH address, and the SLP address.
  // This function does not require network connectivity.
  expandWif (wif) {
    const ecPair = this.wallet.bchjs.ECPair.fromWIF(wif)

    const bchAddr = this.wallet.bchjs.ECPair.toCashAddress(ecPair)
    // const bchAddr = ''

    const slpAddr = this.wallet.bchjs.SLP.Address.toSLPAddress(bchAddr)
    // const slpAddr = ''

    return { wif, ecPair, bchAddr, slpAddr }
  }

  // Expects an object containing BCH and SLP UTXOs.
  // It will sum up the
  // BCH balance in the bchUtxos array and return that amount. It will ignore
  // the BCH utxos used for tokens. This is useful for calculating the spendable
  // BCH on a paper wallet.
  getNonTokenBch (utxoObj) {
    // console.log('utxoObj: ', utxoObj)

    const bchUtxos = utxoObj.bchUTXOs

    let totalSats = 0
    bchUtxos.map((elem) => (totalSats += elem.value))

    return totalSats
  }
}

module.exports = Blockchain
