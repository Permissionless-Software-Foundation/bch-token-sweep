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

const mockUtxosWithTokenDetails = [
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

module.exports = {
  mockBalance,
  mockUtxos,
  mockUtxosWithTokenDetails
}
