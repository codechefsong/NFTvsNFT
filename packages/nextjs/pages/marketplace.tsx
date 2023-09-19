import { useState } from "react";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { MetaHeader } from "~~/components/MetaHeader";
import { MoveItem } from "~~/components/game/MoveItem";
import deployedContracts from "~~/generated/deployedContracts";
import { useScaffoldContractRead, useScaffoldContractWrite } from "~~/hooks/scaffold-eth";

const CHAIN_ID = 31337;

const MOVE_LIST = [
  {
    id: "0",
    name: "Pie",
    power: 5,
  },
];

const Marketplace: NextPage = () => {
  const { address } = useAccount();

  const [selectedNFT, setSelectNFT] = useState(-1);

  const { data: tbaAddress } = useScaffoldContractRead({
    contractName: "NFTvsNFT",
    functionName: "tbaList",
    args: [address],
  });

  const { data: nfts } = useScaffoldContractRead({
    contractName: "PlayerNFT",
    functionName: "getMyNFTs",
    args: [address],
  });

  const { data: moves } = useScaffoldContractRead({
    contractName: "MoveNFT",
    functionName: "getMyMoves",
    args: [tbaAddress],
  });

  const { writeAsync: mintNFT } = useScaffoldContractWrite({
    contractName: "PlayerNFT",
    functionName: "mint",
    args: [address, "URL"],
    onBlockConfirmation: txnReceipt => {
      console.log("📦 Transaction blockHash", txnReceipt.blockHash);
    },
  });

  const { writeAsync: createAccount } = useScaffoldContractWrite({
    contractName: "NFTvsNFT",
    functionName: "createTokenBoundAccount",
    args: [
      deployedContracts[CHAIN_ID][0].contracts.ERC6551Account.address,
      BigInt("1"),
      deployedContracts[CHAIN_ID][0].contracts.PlayerNFT.address,
      BigInt(selectedNFT),
      BigInt("1"),
      "0x",
    ],
    onBlockConfirmation: txnReceipt => {
      console.log("📦 Transaction blockHash", txnReceipt.blockHash);
      console.log(txnReceipt);
    },
  });

  return (
    <>
      <MetaHeader
        title="Marketplace"
        description="Marketplace created with 🏗 Scaffold-ETH 2, showcasing some of its features."
      >
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="https://fonts.googleapis.com/css2?family=Bai+Jamjuree&display=swap" rel="stylesheet" />
      </MetaHeader>

      <div className="flex flex-col items-center">
        <h2 className="text-2xl mt-10 mb-0">Your Token Bound Account</h2>
        <p className="mt-0">{tbaAddress}</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8 flex-grow mt-10 px-20">
        <div className="px-5">
          <h1 className="text-center mb-5">
            <span className="block text-3xl mb-2">Select your NFTs</span>
          </h1>

          <div className="flex">
            {nfts?.map((n, index) => (
              <div
                key={index}
                className="w-20 h-20 border border-gray-30 flex items-center justify-center font-bold mr-2 mb-2 cursor-pointer"
                style={{ background: selectedNFT === index ? "#00cc99" : "white" }}
                onClick={() => setSelectNFT(index)}
              >
                <p>{n.toString()}</p>
              </div>
            ))}
          </div>

          <button
            className="py-2 px-16 mb-10 mt-3 bg-green-500 rounded baseline hover:bg-green-300 disabled:opacity-50"
            onClick={() => createAccount()}
            disabled={nfts?.length === 0 || selectedNFT === -1}
          >
            Create Token Bound Account
          </button>
          <h1 className="text-center mb-5">
            <span className="block text-2xl mb-2">Buy a NFT</span>
          </h1>

          <p>Player</p>

          <button
            className="py-2 px-16 mb-1 mt-6 bg-green-500 rounded baseline hover:bg-green-300 disabled:opacity-50"
            onClick={() => mintNFT()}
          >
            Buy
          </button>
        </div>

        <div>
          <h1 className="text-center mb-5">
            <span className="block text-3xl mb-2">Moves</span>
          </h1>

          <div className="flex">
            {moves?.map((m, index) => (
              <MoveItem data={m} key={index} tbaAddress={tbaAddress} />
            ))}
          </div>

          <h1 className="text-center mb-5">
            <span className="block text-3xl mb-2">Buy Moves</span>
          </h1>

          <div className="flex">
            {MOVE_LIST?.map((m, index) => (
              <MoveItem data={m} key={index} tbaAddress={tbaAddress} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Marketplace;
