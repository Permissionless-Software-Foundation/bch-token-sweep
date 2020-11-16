# bch-token-sweep

This is a library that allows sweeping of Bitcoin Cash (BCH) and Simple Ledger Protocol (SLP) tokens from a paper wallet. Paper wallets are just a WIF private key embedded inside a QR code. You can generate a paper wallet for BCH at [paperwallet.bitcoin.com](https://paperwallet.bitcoin.com) and SLP tokens at [slp-paper-wallet.fullstack.cash](https://slp-paper-wallet.fullstack.cash/).

This library is intended to be used by the [gatsby-plugin-bch-sweep](https://github.com/Permissionless-Software-Foundation/gatsby-plugin-bch-sweep) Gatsby Plugin. This is a plugin that is incorporated into the [wallet.fullstack.cash](https://wallet.fullstack.cash) web wallet.

Check out the [end-to-end tests](test/e2e) for examples of different use-cases for this library.

## Example:
```javascript
// These are the WIF (private keys) used to operate the test.
const paperWif = 'KxtteuKQ2enad5jH2o5eGkSaTgas49kWmvADW6qqhLAURrxuUo7m'
const receiverWif = 'L3nSksvTtHHBRP3HNMDhy6hDKpu88PQvrLGzLJn3FYX2diKqC1GD'
const receiverAddr = 'simpleledger:qp7xf0f5x7hgj6ak2xzcdnt6e0wggdty8vqe0asv5y'

async function sweep(wif) {
  // Instancing the library
  const sweeperLib = new SweeperLib(paperWif, receiverWif)
  await sweeperLib.populateObjectFromNetwork()

  // Generate a transaction.
  const hex = await sweeperLib.sweepTo(receiverAddr)

  // Send a transaction.
  const txid = await sweeperLib.blockchain.broadcast(hex)

  console.log('Transaction ID', txid)
  console.log(`https://explorer.bitcoin.com/bch/tx/${txid}`)
}
sweep(paperWif)

```

#  Licence
[MIT](LICENSE.md)

t
