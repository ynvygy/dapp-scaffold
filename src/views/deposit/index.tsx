import { FC, useCallback, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { notify } from "utils/notifications";
import WalletConnect from "./walletConnect";

import {
  SystemProgram,
  Connection,
  PublicKey,
  Transaction,
} from "@solana/web3.js";

export const DepositView: FC = ({}) => {
  const { publicKey, connected, sendTransaction } = useWallet();
  const [message, setMessage] = useState(0); // predicted price
  // const [transactionStatus, setTransactionStatus] = useState("");

  const connection = new Connection(
    "https://api.devnet.solana.com",
    "confirmed"
  );

  // Target Solana account
  const targetAccount = new PublicKey(
    "3jH2EtZ42f4yKfrFZ2G6H18Y6Ko5C92gdWPxKD4gyGuP"
  );

  const sendDataToAccount = async () => {
    try {
      // Create a JSON object with the required data

      const dataObject = {
        address: publicKey,
        data: message,
        price: 1000000, // 1 Solana in lamports
      };

      // Serialize the JSON object as a Buffer
      const dataBuffer = Buffer.from(JSON.stringify(dataObject), "utf-8");

      // Create a transaction
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: targetAccount,
          lamports: 1000000, // 1 Solana in lamports
          data: dataBuffer,
        })
      );

      //   const signature = sendAndConfirmTransaction(
      //     connection,
      //     transaction,
      //     [keypair],
      //   );

      const signature = await sendTransaction(transaction, connection);
      console.log("signature", signature);
      // await connection.confirmTransaction(signature, "processed");
      // Sign the transaction
      //transaction.sign(wallet.signer);

      // Send the transaction and confirm its success
      //const signature = await sendAndConfirmTransaction(connection, transaction);

      await connection.confirmTransaction(signature, "processed");

      // setTransactionStatus(`Transaction confirmed. Signature: ${signature}`);
      notify({
        type: "success",
        message: `Transaction confirmed`,
        txid: signature,
      });
    } catch (error) {
      console.error("Error sending transaction:", error);
      //  setTransactionStatus('Error sending transaction');
    }
  };

  const onClick = useCallback(async () => {
    try {
      // `publicKey` will be null if the wallet isn't connected
      if (!publicKey || !connected) throw new Error("Wallet not connected!");

      if (message) {
        sendDataToAccount();
      }
    } catch (error: any) {
      notify({
        type: "error",
        message: `Transaction failed!`,
        description: error?.message,
      });
      console.log("error", `Transaction failed! ${error?.message}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [publicKey, notify]);

  return (
    <div className="md:hero mx-auto p-4">
      <div className="md:hero-content flex flex-col">
        <h1 className="text-center text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-indigo-500 to-fuchsia-500 mt-10 mb-8">
          Bet a Price and be the next WINNER!
        </h1>
        {/* CONTENT GOES HERE */}
        <div className="text-center">
          <div className="w-full max-w-md">
            <div className="flex items-center border-teal-500 py-2">
              <label className="w-full block uppercase tracking-wide text-white text-xs font-bold mr-2">
                Prediction Price:
                <span className="border-transparent text-fuchsia-500 text-sm">
                  {" BTC/USDT"}
                </span>
              </label>
              $
              <input
                step="0.01"
                className="!appearance-none bg-transparent border-none w-full text-fuchsia-500 mr-3 py-1 px-2 leading-tight focus:outline-none"
                type="number"
                value={message}
                aria-label="Prediction Price"
                onChange={(e) => setMessage(e.target.value)}
              ></input>
            </div>
            <div className="flex items-center border-teal-500 py-2">
              <label className="w-full block uppercase tracking-wide text-white text-xs font-bold mr-2">
                Amount to Stake:
                <span className="border-transparent text-fuchsia-500 text-sm">
                  {" lams/SOL"}
                </span>
              </label>
              <input
                disabled={true}
                className="appearance-none bg-transparent border-none w-full text-fuchsia-500 mr-3 py-1 px-2 leading-tight focus:outline-none"
                type="text"
                placeholder="0 SOL"
                value={`${1000000}`}
                aria-label="Amount to Stake"
              ></input>
            </div>
            {connected && <p>Connected to wallet: {publicKey?.toBase58()}</p>}
            <button
              className="group w-60 m-2 btn animate-pulse bg-gradient-to-br from-indigo-500 to-fuchsia-500 hover:from-white hover:to-purple-300 text-black"
              onClick={onClick}
              disabled={!publicKey || !connected}
            >
              <div className="hidden group-disabled:block">
                Wallet not connected
              </div>
              <span className="block group-disabled:hidden">
                Send Transaction
              </span>
            </button>
          </div>
          {/* <p>{transactionStatus}</p> */}
          {/* <WalletConnect /> */}
        </div>
      </div>
    </div>
  );
};