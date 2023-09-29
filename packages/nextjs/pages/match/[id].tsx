import Image from "next/image";
import { useRouter } from "next/router";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { AttackItem } from "~~/components/game/AttackItem";
import { Address } from "~~/components/scaffold-eth";
import { useScaffoldContractRead } from "~~/hooks/scaffold-eth";

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

  const { data: url } = useScaffoldContractRead({
    contractName: "NFTvsNFT",
    functionName: "tbaImageList",
    args: [matchData?.nft1],
  });

  const { data: url2 } = useScaffoldContractRead({
    contractName: "NFTvsNFT",
    functionName: "tbaImageList",
    args: [matchData?.nft2],
  });

  const { data: moveData } = useScaffoldContractRead({
    contractName: "MoveNFT",
    functionName: "getMyMoves",
    args: [tbaAddress],
  });

  return (
    <div className="flex items-center flex-col flex-grow pt-7">
      <div className="px-5">
        <h1 className="text-center mb-5">
          <span className="block text-2xl mb-2">Match #{matchData?.id.toString()}</span>
        </h1>

        {address === matchData?.player1 ? (
          <div className="grid sm:grid-cols-2 gap-36 flex-grow mt-10 mb-6 px-20">
            <div>
              <Address address={matchData?.player1} />
              <Address address={matchData?.nft1} />
              <h2>HP {matchData?.hp1.toString()}</h2>
              <Image className="" src={url || ""} width={100} height={100} alt="Player" />
            </div>
            <div>
              <Address address={matchData?.player2} />
              <Address address={matchData?.nft2} />
              <h2>HP {matchData?.hp2.toString()}</h2>
              <Image className="" src={url2 || ""} width={100} height={100} alt="Player" />
            </div>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-36 flex-grow mt-10 mb-6 px-20">
            <div>
              <Address address={matchData?.player2} />
              <Address address={matchData?.nft2} />
              <h2>HP {matchData?.hp2.toString()}</h2>
              <Image className="" src={url2 || ""} width={100} height={100} alt="Player" />
            </div>
            <div>
              <Address address={matchData?.player1} />
              <Address address={matchData?.nft1} />
              <h2>HP {matchData?.hp1.toString()}</h2>
              <Image className="" src={url || ""} width={100} height={100} alt="Player" />
            </div>
          </div>
        )}

        <div className="flex">
          {moveData?.map((m, index) => (
            <AttackItem data={m} key={index} matchId={id} />
          ))}
        </div>
        <button
          className="py-2 px-16 mb-1 mt-3 bg-gray-300 rounded baseline hover:bg-gray-200 disabled:opacity-50"
          onClick={() => router.push("/example-ui")}
        >
          Back
        </button>
      </div>
    </div>
  );
};

export default MatchRoom;
