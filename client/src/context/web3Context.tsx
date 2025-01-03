import React, { createContext, useContext, useState } from "react";

interface Web3ContextInterface {
  account: string | null;
  isConnected: boolean;
  connect: () => void;
  disconnect: () => void;
}

const Web3Context = createContext<Web3ContextInterface | undefined>(undefined);

interface Web3ContextProps {
  children: React.ReactNode;
}

const Web3ContextProvider: React.FC<Web3ContextProps> = ({ children }) => {
  const [account, setAccount] = useState<string | null>(null);
  const [isConnected,setisConnected] = useState<boolean>(false);

  const connect = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        setAccount(accounts[0]);
        setisConnected(true);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const disconnect = () => {
    setAccount(null);
    setisConnected(false);
  };

  // Provide the context value
  return (
    <Web3Context.Provider value={{ account, isConnected, connect, disconnect }}>
      {children}
    </Web3Context.Provider>
  );
};

// Custom hook to use the Web3Context
const useWeb3Context = (): Web3ContextInterface => {
  const context = useContext(Web3Context);
  if (!context) {
    throw new Error("useWeb3Context must be used within a Web3ContextProvider");
  }
  return context;
};

export { Web3ContextProvider, useWeb3Context };
