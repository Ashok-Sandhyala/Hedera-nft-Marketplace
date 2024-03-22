import {
  Client,
  AccountId,
  PrivateKey,
  AccountCreateTransaction,
  Hbar,
} from "@hashgraph/sdk";

async function environmentSetup() {

  try {
    const myAccountId = AccountId.fromString(process.env.REACT_APP_accountid);
    const myPrivateKey = PrivateKey.fromString(process.env.REACT_APP_privatekey);
    if (myAccountId == null || myPrivateKey == null) {
      throw new Error(
        "Environment variables myAccountId and myPrivateKey must be present"
      );
    }
    const client = Client.forTestnet();
    client.setOperator(myAccountId, myPrivateKey);
    client.setDefaultMaxTransactionFee(new Hbar(10));
    client.setMaxQueryPayment(new Hbar(10));
    const newAccountPrivateKey = PrivateKey.generateED25519();
    const newAccountPublicKey = newAccountPrivateKey.publicKey;
    const newAccount = await new AccountCreateTransaction()
      .setKey(newAccountPublicKey)
      .setInitialBalance(Hbar.fromTinybars(1000))
      .execute(client);
    const getReceipt = await newAccount.getReceipt(client);
    const newAccountId = getReceipt.accountId;
    console.log('private key : ' + newAccountPrivateKey)
    return {
      newAccountId: newAccountId.toString(),
      newAccountPrivateKey: newAccountPrivateKey.toString(),
    };
  } catch (error) {
    console.error("Error in environmentSetup:", error);
    throw error;
  }
}
export default environmentSetup;
