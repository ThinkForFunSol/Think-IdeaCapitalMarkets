# Wallet Integration Guide (Added December 09, 2025)

This guide covers integrating multi-chain wallets into the GoodIdea website.

1. **Solana**: Use @solana/wallet-adapter-react for Phantom, etc.
2. **ETH/BNB**: Use wagmi and RainbowKit for MetaMask, etc.
3. **Chain Switching**: See integrations/multi-chain-setup.ts for handling chain changes.
4. **Testing**: Run integrations/test-wallet-integration.ts.

Environment Variables:
- INFURA_KEY: For ETH RPC
- ALCHEMY_KEY: Optional for better performance
