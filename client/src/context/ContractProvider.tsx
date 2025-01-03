import { ethers } from "ethers";
import React, { createContext, useState, useEffect, useContext } from "react";
import ABI from "./abis/ABI.json";
import { ContractAddress } from "./helpers/ContractAddress";

// Define contract context
interface ContractContextInterface {
  contract: ethers.Contract | null;
  getBalance: string | null;
  getPlayers: string[];
  getLotteryId: number | null;
  getWinners: string[];
  loading: boolean;
  enterLottery: () => void;
  pickWinner: () => void;
}

const ContractContext = createContext<ContractContextInterface | undefined>(
  undefined
);

interface ContractProviderProps {
  children: React.ReactNode;
}

const ContractProvider: React.FC<ContractProviderProps> = ({ children }) => {
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [signer, setSigner] = useState<ethers.Signer | null>(null); // State to hold the signer
  const [getBalance, setGetBalance] = useState<string | null>(null);
  const [getLotteryId, setGetLotteryId] = useState<number | null>(null);
  const [getWinners, setGetWinners] = useState<string[]>([]);
  const [getPlayers, setGetPlayers] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // Initialize contract and fetch data only after provider is available
  const InitContract = async () => {
    if (!window.ethereum) {
      console.error("Ethereum object not found. Please install MetaMask.");
      return;
    }

    const _provider = new ethers.BrowserProvider(window.ethereum);
    setProvider(_provider);

    // Get the signer from the provider (this is required to send transactions)
    const _signer = await _provider.getSigner();
    setSigner(_signer);

    console.log("Provider initialized:", _provider);

    const _contract = new ethers.Contract(
      ContractAddress, // Replace with your contract address
      ABI.abi,
      _signer // Use signer to interact with the contract and send transactions
    );
    setContract(_contract);

    console.log("Contract initialized:", _contract);

    fetchContractData(_contract);
  };

  const fetchContractData = async (_contract: ethers.Contract) => {
    try {
      console.log("Fetching data from contract...");

      const _balance = await _contract.getBalance();
      const formattedBalance = ethers.formatEther(_balance);
      setGetBalance(formattedBalance);

      const _lotteryId = await _contract.getLotteryId();
      setGetLotteryId(Number(_lotteryId));

      const _getWinners = await _contract.getWinners();
      setGetWinners(_getWinners);

      const _players = await _contract.getPlayers();
      setGetPlayers(_players);
    } catch (error) {
      console.error("Error fetching data from contract:", error);
    } finally {
      setLoading(false);
      console.log("Loading finished.");
    }
  };

  // Function to enter the lottery
  const enterLottery = async () => {
    if (!contract || !signer) {
      console.error("Contract or signer is not available.");
      return;
    }

    try {
      const tx = await contract.enter({
        value: ethers.parseEther("1"), // Sending 1 ether to the contract
      });

      // Wait for the transaction to be mined
      await tx.wait();

      console.log("Transaction successful:", tx);
      fetchContractData(contract); // Refresh contract data after entering lottery
    } catch (error) {
      console.error("Error entering the lottery:", error);
    }
  };
  const pickWinner = async () => {
    if (!contract || !signer) {
      console.error("Contract or signer is not available.");
      return;
    }

    try {
      const tx = await contract.pickWinner();
      tx.wait();
      // Wait for the transaction to be mined
      fetchContractData(contract); // Refresh contract data after entering lottery
    } catch (error) {
      console.error("Error entering the lottery:", error);
    }
  };
  useEffect(() => {
    InitContract();
  }, []);

  return (
    <ContractContext.Provider
      value={{
        contract,
        getBalance,
        getPlayers,
        getLotteryId,
        getWinners,
        loading,
        enterLottery,
        pickWinner
      }}
    >
      {children}
    </ContractContext.Provider>
  );
};

const useContractContext = (): ContractContextInterface => {
  const context = useContext(ContractContext);
  if (!context) {
    throw new Error(
      "useContractContext must be used within a ContractProvider"
    );
  }
  return context;
};

export { ContractProvider, useContractContext };
