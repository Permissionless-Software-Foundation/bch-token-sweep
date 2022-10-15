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
          tx_hash: 'c5f82fdb0fc15fe5b002b9b96ec1ac7dbf38e838d07cea8e17ed54f8cbec6868',
          tx_pos: 1,
          value: 546,
          satoshis: 546,
          txid: 'c5f82fdb0fc15fe5b002b9b96ec1ac7dbf38e838d07cea8e17ed54f8cbec6868',
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
          height: 654089,
          tx_hash: 'c5f82fdb0fc15fe5b002b9b96ec1ac7dbf38e838d07cea8e17ed54f8cbec6868',
          tx_pos: 2,
          value: 9561,
          satoshis: 9561,
          txid: 'c5f82fdb0fc15fe5b002b9b96ec1ac7dbf38e838d07cea8e17ed54f8cbec6868',
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
      tx_hash: '136c7f0fa7de4cdd8e06bf623e1eba3130baea30cc3ef6b9a7a60b4ce7030cfc',
      tx_pos: 1,
      value: 546,
      satoshis: 546,
      txid: '136c7f0fa7de4cdd8e06bf623e1eba3130baea30cc3ef6b9a7a60b4ce7030cfc',
      vout: 1,
      utxoType: 'token',
      transactionType: 'send',
      tokenId: '38e97c5d7d3585a2cbf3f9580c82ca33985f9cb0845d4dcce220cb709f9538b0',
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
      tx_hash: 'af273094d4121de038bf0a54d07b6f680bdc4ecd8dcc19500cba4dee4fe5ff8f',
      tx_pos: 0,
      value: 19028,
      satoshis: 19028,
      txid: 'af273094d4121de038bf0a54d07b6f680bdc4ecd8dcc19500cba4dee4fe5ff8f',
      vout: 0,
      isValid: false
    }
  ]
}

const mockUtxoGetOut01 = {
  address: 'bitcoincash:qr2ff53xanqdkj38arpfydxx7awxjhqxdscr2t3p4y',
  bchUtxos: [{
    height: 0,
    tx_hash: '54e53dc74a25d483696a60aca8a37c12690105460e9e7fa0716efbdc7dabcff6',
    tx_pos: 0,
    value: 50000,
    txid: '54e53dc74a25d483696a60aca8a37c12690105460e9e7fa0716efbdc7dabcff6',
    vout: 0,
    address: 'bitcoincash:qpq6u6fh940npvsk5kqaqxlpgtkyxkknk50z9ws3ke',
    isSlp: false
  }
  ],
  slpUtxos: {
    type1: {
      tokens: [
        {
          height: 0,
          tx_hash: 'adbadd637c04bdaafab83d211344fe0e01e5d6b9006eada6ef279e9694ec31ae',
          tx_pos: 1,
          value: 546,
          txid: 'adbadd637c04bdaafab83d211344fe0e01e5d6b9006eada6ef279e9694ec31ae',
          vout: 1,
          isSlp: true,
          type: 'token',
          qty: '500',
          tokenId: 'a4fb5c2da1aa064e25018a43f9165040071d9e984ba190c222a7f59053af84b2',
          address: 'bitcoincash:qr2ff53xanqdkj38arpfydxx7awxjhqxdscr2t3p4y',
          ticker: 'TROUT',
          name: "Trout's test token",
          documentUri: 'troutsblog.com',
          documentHash: '',
          decimals: 2,
          qtyStr: '5'
        }
      ],
      mintBatons: []
    },
    nft: {}
  },
  nullUtxos: []
}

const mockUtxoGetOut02 = {
  address: 'bitcoincash:qr69kyzha07dcecrsvjwsj4s6slnlq4r8c30lxnur3',
  bchUtxos: [
    {
      height: 603416,
      tx_hash: 'eef683d236d88e978bd406419f144057af3fe1b62ef59162941c1a9f05ded62c',
      tx_pos: 0,
      value: 1000,
      txid: 'eef683d236d88e978bd406419f144057af3fe1b62ef59162941c1a9f05ded62c',
      vout: 0,
      address: 'bitcoincash:qr69kyzha07dcecrsvjwsj4s6slnlq4r8c30lxnur3',
      isSlp: false
    },
    {
      height: 646894,
      tx_hash: '4c695fae636f3e8e2edc571d11756b880ccaae744390f3950d798ce7b5e25754',
      tx_pos: 0,
      value: 600,
      txid: '4c695fae636f3e8e2edc571d11756b880ccaae744390f3950d798ce7b5e25754',
      vout: 0,
      address: 'bitcoincash:qr69kyzha07dcecrsvjwsj4s6slnlq4r8c30lxnur3',
      isSlp: false
    }
  ],
  slpUtxos: {
    type1: {
      tokens: [
        {
          height: 648591,
          tx_hash:
            'f0e373d5ecba4c5fc1bca2e931e6d5d7228dd69e718db9ab3bd6e34dab1dd8ce',
          tx_pos: 1,
          value: 546,
          satoshis: 546,
          txid: 'f0e373d5ecba4c5fc1bca2e931e6d5d7228dd69e718db9ab3bd6e34dab1dd8ce',
          vout: 1,
          utxoType: 'token',
          transactionType: 'send',
          tokenId:
            '716daf7baf2f1c517e52a3f6ffd6f734d45eab20e87dc1c79108c5f0f6804888',
          tokenTicker: 'ALCIPIR',
          tokenName: 'A L C P R',
          tokenDocumentUrl: 'mint.bitcoin.com',
          tokenDocumentHash: '',
          decimals: 4,
          tokenType: 1,
          tokenQty: 9482,
          isValid: true
        }
      ],
      mintBatons: []
    },
    nft: {}
  },
  nullUtxos: [],
  status: 200
}

module.exports = {
  mockBalance,
  mockUtxos,
  mockUtxosWithTokenDetails,
  mockPaperWallet,
  mockUtxoGetOut01,
  mockUtxoGetOut02
}
