import { useConnect, useAccount } from "wagmi";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import Header from '@/components/Header'


const Layout = ({ children }) => {
    const { address, isConnected } = useAccount();
    const { connect } = useConnect({
        connector: new MetaMaskConnector(),
    });

    return (
      <div className="content">
        <Header connect={connect} isConnected={isConnected} address={address}  />
        { children }
        {/* <Footer /> */}
      </div>
    );
}

export default Layout