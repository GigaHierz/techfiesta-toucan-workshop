import ToucanClient from "toucan-sdk";
import { useEthersProvider, useEthersSigner } from "../utils/ethers";
import { parseEther } from "ethers/lib/utils";
import { useState } from "react";

export default function Home() {
  const provider = useEthersProvider();
  const signer = useEthersSigner();

  const toucan = new ToucanClient("alfajores", provider);
  signer && toucan.setSigner(signer);

  const [tco2address, setTCO2address] = useState("");

  const redeemPoolToken = async (): Promise<void> => {
    const redeemedTokenAddress = await toucan.redeemAuto2(
      "NCT",
      parseEther("1")
    );
    redeemedTokenAddress && setTCO2address(redeemedTokenAddress[0].address);
  };

  const retire = async (): Promise<void> => {
    await toucan.retire(parseEther("1.0"), tco2address);
  };

  return (
    <div>
      <button
        className="inline-flex w-full justify-center rounded-full border px-5 my-5 py-2 text-md font-medium border-wood bg-prosperity text-black hover:bg-snow"
        onClick={() => redeemPoolToken()}
      >
        {"Redeem Tokens"}
      </button>
      <button
        className="inline-flex w-full justify-center rounded-full border px-5 my-5 py-2 text-md font-medium border-wood bg-prosperity text-black hover:bg-snow"
        onClick={() => retire()}
      >
        {"Retire Tokens"}
      </button>
    </div>
  );
}
