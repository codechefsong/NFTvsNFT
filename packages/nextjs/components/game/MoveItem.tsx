import Image from "next/image";
import { useScaffoldContractWrite } from "~~/hooks/scaffold-eth";

export const MoveItem = ({ data, tbaAddress, readOnly }: any) => {
  const { writeAsync: buyMove } = useScaffoldContractWrite({
    contractName: "MoveNFT",
    functionName: "mint",
    args: [tbaAddress, "url", data.name, data.power, data.cooldown, data.url],
    onBlockConfirmation: txnReceipt => {
      console.log("📦 Transaction blockHash", txnReceipt.blockHash);
      console.log(txnReceipt);
    },
  });
  return (
    <div
      className="border border-gray-30 flex flex-col items-center font-bold bg-white mr-2 mb-2"
      style={{ width: "200px", height: "220px" }}
    >
      <Image className="my-1" src={data.url} width={70} height={70} alt="Item" />
      <p className="text-lg my-0">{data.name}</p>
      <p className="my-0 font-light">Power: {data.power.toString()}</p>
      <p className="mt-0 font-light">Cooldown: {data.cooldown.toString()} Sec</p>
      {!readOnly && (
        <button
          className="py-2 px-16 bg-green-500 rounded baseline hover:bg-green-300 disabled:opacity-50"
          onClick={() => buyMove()}
          disabled={tbaAddress === "0x0000000000000000000000000000000000000000"}
        >
          Buy
        </button>
      )}
    </div>
  );
};
