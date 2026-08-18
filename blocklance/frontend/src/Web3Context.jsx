import { createContext, useContext, useState } from "react";
import { BrowserProvider, Contract } from "ethers";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "./contractConfig";

const Web3Context = createContext(null);

export function Web3Provider({ children }) {
  const [account, setAccount] = useState(null);
  const [contract, setContract] = useState(null);
  const [provider, setProvider] = useState(null);
  const [balance, setBalance] = useState(null);

  async function connectWallet() {
    if (!window.ethereum) {
      alert("MetaMask is not installed");
      return;
    }

    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });

    const browserProvider = new BrowserProvider(window.ethereum);
    const signer = await browserProvider.getSigner();

    const blockLanceContract = new Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

    setAccount(accounts[0]);
    setContract(blockLanceContract);
    setProvider(browserProvider);

    const bal = await browserProvider.getBalance(accounts[0]);
    setBalance(bal);
  }

  async function refreshBalance() {
    if (!provider || !account) return;
    const bal = await provider.getBalance(account);
    setBalance(bal);
  }

  return (
    <Web3Context.Provider value={{ account, contract, connectWallet, balance, refreshBalance }}>
      {children}
    </Web3Context.Provider>
  );
}

export function useWeb3() {
  return useContext(Web3Context);
}