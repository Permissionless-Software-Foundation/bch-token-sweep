/*
  This Class library is used to split coins between the ABC and BCHN chains.
  A fee is charged for this service.
*/

// Public npm libraries
const BCHJS = require('@psf/bch-js')

// The REST URLs for each chain.
const FULLSTACK_MAINNET_ABC_API_FREE = 'https://free-main.fullstack.cash/v3/'
const FULLSTACK_MAINNET_BCHN_API_FREE =
  'https://bchn-free-main.fullstack.cash/v3/'

// Processing Fee
// const SPLIT_FEE = 400000 // Production fee in satoshis
const SPLIT_FEE = 1000 // For testing.

class Split {
  constructor (config) {
    this.config = config

    this.bchjsAbc = new BCHJS({ restURL: FULLSTACK_MAINNET_ABC_API_FREE })
    this.bchjsBchn = new BCHJS({ restURL: FULLSTACK_MAINNET_BCHN_API_FREE })
  }

  /*
    Determins if the user can pay the sweep fee. It returns a number indicating
    the method for paying the fee. Throws and error if none of the methods for
    paying the fee are available.

    0 - If paper wallet has at least 0.002 BCH (on each chain), use that to pay fee.
    1 - else if web wallet has 0.004 Bitcoin on the preferred chain (ABC), use that to pay fee
    2 - else if web wallet has 0.004 Bitcoin on the other chain (BCHN), use that to pay fee.

    This function assumes that populateObjectFromNetwork() has already been called
    and the app already has the balance and UTXO information for both the paper
    wallet and the web wallet. This data should be included in the paperWallet
    and webWallet input objects.
  */
  async determineFee (paperWallet, webWallet) {
    try {
      const blah = 4 + 2 + SPLIT_FEE

      if (blah > 2) return 0
    } catch (err) {
      console.log('Error in determineFee()')
      throw err
    }
  }
}

module.exports = Split
