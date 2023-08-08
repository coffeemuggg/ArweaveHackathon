import '../styles/globals.css';
import '@rainbow-me/rainbowkit/styles.css';
import { getDefaultWallets, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { chain, configureChains, createClient, WagmiConfig } from 'wagmi';
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc';
import { publicProvider } from 'wagmi/providers/public';
import Layout from '../components/layout'
import type { AppProps } from 'next/app';
import BundlrContextProvider from '@/state/bundlr.context';

const { chains, provider } = configureChains(
  [chain.polygonMumbai],
  [
    jsonRpcProvider({ rpc: () => ({ http: process.env.NEXT_PUBLIC_ALCHEMY_RPC }) }),
    publicProvider(),
  ]
);

const { connectors } = getDefaultWallets({
  appName: 'Bundlr arweave testnet demo',
  chains,
});

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider chains={chains}>
        <BundlrContextProvider>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </BundlrContextProvider>
      </RainbowKitProvider>
    </WagmiConfig>
  );
}

export default MyApp;
