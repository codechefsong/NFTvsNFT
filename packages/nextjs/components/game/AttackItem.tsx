import { useScaffoldContractWrite } from "~~/hooks/scaffold-eth";

export const AttackItem = ({ data, matchId }: any) => {
  const { writeAsync: attack } = useScaffoldContractWrite({
    contractName: "NFTvsNFT",
    functionName: "attack",
    args: [matchId as any, data.power as any],
    onBlockConfirmation: txnReceipt => {
      console.log("📦 Transaction blockHash", txnReceipt.blockHash);
      console.log(txnReceipt);
    },
  });

  return (
    <div
      className="border border-gray-30 flex flex-col items-center font-bold bg-white mr-2 mb-2"
      style={{ width: "200px", height: "200px" }}
    >
      <p>{data.name}</p>
      <p>Power: {data.power.toString()}</p>
      <button
        className="py-2 px-16 bg-green-500 rounded baseline hover:bg-green-300 disabled:opacity-50"
        onClick={() => attack()}
      >
        Attack
      </button>
    </div>
  );
};
