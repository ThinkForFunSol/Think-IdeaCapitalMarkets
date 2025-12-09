import { PublicKey } from '@solana/web3.js';
import { createConfig, http } from 'wagmi';
import { sepolia, bscTestnet } from 'wagmi/chains';

// Example config loader
export function loadWalletConfig() {
  const config = require('../app/.wallet-config.json');
  return config;
}

// Wagmi config for ETH/BNB
export const wagmiConfig = createConfig({
  chains: [sepolia, bscTestnet],
  transports: {
    [sepolia.id]: http(),
    [bscTestnet.id]: http(),
  },
});
