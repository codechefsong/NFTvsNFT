import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { MetaHeader } from "~~/components/MetaHeader";
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

        {getMatches?.map((m, index) => (
          <div key={index}>
            <p>{m.id.toString()}</p>
            <p>{m.player1}</p>
            <p>{m.player2}</p>
          </div>
        ))}
      </div>
    </>
  );
};

export default ExampleUI;
