import * as kwiljs from 'kwil';
import { wallet, dbName } from './nodeKwil';
import { Utils } from 'kwil';

const dbid = Utils.generateDBID(process.env.NEXT_PUBLIC_WALLET_PUBLIC_KEY, dbName);

const kwil = new kwiljs.NodeKwil({
  kwilProvider: "https://provider.kwil.com",
});

const Input = kwiljs.Utils.ActionInput;

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { id } = req.body;

      if (!id) {
        res.status(400).send('Error: id must be provided');
      } else {
        const input = Input.of()
          .put("$id", id);

        const actionDeletePost = await kwil
          .actionBuilder()
          .dbid(dbid)
          .name("remove_post")
          .concat(input)
          .signer(wallet)
          .buildTx();

        const result = await kwil.broadcast(actionDeletePost);
        res.status(200).json(result.data);
      }
    } catch (error) {
      console.error('Error deleting post:', error);
      res.status(500).send('An error occurred while deleting the post.');
    }
  } else {
    res.status(405).send('Method not allowed');
  }
}
