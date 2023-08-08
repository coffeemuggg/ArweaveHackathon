import { WebBundlr } from '@bundlr-network/client';
import { toast } from 'react-toastify';
import BigNumber from 'bignumber.js';
import { providers, utils } from 'ethers';
import React, { createContext, useContext, useEffect, useState } from 'react'

export interface IBundlrHook {
    initialiseBundlr: () => Promise<void>;
    fundWallet: (_: number) => void;
    balance: string;
    uploadFile: (file: Buffer) => Promise<any>;
    bundlrInstance: WebBundlr;
}

const BundlrContext = createContext<IBundlrHook>({
    initialiseBundlr: async () => { },
    fundWallet: (_: number) => { },
    balance: '',
    uploadFile: async (_file) => { },
    bundlrInstance: null
});

const BundlrContextProvider = ({ children }: any): JSX.Element => {
    const [bundlrInstance, setBundlrInstance] = useState<WebBundlr>();
    const [balance, setBalance] = useState<string>('');

    useEffect(() => {
        if (bundlrInstance) {
            fetchBalance();
        }
    }, [bundlrInstance])

    const initialiseBundlr = async () => {
        const provider = new providers.Web3Provider(window.ethereum as any);
        await provider._ready();
        const bundlr = new WebBundlr(
            "https://devnet.bundlr.network",
            "matic",
            provider,
            {
                providerUrl:
                    process.env.NEXT_PUBLIC_ALCHEMY_RPC,
            }
        );
        await bundlr.ready();
        setBundlrInstance(bundlr);

    }


    async function fundWallet(amount: number) {
        try {
            if (bundlrInstance) {
                if (!amount) return
                const amountParsed = parseInput(amount)
                if (amountParsed) {
                    toast.success('Adding funds please wait', {
                        position: toast.POSITION.TOP_RIGHT
                    });

                    let response = await bundlrInstance.fund(amountParsed)
                    console.log('Wallet funded: ', response)
                    toast.success('Funds added', {
                        position: toast.POSITION.TOP_RIGHT
                    });
                }
                fetchBalance()
            }
        } catch (error) {
            console.log("error", error);
            toast.success('Something went wrong!', {
                position: toast.POSITION.TOP_RIGHT
            });
        }
    }

    function parseInput(input: number) {
        const conv = new BigNumber(input).multipliedBy(bundlrInstance!.currencyConfig.base[1])
        if (conv.isLessThan(1)) {
            console.log('error: value too small')
            toast.success('Error: value too small', {
                position: toast.POSITION.TOP_RIGHT
            });
            return
        } else {
            return conv
        }
    }


    async function fetchBalance() {
        if (bundlrInstance) {
            const bal = await bundlrInstance.getLoadedBalance();
            console.log("bal: ", utils.formatEther(bal.toString()));
            setBalance(utils.formatEther(bal.toString()));
        }
    }

    async function uploadFile(file) {
        try {
            let tx = await bundlrInstance.uploader.upload(file, [{ name: "Content-Type", value: "image/png" }])
            return tx;
        } catch (error) {
            toast.success('Error: value too small', {
                position: toast.POSITION.TOP_RIGHT
            });
        }
    }

    return (
        <BundlrContext.Provider value={{ initialiseBundlr, fundWallet, balance, uploadFile, bundlrInstance }}>
            {children}
        </BundlrContext.Provider>
    )
}

export default BundlrContextProvider;


export const useBundler = () => {
    return useContext(BundlrContext);
}