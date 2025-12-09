import { createConfig, http } from 'wagmi';
import { sepolia, bscTestnet } from 'wagmi/chains';

export const wagmiConfig = createConfig({
  chains: [sepolia, bscTestnet],
  transports: {
    [sepolia.id]: http(process.env.REACT_APP_INFURA_URL),
    [bscTestnet.id]: http('https://data-seed-prebsc-1-s1.binance.org:8545'),
  },
});

// Functions for ETH interactions, e.g., tokenizeIdea
export async function tokenizeIdeaEth(contractAddress: string, tokenId: number, shares: number) {
  // Use viem or ethers to call contract
}
