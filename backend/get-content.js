const express = require('express');
const router = express.Router();
require('dotenv').config();

const kwiljs = require('kwil');
const { wallet, dbName } = require('./nodeKwil');
const Utils = kwiljs.Utils;

const kwil = new kwiljs.NodeKwil({
    kwilProvider: "https://provider.kwil.com",
});

const dbid = Utils.generateDBID(process.env.WALLET_PUBLIC_KEY, dbName)
const Input = kwiljs.Utils.ActionInput

router.get('/', async (req, res) => {
    let wallet_address = req.query.wallet_address;

    if (!wallet_address) {
        res.status(400).send('No wallet address provided');
    } else {
        const inputWalletAddress = Input.of()
            .put("$wallet_address", wallet_address);

        const actionGetContentByWalletAddress = await kwil
            .actionBuilder()
            .dbid(dbid)
            .name("get_posts_by_wallet_address")
            .concat(inputWalletAddress)
            .signer(wallet)
            .buildTx()

        let result = await kwil.broadcast(actionGetContentByWalletAddress)
        res.send(result.data);
    }
});

module.exports = router;
