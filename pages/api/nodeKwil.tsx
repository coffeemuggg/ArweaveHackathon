import { NodeKwil } from 'kwil';
import { Wallet } from 'ethers';
import dotenv from 'dotenv';
dotenv.config();

const kwil = new NodeKwil({
    kwilProvider: process.env.NEXT_PUBLIC_KWIL_PROVIDER!,
    timeout: 10000,
    logging: false
});

const wallet = new Wallet(process.env.NEXT_PUBLIC_WALLET_PRIVATE_KEY!);

const dbName = "fanscribe";

export { kwil, wallet, dbName };
