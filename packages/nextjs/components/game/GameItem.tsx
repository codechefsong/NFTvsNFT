import { Address } from "~~/components/scaffold-eth";
import { useScaffoldContractWrite } from "~~/hooks/scaffold-eth";

export const GameItem = ({ data }: any) => {
  const { writeAsync: joinMatch } = useScaffoldContractWrite({
    contractName: "NFTvsNFT",
    functionName: "joinMatch",
    args: [data.id],
    onBlockConfirmation: txnReceipt => {
      console.log("📦 Transaction blockHash", txnReceipt.blockHash);
      console.log(txnReceipt);
    },
  });

  return (
    <tr key={data.id.toString()} className="text-sm">
      <td className="w-1/12 md:py-4">{data.id.toString()}</td>
      <td className="w-3/12 md:py-4">
        <Address address={data.player1} />
      </td>
      <td className="w-3/12 md:py-4">
        <Address address={data.player2} />
      </td>
      <td className="w-2/12 md:py-4">
        <p>{data.isMatch ? "Yes" : "No"}</p>
      </td>
      <td className="w-2/12 md:py-4">
        <button
          className="py-2 px-16 bg-green-500 rounded baseline hover:bg-green-300 disabled:opacity-50"
          onClick={() => joinMatch()}
        >
          Join
        </button>
      </td>
    </tr>
  );
};
