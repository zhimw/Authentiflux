import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { localhost, polygonAmoy } from './chains';
import { injected } from 'wagmi/connectors';

// Configure wagmi with RainbowKit - using only injected connector to avoid MetaMask SDK issues
export const config = getDefaultConfig({
  appName: 'AuthentiFlux',
  projectId: 'YOUR_WALLETCONNECT_PROJECT_ID', // Optional: Get from https://cloud.walletconnect.com/
  chains: [localhost, polygonAmoy],
  ssr: false,
  // Use only injected connector (MetaMask extension) to avoid SDK analytics issues
  connectors: [
    injected({
      target: 'metaMask',
    }),
  ],
});

