import { ethers } from 'ethers';
import contractConfig from '@/config/contract';

declare global {
  interface Window {
    ethereum?: any;
  }
}

// Expected Chain ID for your contract (update based on your deployment)
const EXPECTED_CHAIN_ID = 11155111; // Sepolia Testnet
const EXPECTED_CHAIN_NAME = "Sepolia Testnet";

const getProvider = () => {
  if (window.ethereum) return new ethers.BrowserProvider(window.ethereum);
  return null;
};

export async function checkNetwork(): Promise<{ correct: boolean; currentChainId: number | null; expectedChainId: number }> {
  if (!window.ethereum) {
    return { correct: false, currentChainId: null, expectedChainId: EXPECTED_CHAIN_ID };
  }
  
  try {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const network = await provider.getNetwork();
    const currentChainId = Number(network.chainId);
    
    return {
      correct: currentChainId === EXPECTED_CHAIN_ID,
      currentChainId,
      expectedChainId: EXPECTED_CHAIN_ID
    };
  } catch (error) {
    console.error('Network check error:', error);
    return { correct: false, currentChainId: null, expectedChainId: EXPECTED_CHAIN_ID };
  }
}

export async function switchToCorrectNetwork(): Promise<boolean> {
  if (!window.ethereum) return false;
  
  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: `0x${EXPECTED_CHAIN_ID.toString(16)}` }],
    });
    return true;
  } catch (switchError: any) {
    // This error code indicates that the chain has not been added to MetaMask
    if (switchError.code === 4902) {
      try {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [{
            chainId: `0x${EXPECTED_CHAIN_ID.toString(16)}`,
            chainName: EXPECTED_CHAIN_NAME,
            nativeCurrency: {
              name: 'Sepolia ETH',
              symbol: 'SepoliaETH',
              decimals: 18
            },
            rpcUrls: ['https://sepolia.infura.io/v3/'],
            blockExplorerUrls: ['https://sepolia.etherscan.io/']
          }]
        });
        return true;
      } catch (addError) {
        console.error('Error adding network:', addError);
        return false;
      }
    }
    console.error('Error switching network:', switchError);
    return false;
  }
}

export async function connectWallet(): Promise<string | null> {
  if (!window.ethereum) return null;
  
  // Check network first
  const networkCheck = await checkNetwork();
  if (!networkCheck.correct) {
    const switched = await switchToCorrectNetwork();
    if (!switched) {
      throw new Error(`Please switch to ${EXPECTED_CHAIN_NAME} in MetaMask`);
    }
  }
  
  const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
  return accounts && accounts[0] ? accounts[0] : null;
}

export async function getSigner() {
  if (!window.ethereum) return null;
  const provider = new ethers.BrowserProvider(window.ethereum);
  return await provider.getSigner();
}

function normalizeToBytes32(hex: string) {
  // Expecting fileHash like 0x... (64 hex chars). If prefixed '0x', keep; otherwise hash.
  if (!hex) throw new Error('empty hash');
  if (hex.startsWith('0x') && hex.length === 66) return hex;
  // if hex without 0x
  if (/^[0-9a-fA-F]{64}$/.test(hex)) return '0x' + hex;
  // otherwise keccak256
  return ethers.hexlify(ethers.keccak256(ethers.toUtf8Bytes(hex)));
}

export async function storeHashOnChain(fileHash: string, contractAddress?: string, contractAbi?: any): Promise<string> {
  const signer = await getSigner();
  if (!signer) throw new Error('No wallet connected');
  const addr = contractAddress || contractConfig.CONTRACT_ADDRESS;
  const abi = contractAbi || contractConfig.CONTRACT_ABI;
  if (!addr || !abi) throw new Error('Contract config missing');
  const contract = new ethers.Contract(addr, abi, signer);
  const bytes32 = normalizeToBytes32(fileHash);
  const tx = await contract.storeHash(bytes32);
  const receipt = await tx.wait();
  return receipt?.hash || tx.hash;
}

export async function isHashStoredOnChain(fileHash: string, contractAddress?: string, contractAbi?: any): Promise<boolean> {
  const addr = contractAddress || contractConfig.CONTRACT_ADDRESS;
  const abi = contractAbi || contractConfig.CONTRACT_ABI;
  if (!addr || !abi) return false;
  const provider = getProvider();
  if (!provider) return false;
  const contract = new ethers.Contract(addr, abi, provider as any);
  const bytes32 = normalizeToBytes32(fileHash);
  try {
    // expected contract to have `isHashStored(bytes32) returns (bool)`
    const res = await (contract as any).isHashStored(bytes32);
    return !!res;
  } catch (e) {
    // fallback: try public mapping getter `stored(bytes32)`
    try {
      const r2 = await (contract as any).stored(bytes32);
      return !!r2;
    } catch (err) {
      return false;
    }
  }
}

export default {
  getProvider,
  connectWallet,
  getSigner,
  storeHashOnChain,
  isHashStoredOnChain,
  checkNetwork,
  switchToCorrectNetwork,
};
