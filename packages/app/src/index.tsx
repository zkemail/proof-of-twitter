import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { WagmiConfig, WagmiProvider, createConfig } from "wagmi";
import { createPublicClient, http } from "viem";
import { configureChains } from "wagmi";
import { publicProvider } from "wagmi/providers/public";
import { sepolia } from "wagmi/chains";
import {
  getDefaultWallets,
  RainbowKitProvider,
  darkTheme,
  getDefaultConfig,
} from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { GoogleAuthProvider } from "./contexts/GoogleAuth";
import { ZkEmailSDKProvider } from "@zk-email/zk-email-sdk";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// const { connectors } = getDefaultWallets({
//   appName: "ZK Email - Twitter Verifier",
//   chains: [sepolia],
//   projectId: "b68298f4e6597f970ac06be1aea7998d",
// });

// const config = createConfig({
//   autoConnect: true,
//   publicClient: createPublicClient({
//     chain: sepolia,
//     transport: http(),
//   }),
//   connectors: connectors,
// });

const config = getDefaultConfig({
  appName: "ZK Email - Twitter Verifier",
  projectId: "b68298f4e6597f970ac06be1aea7998d",
  chains: [sepolia],
  // transports: http(),
});

const queryClient = new QueryClient();

ReactDOM.render(
  <React.StrictMode>
    <ZkEmailSDKProvider
      clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}
      zkEmailSDKRegistryUrl="https://registry-dev.zkregex.com"
    >
      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
        <WagmiProvider config={config}>
          <QueryClientProvider client={queryClient}>
            <RainbowKitProvider theme={darkTheme()}>
              <GoogleAuthProvider>
                <App />
              </GoogleAuthProvider>
            </RainbowKitProvider>
          </QueryClientProvider>
        </WagmiProvider>{" "}
      </GoogleOAuthProvider>
    </ZkEmailSDKProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
