import { FC, useCallback } from "react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useWallet } from "@solana/wallet-adapter-react";
import SolanaWalletComponent from "./solanaWallet";
import { Wallet } from "./walletProvider";

const WalletConnect: FC = ({}) => {
  const { publicKey, sendTransaction, signTransaction } = useWallet();

  console.log("public key log ======> ", publicKey?.toBase58());

  return (
    <Wallet>
      <div className="flex bg-slate-400 flex-auto">
        <WalletMultiButton />
      </div>
      {publicKey?.toBase58() ? <SolanaWalletComponent /> : ""}
    </Wallet>
  );
};

export default WalletConnect;
