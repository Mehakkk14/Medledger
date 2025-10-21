export const CONTRACT_ADDRESS = '0x26DE39Fb7204a7581F87d4195134Fe77B25E4192';

export const CONTRACT_ABI = [
	{
		"anonymous": false,
		"inputs": [
			{ "indexed": true, "internalType": "bytes32", "name": "h", "type": "bytes32" },
			{ "indexed": true, "internalType": "address", "name": "submitter", "type": "address" }
		],
		"name": "HashStored",
		"type": "event"
	},
	{
		"inputs": [
			{ "internalType": "bytes32", "name": "h", "type": "bytes32" }
		],
		"name": "storeHash",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{ "internalType": "bytes32", "name": "h", "type": "bytes32" }
		],
		"name": "isHashStored",
		"outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{ "internalType": "bytes32", "name": "", "type": "bytes32" }
		],
		"name": "stored",
		"outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ],
		"stateMutability": "view",
		"type": "function"
	}
];

export default { CONTRACT_ADDRESS, CONTRACT_ABI };
