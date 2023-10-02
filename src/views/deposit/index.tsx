import { FC, useCallback } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { notify } from "utils/notifications";

export const DepositView: FC = ({}) => {
  const { publicKey } = useWallet();

  const onClick = useCallback(async () => {
    try {
      // `publicKey` will be null if the wallet isn't connected
      if (!publicKey) throw new Error("Wallet not connected!");
    } catch (error: any) {
      notify({
        type: "error",
        message: `Transaction failed!`,
        description: error?.message,
      });
      console.log("error", `Transaction failed! ${error?.message}`);
    }
  }, [publicKey, notify]);

  return (
    <div className="md:hero mx-auto p-4">
      <div className="md:hero-content flex flex-col">
        <h1 className="text-center text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-indigo-500 to-fuchsia-500 mt-10 mb-8">
          Deposit
        </h1>
        {/* CONTENT GOES HERE */}
        <div className="text-center">
          <form className="w-full max-w-sm">
            <div className="flex items-center border-teal-500 py-2">
              <label className="w-full block uppercase tracking-wide text-white text-xs font-bold mr-2">
                Prediction Price
              </label>
              <input
                className="appearance-none bg-transparent border-none w-full text-fuchsia-500 mr-3 py-1 px-2 leading-tight focus:outline-none"
                type="text"
                placeholder="0 BTC/ USDT"
                aria-label="Prediction Price"
              ></input>
            </div>
            <div className="flex items-center border-teal-500 py-2">
              <label className="w-full block uppercase tracking-wide text-white text-xs font-bold mr-2">
                Amount to Stake
              </label>
              <input
                className="appearance-none bg-transparent border-none w-full text-fuchsia-500 mr-3 py-1 px-2 leading-tight focus:outline-none"
                type="text"
                placeholder="0 SOL"
                aria-label="Amount to Stake"
              ></input>
            </div>
            <button
              className="group w-60 m-2 btn animate-pulse bg-gradient-to-br from-indigo-500 to-fuchsia-500 hover:from-white hover:to-purple-300 text-black"
              onClick={onClick}
              disabled={!publicKey}
            >
              <div className="hidden group-disabled:block">
                Wallet not connected
              </div>
              <span className="block group-disabled:hidden">
                Send Transaction
              </span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
