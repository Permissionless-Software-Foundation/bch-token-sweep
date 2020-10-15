/*
  A mocking library for util.js unit tests.
  A mocking library contains data to use in place of the data that would come
  from an external dependency.
*/
'use strict'

// const BCHJS = require('@psf/bch-js')
// let ECPaper

const mockSingleSweepWithBch = {
  mnemonic:
    'lesson invite sketch panther carry museum ridge need express borrow prosper begin',
  toCashAddr: 'bitcoincash:qrr7npyw9p8jyjtfxgy6vf6kcw002pslsqkap733ch',
  toSlp: 'simpleledger:qrpsz38l2lz3n6d4vk2rqp23qzymlngcrcw2lavrfv',
  tokenId: '716daf7baf2f1c517e52a3f6ffd6f734d45eab20e87dc1c79108c5f0f6804888',
  tokenUTXOs: [
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
  bchUTXOs: [
    {
      height: 648594,
      tx_hash:
        '3a3bf52e9aebb4cc9529d778dec31ed5f7452c4ceefc26f48cb4e9eb4bb714db',
      tx_pos: 0,
      value: 299489,
      satoshis: 299489,
      txid: '3a3bf52e9aebb4cc9529d778dec31ed5f7452c4ceefc26f48cb4e9eb4bb714db',
      vout: 0,
      isValid: false
    }
  ],
  resultHex:
    '0200000002ced81dab4de3d63babb98d719ed68d22d7d5e631e9a2bcc15f4cbaecd573e3f0010000006a47304402207996f8357e336eb35331a55d51b0ff36996f11e30f22c57c07281153d406b1a2022034d95eafd6d1d0e6910049169cbb27e771c933d4f41f535a419e3fa090d922c24121022d8ad2f9fd868980fc0a416dc84f9d513504160a95b7378fb6f55ebdd3ed17c5ffffffffdb14b74bebe9b48cf426fcee4c2c45f7d51ec3de78d72995ccb4eb9a2ef53b3a000000006b48304502210095b54cf0ff3135d10476106920d7c4627e1897fb9e7729d3c3fec1a09d6d4a6c02203fc07aac624d598032b6a4128ec40ed03605f8c8cc45392f38462e1b62a9d9384121022d8ad2f9fd868980fc0a416dc84f9d513504160a95b7378fb6f55ebdd3ed17c5ffffffff030000000000000000376a04534c500001010453454e4420716daf7baf2f1c517e52a3f6ffd6f734d45eab20e87dc1c79108c5f0f6804888080000000005a6d6a022020000000000001976a914c30144ff57c519e9b565943005510089bfcd181e88ac2a900400000000001976a914c7e9848e284f2249693209a62756c39ef5061f8088ac00000000'
}

const mockPaperHydratedUtxos = {
  tokenUTXOs: [
    {
      height: 654089,
      tx_hash:
        'c5f82fdb0fc15fe5b002b9b96ec1ac7dbf38e838d07cea8e17ed54f8cbec6868',
      tx_pos: 1,
      value: 546,
      satoshis: 546,
      txid: 'c5f82fdb0fc15fe5b002b9b96ec1ac7dbf38e838d07cea8e17ed54f8cbec6868',
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
  bchUTXOs: [
    {
      height: 654089,
      tx_hash:
        'c5f82fdb0fc15fe5b002b9b96ec1ac7dbf38e838d07cea8e17ed54f8cbec6868',
      tx_pos: 2,
      value: 9561,
      satoshis: 9561,
      txid: 'c5f82fdb0fc15fe5b002b9b96ec1ac7dbf38e838d07cea8e17ed54f8cbec6868',
      vout: 2,
      isValid: false
    }
  ]
}

const mockReceiverHydratedUtxos = {
  tokenUTXOs: [],
  bchUTXOs: [
    {
      height: 656443,
      tx_hash:
        '7fe49c3ac9c8d83e65e7ddf54d17ed315b152a3035348a4a82c67b2d99d3e468',
      tx_pos: 0,
      value: 39362,
      satoshis: 39362,
      txid: '7fe49c3ac9c8d83e65e7ddf54d17ed315b152a3035348a4a82c67b2d99d3e468',
      vout: 0,
      isValid: false
    }
  ]
}

module.exports = {
  mockSingleSweepWithBch,
  mockPaperHydratedUtxos,
  mockReceiverHydratedUtxos
}
