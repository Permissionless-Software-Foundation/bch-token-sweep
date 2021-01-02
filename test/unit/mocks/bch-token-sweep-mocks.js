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

const mockPaperWalletWithLotsOfTokens = {
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
    },
    {
      height: 659541,
      tx_hash:
        '1b1ea3a4c978b784ba9edf6530f59e2b837c5bce8ea486d7e4316bb607115453',
      tx_pos: 1,
      value: 546,
      satoshis: 546,
      txid: '1b1ea3a4c978b784ba9edf6530f59e2b837c5bce8ea486d7e4316bb607115453',
      vout: 1,
      utxoType: 'token',
      transactionType: 'send',
      tokenId:
        '39846b990b7f1d1848a2997a4398e4245980e0bb5f2074972bb4fa512fd84bcf',
      tokenTicker: 'KBZ',
      tokenName: 'KriptoBuz',
      tokenDocumentUrl: 'kriptobuz.club',
      tokenDocumentHash: '',
      decimals: 8,
      tokenType: 1,
      tokenQty: 1,
      isValid: true
    },
    {
      height: 659541,
      tx_hash:
        '25617c794b73a5b52644d30d9a44990ff692b78068c3b257ea4b79a2bc3fca75',
      tx_pos: 1,
      value: 546,
      satoshis: 546,
      txid: '25617c794b73a5b52644d30d9a44990ff692b78068c3b257ea4b79a2bc3fca75',
      vout: 1,
      utxoType: 'token',
      transactionType: 'send',
      tokenId:
        '51baa91554e7c55b73c0d3a713dddc405f2a9face591819d4ba078fed4e7e3b3',
      tokenTicker: 'JARSTT',
      tokenName: 'Just A Random SLP Test Token',
      tokenDocumentUrl: 'https://nonexist.cash',
      tokenDocumentHash: '',
      decimals: 2,
      tokenType: 1,
      tokenQty: 1,
      isValid: true
    },
    {
      height: 659541,
      tx_hash:
        '43bb05dccf71a4a558c095fb77b83dceba9ec1b47863c53b67046880efce9487',
      tx_pos: 1,
      value: 546,
      satoshis: 546,
      txid: '43bb05dccf71a4a558c095fb77b83dceba9ec1b47863c53b67046880efce9487',
      vout: 1,
      utxoType: 'token',
      transactionType: 'send',
      tokenId:
        '1a1fd545b922c8ee4ecd89bc312904f4e3ba4cf7850141066ad3e3f281668188',
      tokenTicker: 'MINT',
      tokenName: 'Mint',
      tokenDocumentUrl: 'mintslp.com',
      tokenDocumentHash: '',
      decimals: 8,
      tokenType: 1,
      tokenQty: 1,
      isValid: true
    },
    {
      height: 659541,
      tx_hash:
        '55e8693bb85e368b715151f97f77d8c644214ef3949a04a7247653d241ee45ee',
      tx_pos: 1,
      value: 546,
      satoshis: 546,
      txid: '55e8693bb85e368b715151f97f77d8c644214ef3949a04a7247653d241ee45ee',
      vout: 1,
      utxoType: 'token',
      transactionType: 'send',
      tokenId:
        '4945d652ce40e8ecfc7bf00e98128720fe51232afffe258f924c8afb0f41ec81',
      tokenTicker: 'FULLSTACK',
      tokenName: 'FullStack.cash Demo Token',
      tokenDocumentUrl: 'https://FullStack.cash',
      tokenDocumentHash: '',
      decimals: 2,
      tokenType: 1,
      tokenQty: 1,
      isValid: true
    },
    {
      height: 659541,
      tx_hash:
        '7b28d6afcb998708ee62c13aedfb4f8336b1502f6324652b4e5adf040e99dc42',
      tx_pos: 1,
      value: 546,
      satoshis: 546,
      txid: '7b28d6afcb998708ee62c13aedfb4f8336b1502f6324652b4e5adf040e99dc42',
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
      tokenQty: 5,
      isValid: true
    },
    {
      height: 659541,
      tx_hash:
        '86a250722c09c0d32c6f63080bc32959f1ba67af2045c94445e93b2524fb2e5a',
      tx_pos: 1,
      value: 546,
      satoshis: 546,
      txid: '86a250722c09c0d32c6f63080bc32959f1ba67af2045c94445e93b2524fb2e5a',
      vout: 1,
      utxoType: 'token',
      transactionType: 'send',
      tokenId:
        'a28cf560dae041738ae5422660a1bb18d34fc743a08cac532168d0939ca5e29b',
      tokenTicker: 'FUND002',
      tokenName: 'PSF Funding Token',
      tokenDocumentUrl: 'https://PSFoundation.cash',
      tokenDocumentHash: '',
      decimals: 0,
      tokenType: 1,
      tokenQty: 1,
      isValid: true
    },
    {
      height: 659541,
      tx_hash:
        'a51ffb09c152e0b50ad0216066c4e364455e95bb31596af8b7f76117669f1e84',
      tx_pos: 1,
      value: 546,
      satoshis: 546,
      txid: 'a51ffb09c152e0b50ad0216066c4e364455e95bb31596af8b7f76117669f1e84',
      vout: 1,
      utxoType: 'token',
      transactionType: 'send',
      tokenId:
        '2ca575523723450565586e71f3da16e7c28a0c9669738e1eaf3e62485ebdd164',
      tokenTicker: 'GTU',
      tokenName: 'GLOBAL TRADE UNIT',
      tokenDocumentUrl: '',
      tokenDocumentHash: '',
      decimals: 0,
      tokenType: 1,
      tokenQty: 1,
      isValid: true
    },
    {
      height: 659541,
      tx_hash:
        'a93e787c7084b0d6ee339af6bf63f331959ba0fca921c211d3e29fc6c5fdc66d',
      tx_pos: 1,
      value: 546,
      satoshis: 546,
      txid: 'a93e787c7084b0d6ee339af6bf63f331959ba0fca921c211d3e29fc6c5fdc66d',
      vout: 1,
      utxoType: 'token',
      transactionType: 'send',
      tokenId:
        '4de69e374a8ed21cbddd47f2338cc0f479dc58daa2bbe11cd604ca488eca0ddf',
      tokenTicker: 'SPICE',
      tokenName: 'Spice',
      tokenDocumentUrl: 'spiceslp@gmail.com',
      tokenDocumentHash: '',
      decimals: 8,
      tokenType: 1,
      tokenQty: 2,
      isValid: true
    },
    {
      height: 659541,
      tx_hash:
        'af165e322b7562d23b84bb77ca82611906857e70aef1a0f7f2bda8c91976ac44',
      tx_pos: 1,
      value: 546,
      satoshis: 546,
      txid: 'af165e322b7562d23b84bb77ca82611906857e70aef1a0f7f2bda8c91976ac44',
      vout: 1,
      utxoType: 'token',
      transactionType: 'send',
      tokenId:
        '7f8889682d57369ed0e32336f8b7e0ffec625a35cca183f4e81fde4e71a538a1',
      tokenTicker: 'HONK',
      tokenName: 'HONK HONK',
      tokenDocumentUrl: 'THE REAL HONK SLP TOKEN',
      tokenDocumentHash: '',
      decimals: 0,
      tokenType: 1,
      tokenQty: 2,
      isValid: true
    },
    {
      height: 659541,
      tx_hash:
        'b99de01196d728dbe2c4df1ea8c889687269b1ed941befa5632cbee2ccd38556',
      tx_pos: 1,
      value: 546,
      satoshis: 546,
      txid: 'b99de01196d728dbe2c4df1ea8c889687269b1ed941befa5632cbee2ccd38556',
      vout: 1,
      utxoType: 'token',
      transactionType: 'send',
      tokenId:
        'f2ab8a7bf0711170713bfbf6374333c1afa5cf3a98b492d9ac891ab948dd2951',
      tokenTicker: 'GDN',
      tokenName: 'Garden Fresh token',
      tokenDocumentUrl: 'http://www.gardenfresh.app',
      tokenDocumentHash: '',
      decimals: 0,
      tokenType: 1,
      tokenQty: 1,
      isValid: true
    },
    {
      height: 659541,
      tx_hash:
        'c33496b587a1ee1e1d7eb82c71ffb982f210c806ca0707e51494865bd38bd7f1',
      tx_pos: 1,
      value: 546,
      satoshis: 546,
      txid: 'c33496b587a1ee1e1d7eb82c71ffb982f210c806ca0707e51494865bd38bd7f1',
      vout: 1,
      utxoType: 'token',
      transactionType: 'send',
      tokenId:
        '29d353a3d19cdd7324f1c14b3fe289293976842869fed1bea3f9510558f6f006',
      tokenTicker: 'LEAD',
      tokenName: 'LEAD Token (Leaders of Education Adoption and Development)',
      tokenDocumentUrl: '',
      tokenDocumentHash: '',
      decimals: 2,
      tokenType: 1,
      tokenQty: 1,
      isValid: true
    },
    {
      height: 659541,
      tx_hash:
        'ca5e8916c1ee3bb3a6fa70e94235341c1f06b0584b04d9aefeda0ac4989f8534',
      tx_pos: 1,
      value: 546,
      satoshis: 546,
      txid: 'ca5e8916c1ee3bb3a6fa70e94235341c1f06b0584b04d9aefeda0ac4989f8534',
      vout: 1,
      utxoType: 'token',
      transactionType: 'send',
      tokenId:
        'd6876f0fce603be43f15d34348bb1de1a8d688e1152596543da033a060cff798',
      tokenTicker: 'MIST',
      tokenName: 'Mistcoin',
      tokenDocumentUrl: 'https://mistcoin.org',
      tokenDocumentHash: '',
      decimals: 6,
      tokenType: 1,
      tokenQty: 0.1,
      isValid: true
    },
    {
      height: 659541,
      tx_hash:
        'dd41d04038c7e2dc1620967ec4000b760f1cda8f1e725387b006705c72d054fb',
      tx_pos: 1,
      value: 546,
      satoshis: 546,
      txid: 'dd41d04038c7e2dc1620967ec4000b760f1cda8f1e725387b006705c72d054fb',
      vout: 1,
      utxoType: 'token',
      transactionType: 'send',
      tokenId:
        '0671b2ae6225904dbf705b7359861d09bbfb2b45f3380828bddd4eeefc4def0d',
      tokenTicker: 'SLPTEST',
      tokenName: 'Screening Task',
      tokenDocumentUrl: 'https://FullStack.cash',
      tokenDocumentHash: '',
      decimals: 8,
      tokenType: 1,
      tokenQty: 1,
      isValid: true
    },
    {
      height: 659541,
      tx_hash:
        'f80546e473a7eb4b3486badb96eb684414354d45e65fd2ce6ad0ecb95b9cae1d',
      tx_pos: 1,
      value: 546,
      satoshis: 546,
      txid: 'f80546e473a7eb4b3486badb96eb684414354d45e65fd2ce6ad0ecb95b9cae1d',
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
      tokenQty: 5,
      isValid: true
    }
  ],
  bchUTXOs: []
}

const tokenUtxosWithMintingBaton = [
  {
    height: 668448,
    tx_hash: '60993abdac4016f86a2df03d96e994640880f064a84e59501349319a3a12cb49',
    tx_pos: 2,
    value: 546,
    satoshis: 546,
    txid: '60993abdac4016f86a2df03d96e994640880f064a84e59501349319a3a12cb49',
    vout: 2,
    utxoType: 'token',
    transactionType: 'send',
    tokenId: 'd1c16867b41d77e6196e2680173b3afc9dff1968118ad1b829b3c8b9b921328d',
    tokenTicker: 'SLPTEST',
    tokenName: 'SLP Test Token',
    tokenDocumentUrl: 'https://FullStack.cash',
    tokenDocumentHash: '',
    decimals: 8,
    tokenType: 1,
    tokenQty: 99,
    isValid: true,
    address: 'bitcoincash:qpan6clgy8vjkv8anz683phflsacrtx3xqvksf5569',
    hdIndex: 0
  },
  {
    height: 668448,
    tx_hash: 'd1c16867b41d77e6196e2680173b3afc9dff1968118ad1b829b3c8b9b921328d',
    tx_pos: 2,
    value: 546,
    satoshis: 546,
    txid: 'd1c16867b41d77e6196e2680173b3afc9dff1968118ad1b829b3c8b9b921328d',
    vout: 2,
    utxoType: 'minting-baton',
    tokenId: 'd1c16867b41d77e6196e2680173b3afc9dff1968118ad1b829b3c8b9b921328d',
    tokenTicker: 'SLPTEST',
    tokenName: 'SLP Test Token',
    tokenDocumentUrl: 'https://FullStack.cash',
    tokenDocumentHash: '',
    decimals: 8,
    tokenType: 1,
    isValid: true,
    address: 'bitcoincash:qpan6clgy8vjkv8anz683phflsacrtx3xqvksf5569',
    hdIndex: 0
  }
]

module.exports = {
  utxosFromReceiver,
  filteredUtxosFromReceiver,
  utxosFromPaperWallet,
  filteredUtxosFromPaperWallet,
  mockTwoTokenUtxos,
  mockAllPaperUtxosTwoTokens,
  mockAllPaperUtxosOneToken,
  mockPaperWalletWithLotsOfTokens,
  tokenUtxosWithMintingBaton
}
