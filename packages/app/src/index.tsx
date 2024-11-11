import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { WagmiConfig, createConfig } from "wagmi";
import { createPublicClient, http } from "viem";
import { configureChains } from "wagmi";
import { publicProvider } from "wagmi/providers/public";
import { sepolia } from "wagmi/chains";
import {
  getDefaultWallets,
  RainbowKitProvider,
  darkTheme,
} from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { GoogleAuthProvider } from "./contexts/GoogleAuth";
import { ThemeProvider, CssBaseline } from '@mui/material';
import theme from './theme'; 

const { connectors } = getDefaultWallets({
  appName: "ZK Email - Twitter Verifier",
  chains: [sepolia],
  projectId: "b68298f4e6597f970ac06be1aea7998d",
});

const config = createConfig({
  autoConnect: true,
  publicClient: createPublicClient({
    chain: sepolia,
    transport: http(),
  }),
  connectors: connectors,
});

if (import.meta.env.VITE_GOOGLE_CLIENT_ID) {
  ReactDOM.render(
    <React.StrictMode>
      <ThemeProvider theme={theme}>
        <WagmiConfig config={config}>
          <RainbowKitProvider chains={[sepolia]} theme={darkTheme()}>
            <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
              <GoogleAuthProvider>
                <App />
              </GoogleAuthProvider>
            </GoogleOAuthProvider>
          </RainbowKitProvider>
        </WagmiConfig>
      </ThemeProvider>
    </React.StrictMode>,
    document.getElementById("root")
  );
} else {
  ReactDOM.render(
    <React.StrictMode>
      <ThemeProvider theme={theme}>
        <WagmiConfig config={config}>
          <RainbowKitProvider chains={[sepolia]} theme={darkTheme()}>
            <App />
          </RainbowKitProvider>
        </WagmiConfig>
      </ThemeProvider>
    </React.StrictMode>,
    document.getElementById("root")
  );
}
