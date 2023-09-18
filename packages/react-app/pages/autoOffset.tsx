import { useEthersProvider, useEthersSigner } from "@/utils/ethers";
import { parseEther } from "ethers/lib/utils.js";
import ToucanClient from "toucan-sdk";
import { useContractWrite, usePrepareContractWrite } from "wagmi";

export default function AutoOffset() {
  const poolAddress = "0x02De4766C272abc10Bc88c220D214A26960a7e92";
  const amount = parseEther("1");
  const provider = useEthersProvider();
  const signer = useEthersSigner();

  const toucan = new ToucanClient("alfajores", provider, signer);

  const poolToken = toucan.getPoolContract("NCT");
  const offsetHelperAddress = "0x065C0f397ecb9D904aB65242F41B9484AA9cD9Bf";

  const approve = async () => {
    return await poolToken.approve(offsetHelperAddress, amount);
  };

  const { config } = usePrepareContractWrite({
    address: offsetHelperAddress,
    abi: [
      {
        inputs: [
          {
            internalType: "address",
            name: "_poolToken",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "_amountToOffset",
            type: "uint256",
          },
        ],
        outputs: [
          {
            internalType: "address[]",
            name: "tco2s",
            type: "address[]",
          },
          {
            internalType: "uint256[]",
            name: "amounts",
            type: "uint256[]",
          },
        ],
        name: "autoOffsetPoolToken",
        stateMutability: "nonpayable",
        type: "function",
      },
    ],
    functionName: "autoOffsetPoolToken",
    args: [poolAddress, amount],
    gas: BigInt(2500000),
    value: BigInt(0),
  });

  const { data, isLoading, isSuccess, write } = useContractWrite(config);

  const offset = async () => {
    const tx = await approve();
    await tx.wait();

    write?.();
  };

  return (
    <div>
      <button
        className="inline-flex w-full justify-center rounded-full border px-5 my-5 py-2 text-md font-medium border-wood bg-prosperity text-black hover:bg-snow"
        onClick={() => offset?.()}
      >
        offset
      </button>
      {isLoading && <div>Check Wallet</div>}
      {isSuccess && (
        <div>
          <a
            href={`https://celoscan.io/tx/${JSON.stringify(data.hash)}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            {" "}
            Transaction: {JSON.stringify(data?.hash)}
          </a>{" "}
        </div>
      )}{" "}
    </div>
  );
}
