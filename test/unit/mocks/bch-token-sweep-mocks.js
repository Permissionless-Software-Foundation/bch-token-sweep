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

const mockTwoTokenUtxos = [
  {
    height: 0,
    tx_hash: '845828f437caa257341ede91d0aefbba326c9aaa9e2e6435e713d942eaa822d2',
    tx_pos: 1,
    value: 546,
    satoshis: 546,
    txid: '845828f437caa257341ede91d0aefbba326c9aaa9e2e6435e713d942eaa822d2',
    vout: 1,
    utxoType: 'token',
    transactionType: 'send',
    tokenId: 'a4fb5c2da1aa064e25018a43f9165040071d9e984ba190c222a7f59053af84b2',
    tokenTicker: 'TROUT',
    tokenName: "Trout's test token",
    tokenDocumentUrl: 'troutsblog.com',
    tokenDocumentHash: '',
    decimals: 2,
    tokenType: 1,
    tokenQty: 10,
    isValid: true
  },
  {
    height: 657099,
    tx_hash: 'afc6e323541ae82748af2804c3f2de7cfa8690b43bb062f93e0c110f345162f4',
    tx_pos: 1,
    value: 546,
    satoshis: 546,
    txid: 'afc6e323541ae82748af2804c3f2de7cfa8690b43bb062f93e0c110f345162f4',
    vout: 1,
    utxoType: 'token',
    transactionType: 'send',
    tokenId: '4945d652ce40e8ecfc7bf00e98128720fe51232afffe258f924c8afb0f41ec81',
    tokenTicker: 'FULLSTACK',
    tokenName: 'FullStack.cash Demo Token',
    tokenDocumentUrl: 'https://FullStack.cash',
    tokenDocumentHash: '',
    decimals: 2,
    tokenType: 1,
    tokenQty: 1,
    isValid: true
  }
]

const mockAllPaperUtxosTwoTokens = {
  tokenUTXOs: [
    {
      height: 657189,
      tx_hash:
        '99f6523cc855629d64c7b93d7167407e1b6fa2ecf40441cd29d0f57b1da6836d',
      tx_pos: 1,
      value: 546,
      satoshis: 546,
      txid: '99f6523cc855629d64c7b93d7167407e1b6fa2ecf40441cd29d0f57b1da6836d',
      vout: 1,
      utxoType: 'token',
      transactionType: 'send',
      tokenId:
        '6201f3efe486c577433622817b99645e1d473cd3882378f9a0efc128ab839a82',
      tokenTicker: 'VALENTINE',
      tokenName: 'Valentine day token',
      tokenDocumentUrl: 'fullstack.cash',
      tokenDocumentHash: '',
      decimals: 2,
      tokenType: 1,
      tokenQty: 1,
      isValid: true
    },
    {
      height: 0,
      tx_hash:
        '250e57664eecad93e6c28f2bae5712a65bb079c09e6b4ecd81a8ad4f461406c4',
      tx_pos: 1,
      value: 546,
      satoshis: 546,
      txid: '250e57664eecad93e6c28f2bae5712a65bb079c09e6b4ecd81a8ad4f461406c4',
      vout: 1,
      utxoType: 'token',
      transactionType: 'send',
      tokenId:
        '6201f3efe486c577433622817b99645e1d473cd3882378f9a0efc128ab839a82',
      tokenTicker: 'VALENTINE',
      tokenName: 'Valentine day token',
      tokenDocumentUrl: 'fullstack.cash',
      tokenDocumentHash: '',
      decimals: 2,
      tokenType: 1,
      tokenQty: 1,
      isValid: true
    },
    {
      height: 0,
      tx_hash:
        'e6c0bb2d514eac97d50b581864ff8ba365ea7ce82c77da64737974c882144c43',
      tx_pos: 1,
      value: 546,
      satoshis: 546,
      txid: 'e6c0bb2d514eac97d50b581864ff8ba365ea7ce82c77da64737974c882144c43',
      vout: 1,
      utxoType: 'token',
      transactionType: 'send',
      tokenId:
        '8939c23d195c01b9564279281222c0db8acb3541701db777814ac462c5fe04d4',
      tokenTicker: 'JADE',
      tokenName: 'Jade',
      tokenDocumentUrl: 'gemstone.cash',
      tokenDocumentHash: '',
      decimals: 0,
      tokenType: 1,
      tokenQty: 1,
      isValid: true
    }
  ],
  bchUTXOs: [
    {
      height: 0,
      tx_hash:
        'e44843e80c39d6ae66bd5dc96f8f0fe36b3dd1f0a131c031aa01c7b690acd276',
      tx_pos: 0,
      value: 5000,
      satoshis: 5000,
      txid: 'e44843e80c39d6ae66bd5dc96f8f0fe36b3dd1f0a131c031aa01c7b690acd276',
      vout: 0,
      isValid: false
    }
  ]
}

const mockAllPaperUtxosOneToken = {
  tokenUTXOs: [
    {
      height: 0,
      tx_hash:
        'e6c0bb2d514eac97d50b581864ff8ba365ea7ce82c77da64737974c882144c43',
      tx_pos: 1,
      value: 546,
      satoshis: 546,
      txid: 'e6c0bb2d514eac97d50b581864ff8ba365ea7ce82c77da64737974c882144c43',
      vout: 1,
      utxoType: 'token',
      transactionType: 'send',
      tokenId:
        '8939c23d195c01b9564279281222c0db8acb3541701db777814ac462c5fe04d4',
      tokenTicker: 'JADE',
      tokenName: 'Jade',
      tokenDocumentUrl: 'gemstone.cash',
      tokenDocumentHash: '',
      decimals: 0,
      tokenType: 1,
      tokenQty: 1,
      isValid: true
    }
  ],
  bchUTXOs: [
    {
      height: 0,
      tx_hash:
        'e44843e80c39d6ae66bd5dc96f8f0fe36b3dd1f0a131c031aa01c7b690acd276',
      tx_pos: 0,
      value: 5000,
      satoshis: 5000,
      txid: 'e44843e80c39d6ae66bd5dc96f8f0fe36b3dd1f0a131c031aa01c7b690acd276',
      vout: 0,
      isValid: false
    }
  ]
}

module.exports = {
  utxosFromReceiver,
  filteredUtxosFromReceiver,
  utxosFromPaperWallet,
  filteredUtxosFromPaperWallet,
  mockTwoTokenUtxos,
  mockAllPaperUtxosTwoTokens,
  mockAllPaperUtxosOneToken
}
