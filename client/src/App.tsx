import React from "react";
import { useWeb3Context } from "./context/web3Context";
import { useContractContext } from "./context/ContractProvider";
import { GrTrophy } from "react-icons/gr";
import { FaEthereum, FaPerson } from "react-icons/fa6";

const Web3Button: React.FC = () => {
  const { account, isConnected, connect, disconnect } = useWeb3Context();
  const {
    getBalance,
    getPlayers,
    enterLottery,
    getWinners,
    getLotteryId,
    pickWinner,
  } = useContractContext();

  React.useEffect(() => {
    connect();
  }, [account]);

  return (
    <div className="relative flex justify-center items-center min-h-screen bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700 p-6 overflow-hidden">
      {/* Animated Background with Multiple Balls */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="ball-container">
          {/* Generate multiple balls */}
          {Array.from({ length: 10 }).map((_, index) => (
            <div
              key={index}
              className={`ball ball-${
                index % 2 === 0 ? "blue" : "pink"
              } ball-${index}`}
            />
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-lg w-full bg-white/60 backdrop-blur-xl rounded-lg shadow-xl transform transition duration-300 hover:scale-105 p-6 sm:p-8 md:p-10">
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-800 mb-6 text-center tracking-tight">
          Web3 Lottery
        </h1>

        {getLotteryId !== null && (
          <p className="text-3xl sm:text-4xl font-bold text-slate-800 mb-6 text-center tracking-tight">
            Lottery : #{getLotteryId}
          </p>
        )}

        <div className="mb-8">
          {isConnected ? (
            <div className="flex flex-col items-center space-y-4">
              <p className="text-xl text-slate-700">
                Connected: <span className="text-blue-600">{account}</span>
              </p>
              <button
                onClick={disconnect}
                className="bg-red-600 hover:bg-red-700 text-white py-2 px-6 rounded-full shadow-md transition duration-300 transform hover:scale-105"
              >
                Disconnect
              </button>
            </div>
          ) : (
            <button
              onClick={connect}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-full shadow-md transition duration-300 transform hover:scale-105"
            >
              Connect Wallet
            </button>
          )}
        </div>

        <div className="mb-6 items-center space-x-2">
          {getBalance && (
            <div className="text-lg flex items-center text-slate-600">
              Lottery Balance: {getBalance}
              <FaEthereum className="text-xl ml-3" />
            </div>
          )}
        </div>

        <div className="mb-6 space-y-4">
          <h2 className="text-2xl font-medium text-slate-700">Players</h2>
          {getPlayers.length === 0 ? (
            <p className="text-slate-600">No players in this lottery</p>
          ) : (
            <div className="space-y-2">
              {getPlayers.map((player, index) => (
                <p
                  key={index}
                  className="text-slate-600 items-center flex hover:text-blue-600 cursor-pointer transition duration-300"
                >
                  <FaPerson className="mr-2" />
                  {player}
                </p>
              ))}
            </div>
          )}
        </div>

        <div className="mb-6 space-y-4">
          <h2 className="text-2xl font-medium text-slate-700">Winners</h2>
          {getWinners.length === 0 ? (
            <p className="text-slate-600">No winners in this lottery</p>
          ) : (
            <div className="space-y-2">
              {getWinners.map((winner, index) => (
                <p
                  key={index}
                  className="text-slate-600 flex items-center hover:text-blue-600 cursor-pointer transition duration-300"
                >
                  <GrTrophy className="mr-2" />
                  {winner}
                </p>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-6">
          <button
            onClick={enterLottery}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-6 rounded-full shadow-md transition duration-300 transform hover:scale-105"
          >
            Enter Lottery
          </button>

          <button
            onClick={pickWinner}
            className="w-full bg-yellow-600 hover:bg-yellow-700 text-white py-2 px-6 rounded-full shadow-md transition duration-300 transform hover:scale-105"
          >
            Pick Winner
          </button>
        </div>
      </div>
    </div>
  );
};

export default Web3Button;
