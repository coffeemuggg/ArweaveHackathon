import * as kwiljs from 'kwil';
import { wallet, dbName } from './nodeKwil';
import { Utils } from 'kwil';
import dotenv from 'dotenv';

dotenv.config();

const kwil = new kwiljs.NodeKwil({
  kwilProvider: "https://provider.kwil.com",
});

const dbid = Utils.generateDBID(process.env.NEXT_PUBLIC_WALLET_PUBLIC_KEY, dbName);
const Input = kwiljs.Utils.ActionInput;

export default async function handler(
  req,
  res
) {
  try {
    const actionGetContentByWalletAddress = await kwil
      .actionBuilder()
      .dbid(dbid)
      .name("get_all_content")
      .signer(wallet)
      .buildTx();

    const result = await kwil.broadcast(actionGetContentByWalletAddress);
    res.status(200).json(result.data);
  } catch (error) {
    console.error('Error fetching content:', error);
    res.status(500).json({ error: 'An error occurred while fetching content.' });
  }
}
