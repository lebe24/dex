import '@/styles/globals.css'
import Layout from '@/components/Layer';
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
          <Layout>
            <Component {...pageProps} />
          </Layout>
      </WagmiConfig> 
)}
