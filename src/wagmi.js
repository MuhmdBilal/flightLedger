import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import {
  // arbitrum,
  // base,
  // mainnet,
  // optimism,
  // polygon,
  // sepolia,
  // localhost
  bscTestnet
} from 'wagmi/chains';

export const config = getDefaultConfig({
  appName: 'RainbowKit demo',
  projectId: 'YOUR_PROJECT_ID',
  chains: [
    bscTestnet,
    // mainnet,
    // polygon,
    // optimism,
    // arbitrum,
    // base,
    // localhost,
    // sepolia,
    ...(process.env.REACT_APP_ENABLE_TESTNETS === 'true' ? [bscTestnet] : []),
  ],
});
