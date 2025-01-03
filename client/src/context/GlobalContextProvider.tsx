import React from "react";
import { Web3ContextProvider } from "./web3Context";
import { ContractProvider } from "./ContractProvider";

interface GlobalProvidersProps {
  children: React.ReactNode;
}

const GlobalContextProvider: React.FC<GlobalProvidersProps> = ({
  children,
}) => {
  return (
    <Web3ContextProvider>
      <ContractProvider>{children}</ContractProvider>
    </Web3ContextProvider>
  );
};

export default GlobalContextProvider;
