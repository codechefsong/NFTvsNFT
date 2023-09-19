import { useRouter } from "next/router";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { MoveItem } from "~~/components/game/MoveItem";
import { Address } from "~~/components/scaffold-eth";
import { useScaffoldContractRead, useScaffoldContractWrite } from "~~/hooks/scaffold-eth";

const MatchRoom: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const { address } = useAccount();

  const { data: matchData } = useScaffoldContractRead({
    contractName: "NFTvsNFT",
    functionName: "getMatchById",
    args: [id as any],
  });

  const { data: tbaAddress } = useScaffoldContractRead({
    contractName: "NFTvsNFT",
    functionName: "tbaList",
    args: [address],
  });

  const { data: moveData } = useScaffoldContractRead({
    contractName: "MoveNFT",
    functionName: "getMyMoves",
    args: [tbaAddress],
  });

  const { writeAsync: attack } = useScaffoldContractWrite({
    contractName: "NFTvsNFT",
    functionName: "attack",
    args: [id as any, "10" as any],
    onBlockConfirmation: txnReceipt => {
      console.log("📦 Transaction blockHash", txnReceipt.blockHash);
      console.log(txnReceipt);
    },
  });

  return (
    <div className="flex items-center flex-col flex-grow pt-7">
      <div className="px-5">
        <h1 className="text-center mb-5">
          <span className="block text-2xl mb-2">Match #{matchData?.id.toString()}</span>
        </h1>

        <div className="grid lg:grid-cols-2 gap-8 flex-grow mt-10 px-20">
          <div>
            <Address address={matchData?.player1} />
            <Address address={matchData?.nft1} />
            <h2>HP {matchData?.hp1.toString()}</h2>
          </div>
          <div>
            <Address address={matchData?.player2} />
            <Address address={matchData?.nft2} />
            <h2>HP {matchData?.hp2.toString()}</h2>
          </div>
        </div>

        <button
          className="py-2 px-16 mb-1 mt-3 mr-3 bg-green-500 rounded baseline hover:bg-green-300 disabled:opacity-50"
          onClick={() => attack()}
        >
          Attack
        </button>

        <div className="flex">
          {moveData?.map((m, index) => (
            <MoveItem data={m} key={index} tbaAddress={tbaAddress} />
          ))}
        </div>
        <button
          className="py-2 px-16 mb-1 mt-3 bg-gray-300 rounded baseline hover:bg-gray-200 disabled:opacity-50"
          onClick={() => router.push("/board")}
        >
          Back
        </button>
      </div>
    </div>
  );
};

export default MatchRoom;
