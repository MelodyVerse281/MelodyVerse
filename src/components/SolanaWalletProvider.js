import React, { useMemo } from 'react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { PhantomWalletAdapter, SolflareWalletAdapter } from '@solana/wallet-adapter-wallets';
import { clusterApiUrl } from '@solana/web3.js';

// 引入默认样式
import '@solana/wallet-adapter-react-ui/styles.css';

export default function SolanaWalletProvider({ children }) {
  // 可以设置为 'devnet', 'testnet', 或 'mainnet-beta'
  const network = WalletAdapterNetwork.Devnet;

  // 您也可以提供自定义 RPC 端点
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);

  // 初始化钱包适配器
  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter()
    ],
    []
  );

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          {children}
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
} 