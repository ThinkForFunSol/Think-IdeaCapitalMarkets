import React from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WagmiProvider } from 'wagmi';
import { RainbowKitProvider, ConnectButton } from '@rainbow-me/rainbowkit';
import { wagmiConfig } from '../utils/eth'; // New utils/eth.ts

const WalletConnector: React.FC = () => {
  const { connect } = useWallet(); // Solana

  return (
    <WagmiProvider config={wagmiConfig}>
      <RainbowKitProvider>
        <button onClick={() => connect()}>Connect Solana Wallet</button>
        <ConnectButton /> {/* For ETH/BNB */}
      </RainbowKitProvider>
    </WagmiProvider>
  );
};

export default WalletConnector;
