import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { MetaHeader } from "~~/components/MetaHeader";
import { GameItem } from "~~/components/game/GameItem";
import { useScaffoldContractRead, useScaffoldContractWrite } from "~~/hooks/scaffold-eth";

const ExampleUI: NextPage = () => {
  const { address } = useAccount();

  const { data: tbaAddress } = useScaffoldContractRead({
    contractName: "NFTvsNFT",
    functionName: "tbaList",
    args: [address],
  });

  const { data: getMatches } = useScaffoldContractRead({
    contractName: "NFTvsNFT",
    functionName: "getMatches",
  });

  const { writeAsync: createMatch } = useScaffoldContractWrite({
    contractName: "NFTvsNFT",
    functionName: "createMatch",
    onBlockConfirmation: txnReceipt => {
      console.log("📦 Transaction blockHash", txnReceipt.blockHash);
      console.log(txnReceipt);
    },
  });

  return (
    <>
      <MetaHeader
        title="Example UI | Scaffold-ETH 2"
        description="Example UI created with 🏗 Scaffold-ETH 2, showcasing some of its features."
      >
        {/* We are importing the font this way to lighten the size of SE2. */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="https://fonts.googleapis.com/css2?family=Bai+Jamjuree&display=swap" rel="stylesheet" />
      </MetaHeader>
      <div className="flex flex-col items-center">
        <h2 className="text-2xl mt-10 mb-0">Your Token Bound Account</h2>
        <p className="mt-0">{tbaAddress}</p>
        <button
          className="py-2 px-16 mb-10 bg-green-500 rounded baseline hover:bg-green-300 disabled:opacity-50"
          onClick={() => createMatch()}
        >
          Create Match
        </button>

        <div className="flex justify-center px-4 md:px-0">
          <div className="overflow-x-auto w-full shadow-2xl rounded-xl">
            <table className="table text-xl bg-base-100 table-zebra w-full md:table-md table-sm">
              <thead>
                <tr className="rounded-xl text-sm text-base-content">
                  <th className="bg-primary">Match ID</th>
                  <th className="bg-primary">Player 1</th>
                  <th className="bg-primary">Player 2</th>
                  <th className="bg-primary">Is Match?</th>
                  <th className="bg-primary">Action</th>
                </tr>
              </thead>
              <tbody>
                {getMatches?.map((m, index) => (
                  <GameItem data={m} key={index} />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default ExampleUI;
