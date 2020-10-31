/*
  Mocking data for the blockchain unit tests.
*/

const mockBalance = {
  success: true,
  balance: {
    confirmed: 10107,
    unconfirmed: 0
  }
}

const mockUtxos = [
  {
    height: 654089,
    tx_hash: 'c5f82fdb0fc15fe5b002b9b96ec1ac7dbf38e838d07cea8e17ed54f8cbec6868',
    tx_pos: 1,
    value: 546
  },
  {
    height: 654089,
    tx_hash: 'c5f82fdb0fc15fe5b002b9b96ec1ac7dbf38e838d07cea8e17ed54f8cbec6868',
    tx_pos: 2,
    value: 9561
  }
]

const mockUtxosWithTokenDetails = {
  slpUtxos: [
    {
      utxos: [
        {
          height: 654089,
          tx_hash:
            'c5f82fdb0fc15fe5b002b9b96ec1ac7dbf38e838d07cea8e17ed54f8cbec6868',
          tx_pos: 1,
          value: 546,
          satoshis: 546,
          txid:
            'c5f82fdb0fc15fe5b002b9b96ec1ac7dbf38e838d07cea8e17ed54f8cbec6868',
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
        },
        {
          height: 654089,
          tx_hash:
            'c5f82fdb0fc15fe5b002b9b96ec1ac7dbf38e838d07cea8e17ed54f8cbec6868',
          tx_pos: 2,
          value: 9561,
          satoshis: 9561,
          txid:
            'c5f82fdb0fc15fe5b002b9b96ec1ac7dbf38e838d07cea8e17ed54f8cbec6868',
          vout: 2,
          isValid: false
        }
      ]
    }
  ]
}

const mockPaperWallet = {
  tokenUTXOs: [
    {
      height: 659541,
      tx_hash:
        '136c7f0fa7de4cdd8e06bf623e1eba3130baea30cc3ef6b9a7a60b4ce7030cfc',
      tx_pos: 1,
      value: 546,
      satoshis: 546,
      txid: '136c7f0fa7de4cdd8e06bf623e1eba3130baea30cc3ef6b9a7a60b4ce7030cfc',
      vout: 1,
      utxoType: 'token',
      transactionType: 'send',
      tokenId:
        '38e97c5d7d3585a2cbf3f9580c82ca33985f9cb0845d4dcce220cb709f9538b0',
      tokenTicker: 'PSF',
      tokenName: 'Permissionless Software Foundation',
      tokenDocumentUrl: 'psfoundation.cash',
      tokenDocumentHash: '',
      decimals: 8,
      tokenType: 1,
      tokenQty: 0.01,
      isValid: true
    }
  ],
  bchUTXOs: [
    {
      height: 0,
      tx_hash:
        'af273094d4121de038bf0a54d07b6f680bdc4ecd8dcc19500cba4dee4fe5ff8f',
      tx_pos: 0,
      value: 19028,
      satoshis: 19028,
      txid: 'af273094d4121de038bf0a54d07b6f680bdc4ecd8dcc19500cba4dee4fe5ff8f',
      vout: 0,
      isValid: false
    }
  ]
}

module.exports = {
  mockBalance,
  mockUtxos,
  mockUtxosWithTokenDetails,
  mockPaperWallet
}
