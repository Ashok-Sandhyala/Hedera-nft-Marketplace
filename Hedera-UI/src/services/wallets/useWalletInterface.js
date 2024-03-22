import { useContext } from "react";
import { HashconnectContext } from "../../contexts/HashconnectContext";
import { hashConnectWallet } from "./hashconnect/hashconnectClient";

export const useWalletInterface = () => {
  const hashconnectCtx = useContext(HashconnectContext);

  if (hashconnectCtx.accountId && hashConnectWallet) {
    return {
      accountId: hashconnectCtx.accountId,
      walletInterface: hashConnectWallet
    };
  } else {
    return {
      accountId: null,
      walletInterface: null
    };
  }
};
