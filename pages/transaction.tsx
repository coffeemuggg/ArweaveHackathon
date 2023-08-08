import { useEffect, useState } from 'react';
import { providers, utils } from 'ethers';
export default function Web3Transaction() {
  const [account, setAccount] = useState<string | null>(null);
  const [provider, setProvider] = useState<providers.Web3Provider | null>(null);
  const [toAddress, setToAddress] = useState('');
  const [amount, setAmount] = useState('0');
  const [transactionHash, setTransactionHash] = useState<string | null>(null);

  useEffect(() => {
    const web3Provider = new providers.Web3Provider(window.ethereum);
    setProvider(web3Provider);

    async function fetchAccount() {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      setAccount(accounts[0]);
    }

    fetchAccount();
  }, []);

  const handleTransaction = async () => {
    if (!provider || !account) return;

    try {
      const signer = provider.getSigner();
      const transaction = await signer.sendTransaction({
        to: toAddress,
        value: utils.parseEther(amount),
      });

      setTransactionHash(transaction.hash);
      await transaction.wait();
      console.log('Transaction confirmed:', transaction);
    } catch (error) {
      console.error('Transaction error:', error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">Send ETH to Another Account</h1>
      {account ? (
        <>
          <p className="mb-2">Your Account: {account}</p>
          <div className="mb-2">
            <label htmlFor="toAddress" className="mr-2">
              To Address:
            </label>
            <input
              type="text"
              id="toAddress"
              value={toAddress}
              onChange={(e) => setToAddress(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2"
            />
          </div>
          <div className="mb-2">
            <label htmlFor="amount" className="mr-2">
              Amount (ETH):
            </label>
            <input
              type="number"
              id="amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2"
            />
          </div>
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
            onClick={handleTransaction}
          >
            Send ETH
          </button>
          {transactionHash && (
            <p className="mt-4">Transaction Hash: {transactionHash}</p>
          )}
        </>
      ) : (
        <p>Connecting to Ethereum...</p>
      )}
    </div>
  );
}
