import { useRouter } from "next/router";
import type { NextPage } from "next";
import { Address } from "~~/components/scaffold-eth";
import { useScaffoldContractRead } from "~~/hooks/scaffold-eth";

const MatchRoom: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const { data: matchData } = useScaffoldContractRead({
    contractName: "NFTvsNFT",
    functionName: "getMatchById",
    args: [id as any],
  });

  const handleYes = async () => {
    router.push("/game");
  };

  return (
    <div className="flex items-center flex-col flex-grow pt-7">
      <div className="px-5">
        <h1 className="text-center mb-5">
          <span className="block text-2xl mb-2">Match #{matchData?.id.toString()}</span>
        </h1>

        <div className="grid lg:grid-cols-2 gap-8 flex-grow mt-10 px-20">
          <div>
            <Address address={matchData?.player1} />
            <h2>HP {matchData?.hp1.toString()}</h2>
          </div>
          <div>
            <Address address={matchData?.player2} />
            <h2>HP {matchData?.hp2.toString()}</h2>
          </div>
        </div>

        <button
          className="py-2 px-16 mb-1 mt-3 mr-3 bg-green-500 rounded baseline hover:bg-green-300 disabled:opacity-50"
          onClick={handleYes}
        >
          Attack
        </button>
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
