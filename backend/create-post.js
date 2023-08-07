const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

const kwiljs = require('kwil');
const { wallet, dbName } = require('./nodeKwil');
const Utils = kwiljs.Utils;

const dbid = Utils.generateDBID(process.env.WALLET_PUBLIC_KEY, dbName);

const kwil = new kwiljs.NodeKwil({
  kwilProvider: "https://provider.kwil.com",
});

function generateRandom6CharUUID() {
  const uuid = uuidv4();
  return uuid.substring(0, 6);
}

const Input = kwiljs.Utils.ActionInput

router.post('/', async (req, res) => {
  let title = req.body.title;
  let description = req.body.description;
  let videoUrl = req.body.video_url;
  let thumbnailUrl = req.body.thumbnail_url;
  let walletAddress = req.body.wallet_address;

  if (!title || !description || !videoUrl || !thumbnailUrl || !walletAddress) {
    res.status(400).send('Error: All parameters (title, description, video_url, thumbnail_url, wallet_address) must be provided');
  } else {
    const id = generateRandom6CharUUID();
    let dateString = Date.now().toString();

    const input = Input.of()
      .put("$id", id)
      .put("$title", title)
      .put("$description", description)
      .put("$video_url", videoUrl)
      .put("$thumbnail_url", thumbnailUrl)
      .put("$wallet_address", walletAddress)
      .put("$date_created_string", dateString);

    const actionCreatePost = await kwil
      .actionBuilder()
      .dbid(dbid)
      .name("create_post")
      .concat(input)
      .signer(wallet)
      .buildTx()

    let result = await kwil.broadcast(actionCreatePost)
    res.send(result.data);
  }
});

module.exports = router;
