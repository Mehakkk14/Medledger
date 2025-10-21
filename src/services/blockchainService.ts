import { ethers } from 'ethers';
import contractConfig from '@/config/contract';

declare global {
  interface Window {
    ethereum?: any;
  }
}

const getProvider = () => {
  if (window.ethereum) return new ethers.BrowserProvider(window.ethereum);
  return null;
};

export async function connectWallet(): Promise<string | null> {
  if (!window.ethereum) return null;
  const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
  return accounts && accounts[0] ? accounts[0] : null;
}

export function getSigner() {
  if (!window.ethereum) return null;
  const provider = new ethers.BrowserProvider(window.ethereum);
  return provider.getSigner();
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
  const signer = getSigner();
  if (!signer) throw new Error('No wallet connected');
  const addr = contractAddress || contractConfig.CONTRACT_ADDRESS;
  const abi = contractAbi || contractConfig.CONTRACT_ABI;
  if (!addr || !abi) throw new Error('Contract config missing');
  const contract = new ethers.Contract(addr, abi, signer as any);
  const bytes32 = normalizeToBytes32(fileHash);
  const tx = await contract.storeHash(bytes32);
  const receipt = await tx.wait();
  return (receipt as any)?.transactionHash || (tx as any).hash;
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
};
