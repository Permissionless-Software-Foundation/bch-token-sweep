/*
  A utitlity library containing functions for interacting with blockchain data.
*/

// Public npm libraries
const BCHJS = require('@psf/bch-js')

// Constants
const FULLSTACK_MAINNET_API_FREE = 'https://free-main.fullstack.cash/v3/'
const DEFAULT_BCH_WRAPPER = new BCHJS({ restURL: FULLSTACK_MAINNET_API_FREE })

class Blockchain {
  constructor (config) {
    if (!config) this.config = {}
    else this.config = config

    // This is an instance of bch-js. It will default to its own instance if one
    // is not provided.
    if (this.config.bchjs) {
      this.bchjs = config.bchjs
    } else this.bchjs = DEFAULT_BCH_WRAPPER
  }

  async getBalanceForCashAddr (cashAddr) {
    try {
      const balanceResult = await this.bchjs.Electrumx.balance(cashAddr)
      // console.log(`balanceResult: ${JSON.stringify(balanceResult, null, 2)}`)

      return balanceResult.balance.confirmed + balanceResult.balance.unconfirmed
    } catch (e) {
      // console.log(e)
      throw new Error(`Could not get balance for ${cashAddr}`)
    }
  }

  // Get's all UTXOs associated with an address.
  async getUtxos (cashAddr) {
    try {
      const utxoResponse = await this.bchjs.Electrumx.utxo(cashAddr)

      return utxoResponse.utxos
    } catch (e) {
      throw new Error(
        `Could not get UTXOs for ${cashAddr}, details: ${e.message}`
      )
    }
  }
}

module.exports = Blockchain
