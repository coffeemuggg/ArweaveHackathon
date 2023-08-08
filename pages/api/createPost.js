import { NextApiRequest, NextApiResponse } from 'next';
import { v4 as uuidv4 } from 'uuid';
import * as kwiljs from 'kwil';
import { wallet, dbName } from './nodeKwil';
import { Utils } from 'kwil';

const dbid = Utils.generateDBID(process.env.NEXT_PUBLIC_WALLET_PUBLIC_KEY, dbName);

const kwil = new kwiljs.NodeKwil({
  kwilProvider: "https://provider.kwil.com",
});

function generateRandom6CharUUID() {
  const uuid = uuidv4();
  return uuid.substring(0, 6);
}

const Input = kwiljs.Utils.ActionInput;

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { title, description, video_url, thumbnail_url, wallet_address } = req.body;

      if (!title || !description || !video_url || !thumbnail_url || !wallet_address) {
        res.status(400).send('Error: All parameters (title, description, video_url, thumbnail_url, wallet_address) must be provided');
      } else {
        const id = generateRandom6CharUUID();
        const dateString = Date.now().toString();

        const input = Input.of()
          .put("$id", id)
          .put("$title", title)
          .put("$description", description)
          .put("$video_url", video_url)
          .put("$thumbnail_url", thumbnail_url)
          .put("$wallet_address", wallet_address)
          .put("$date_created_string", dateString);

        const actionCreatePost = await kwil
          .actionBuilder()
          .dbid(dbid)
          .name("create_post")
          .concat(input)
          .signer(wallet)
          .buildTx();

        const result = await kwil.broadcast(actionCreatePost);
        res.status(200).json(result.data);
      }
    } catch (error) {
      console.error('Error creating post:', error);
      res.status(500).send('An error occurred while creating the post.');
    }
  } else {
    res.status(405).send('Method not allowed');
  }
}
