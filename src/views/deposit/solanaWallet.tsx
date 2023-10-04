"use client";

import React, { useState, useEffect } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import {
  SystemProgram,
  Connection,
  PublicKey,
  Transaction,
  sendAndConfirmTransaction,
} from "@solana/web3.js";

const SolanaWalletApp = () => {
  const { wallet, publicKey, connect, connected, sendTransaction } =
    useWallet();
  const [message, setMessage] = useState("");
  const [transactionStatus, setTransactionStatus] = useState("");
  const [address, setAddress] = useState("");
  //const { connection } = useConnection();
  console.log("connected", connected);
  // useEffect(() => {
  // Check if wallet is connected before allowing transactions

  // }, [connected, message, wallet]);

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

      setTransactionStatus(`Transaction confirmed. Signature: ${signature}`);
    } catch (error) {
      console.error("Error sending transaction:", error);
      //  setTransactionStatus('Error sending transaction');
    }
  };

  const handleSubmit = () => {
    if (message && wallet) {
      if (connected) {
        // Initialize your Solana connection

        sendDataToAccount();
        // Function to send data to the target account
      }
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <h1>Solana Wallet App</h1>
      {connected ? (
        <div>
          <p>Connected to wallet: {publicKey?.toBase58()}</p>
          {/* <input
            type="text"
            placeholder="Enter recipient's address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className='block border-2 p-4 w-96'
          /> */}
          <input
            type="number"
            placeholder="Enter a BTC Price"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="block border-2 p-4"
          />
          <button onClick={handleSubmit} className="block bg-blue-600 p-4">
            Submit Transaction
          </button>
          <p>{transactionStatus}</p>
        </div>
      ) : (
        <button onClick={connect}>Connect Wallet</button>
      )}
    </div>
  );
};

export default SolanaWalletApp;
