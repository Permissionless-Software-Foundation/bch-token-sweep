/*
  mock data for bch-token-sweep unit tests.
*/

const utxosFromReceiver = [
  {
    height: 0,
    tx_hash: '6d93bfe3ad5ed78015384b9c69fff67f7b53c79acd42b23e69c2ead1dd4f6a60',
    tx_pos: 0,
    value: 10000
  }
]

const filteredUtxosFromReceiver = {
  tokenUTXOs: [],
  bchUTXOs: [
    {
      height: 0,
      tx_hash:
        '6d93bfe3ad5ed78015384b9c69fff67f7b53c79acd42b23e69c2ead1dd4f6a60',
      tx_pos: 0,
      value: 10000,
      satoshis: 10000,
      txid: '6d93bfe3ad5ed78015384b9c69fff67f7b53c79acd42b23e69c2ead1dd4f6a60',
      vout: 0,
      isValid: false
    }
  ]
}

const utxosFromPaperWallet = [
  {
    height: 0,
    tx_hash: '845828f437caa257341ede91d0aefbba326c9aaa9e2e6435e713d942eaa822d2',
    tx_pos: 1,
    value: 546
  }
]

const filteredUtxosFromPaperWallet = {
  tokenUTXOs: [
    {
      height: 0,
      tx_hash:
        '845828f437caa257341ede91d0aefbba326c9aaa9e2e6435e713d942eaa822d2',
      tx_pos: 1,
      value: 546,
      satoshis: 546,
      txid: '845828f437caa257341ede91d0aefbba326c9aaa9e2e6435e713d942eaa822d2',
      vout: 1,
      utxoType: 'token',
      transactionType: 'send',
      tokenId:
        'a4fb5c2da1aa064e25018a43f9165040071d9e984ba190c222a7f59053af84b2',
      tokenTicker: 'TROUT',
      tokenName: "Trout's test token",
      tokenDocumentUrl: 'troutsblog.com',
      tokenDocumentHash: '',
      decimals: 2,
      tokenType: 1,
      tokenQty: 10,
      isValid: true
    }
  ],
  bchUTXOs: []
}

module.exports = {
  utxosFromReceiver,
  filteredUtxosFromReceiver,
  utxosFromPaperWallet,
  filteredUtxosFromPaperWallet
}
