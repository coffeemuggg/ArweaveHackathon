import type { NextPage } from 'next';
import { useEffect, useState } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useBundler } from '@/state/bundlr.context';
import { chainId, useAccount, useNetwork } from 'wagmi';
import FundWallet from '@/components/FundWallet';
import UploadVideo from '@/components/UploadVideo';

export default function UploadBundlr() {

  const { data } = useAccount();
  const { activeChain } = useNetwork();
  const { initialiseBundlr, bundlrInstance, balance } = useBundler();
  const [hasMounted, setHasMounted] = useState(false);
  useEffect(() => {
    setHasMounted(true);
  }, []);
  if (!hasMounted) {
    return null;
  }

  if (!data) {
    return (
      <div className='grid place-items-center pb-20 pt-12'>
        <div className="grid place-items-center pb-4">
          <h1 className="text-5xl text-center text-white font-tektur">Upload video via Bundlr</h1>
          <div className="bg-secondary w-96 h-1 my-2 rounded-md"></div>
        </div>

        <div className="mt-36 grid place-items-center space-y-3">
          <h1 className='text-4xl text-white'>
            Connect your wallet first
          </h1>
          <ConnectButton />
        </div>
      </div >
    )
  }

  if (activeChain && activeChain.id !== chainId.polygonMumbai) {
    return (
      <div className='grid place-items-center pb-20 pt-12'>
        <div className="grid place-items-center pb-4">
          <h1 className="text-5xl text-center text-white font-tektur">Upload video via Bundlr</h1>
          <div className="bg-secondary w-96 h-1 my-2 rounded-md"></div>
        </div>
        <div className="mt-36 grid place-items-center space-y-3">
          <h1 className='text-4xl text-white'>
            Oops, incorrect network selection! Please switch to the Polygon Mumbai Testnet.
          </h1>
          <ConnectButton />
        </div>
      </div>
    )
  }

  if (!bundlrInstance) {
    return (
      <div className='grid place-items-center pb-20 pt-12'>
        <div className="grid place-items-center pb-4">
          <h1 className="text-5xl text-center text-white font-tektur">Upload video via Bundlr</h1>
          <div className="bg-secondary w-96 h-1 my-2 rounded-md"></div>
        </div>

        <div className='grid place-items-center space-y-4'>
          <ConnectButton />
          <h1 className='text-4xl text-white'>
            Let's initialise Bundlr now
          </h1>
          <button className='mt-10 bg-secondary px-4 py-2 text-xl text-white rounded-lg' onClick={initialiseBundlr}>Initialise Bundlr</button>
        </div>

      </div>
    )
  }

  if (!balance || Number(balance) <= 0) {
    return (
      <div className='grid place-items-center pb-20 pt-12'>
        <div className="grid place-items-center pb-4">
          <h1 className="text-5xl text-center text-white font-tektur">Upload video via Bundlr</h1>
          <div className="bg-secondary w-96 h-1 my-2 rounded-md"></div>
        </div>

        <div>
          <ConnectButton />
          <h1 className='text-4xl text-white'>
            Oops, insufficient funds! Let's top up.
          </h1>
          <FundWallet />
        </div>
      </div>
    )
  }

  return (
    <div className='grid place-items-center pb-20 pt-12'>
      <div className="grid place-items-center pb-4">
        <h1 className="text-5xl text-center text-white font-tektur">Upload video via Bundlr</h1>
        <div className="bg-secondary w-96 h-1 my-2 rounded-md"></div>
      </div>
      <div className='grid gap-2'>
        <div className='grid place-items-center'>
          <ConnectButton />
          <FundWallet />
        </div>
        <div>
          <UploadVideo />
        </div>
      </div>
    </div>
  );

}
