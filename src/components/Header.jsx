import Link from 'next/link'
import logo from  'public/moralis.svg'
import Image from 'next/image'
import eth from 'public/eth.svg'

const Header = (props) => {

    const {address, isConnected , connect} = props
  return (
    <header>
        <div className="leftH">
            <Image src={logo} alt='molaris logo' className='logo' />    
        </div>
        <div className='centerH'>
            <Link href='/' className="headerItem">
                <div>Swap</div>
            </Link>
            <Link href='/token' className="headerItem">
                <div >Tokens</div>
            </Link>
        </div>
        <div className="rightH">
            <div className="headerItem eth-box">
                <Image src={eth} height={26} alt="eth logo" />
                <p>Ethereum</p>
            </div>
            <div className="connectButton" onClick={connect}>
                {isConnected ? (address.slice(0,4) +"..." +address.slice(38)) : "Connect"}
            </div>
        </div>
    </header>
  )
}

export default Header