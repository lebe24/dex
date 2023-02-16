import '@/styles/globals.css'
import { configureChains, mainnet, WagmiConfig,goerli, createClient } from "wagmi";
import { publicProvider } from "wagmi/providers/public";

const { provider, webSocketProvider } = configureChains(
  [goerli],
  [publicProvider()]
);

const client = createClient({
  autoConnect:true,
  provider,
  webSocketProvider
})

export default function App({ Component, pageProps }) {
  return (
      <WagmiConfig client={client}>
        <Component {...pageProps} />
      </WagmiConfig> 
)}
