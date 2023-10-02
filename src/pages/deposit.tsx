import type { NextPage } from "next";
import Head from "next/head";
import { DepositView } from "../views";

const Deposit: NextPage = (props) => {
  return (
    <div>
      <Head>
        <title>Solana Scaffold</title>
        <meta
          name="description"
          content="Basic Functionality"
        />
      </Head>
      <DepositView />
    </div>
  );
};

export default Deposit;
