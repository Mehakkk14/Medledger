import { ethers } from 'ethers';

/**
 * Submit a file hash to the blockchain. Two modes supported:
 * - If CONTRACT_ADDRESS and CONTRACT_ABI (as JSON) are provided via env, calls contract.storeHash(fileHash)
 * - Otherwise it sends a zero-value transaction with the fileHash embedded in data (not ideal for production)
 *
 * Environment variables required for basic mode:
 * - RPC_URL
 * - PRIVATE_KEY
 * Optional for contract mode:
 * - CONTRACT_ADDRESS
 * - CONTRACT_ABI (stringified JSON)
 */
export async function submitFileHashToChain(fileHash: string): Promise<string> {
  const rpc = process.env.RPC_URL;
  const pk = process.env.PRIVATE_KEY;
  if (!rpc || !pk) throw new Error('RPC_URL and PRIVATE_KEY must be set in env to submit to chain');

  const provider = new ethers.JsonRpcProvider(rpc);
  const wallet = new ethers.Wallet(pk, provider);

  const contractAddress = process.env.CONTRACT_ADDRESS;
  const contractAbi = process.env.CONTRACT_ABI;

  if (contractAddress && contractAbi) {
    let abi: any = [];
    try { abi = JSON.parse(contractAbi); } catch (e) { throw new Error('Invalid CONTRACT_ABI JSON'); }
    const contract = new ethers.Contract(contractAddress, abi, wallet);
    // expecting a function like storeHash(bytes32 or string)
    const tx = await contract.storeHash(fileHash);
    const receipt = await tx.wait();
    // transactionHash may not be present on some provider types; fall back to tx.hash
    return (receipt as any)?.transactionHash || (tx as any).hash;
  }

  // Fallback: send transaction with data payload containing fileHash as utf8 bytes
  const data = ethers.hexlify(ethers.toUtf8Bytes(fileHash));
  const tx = await wallet.sendTransaction({ to: wallet.address, value: 0, data });
  const receipt = await tx.wait();
  return (receipt as any)?.transactionHash || (tx as any).hash;
}

export default submitFileHashToChain;
