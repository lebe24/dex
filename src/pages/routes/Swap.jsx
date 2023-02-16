import { useState , useEffect} from "react"
import { Input, Popover, Radio, Modal, message } from "antd";
import { useSendTransaction, useWaitForTransaction } from "wagmi";
import {
    ArrowDownOutlined,
    DownOutlined,
    SettingOutlined,
  } from "@ant-design/icons";
import tokenList from '@/tokenList.json'
import Image from "next/image";



const Swap = (props) => {
    const { address, isConnected } = props;
    const [messageApi, contextHolder] = message.useMessage();
    const [slippage, setSlippage] = useState(2.5);
    const [tokenOneAmount, setTokenOneAmount] = useState(null);
    const [tokenTwoAmount, setTokenTwoAmount] = useState(null);
    const [tokenOne, setTokenOne] = useState(tokenList[0]);
    const [tokenTwo, setTokenTwo] = useState(tokenList[1]);
    const [isOpen, setIsOpen] = useState(false);
    const [changeToken, setChangeToken] = useState(1);
    const [prices, setPrices] = useState(null);
    const [txDetails, setTxDetails] = useState({
        to:null,
        data: null,
        value: null,
    }); 

    // const settings = (
    //     <>
    //       <div>Slippage Tolerance</div>
    //       <div>
    //         <Radio.Group value={slippage} onChange={handleSlippageChange}>
    //           <Radio.Button value={0.5}>0.5%</Radio.Button>
    //           <Radio.Button value={2.5}>2.5%</Radio.Button>
    //           <Radio.Button value={5}>5.0%</Radio.Button>
    //         </Radio.Group>
    //       </div>
    //     </>
    //   );

  return (
    <>
        <div className="tradeBox">
            <div className="tradeBoxHeader">
                <h4>Swap</h4>
                {/* <Popover
                    content={settings}
                    title="Settings"
                    trigger="click"
                    placement="bottomRight"
                >
                    <SettingOutlined className="cog" />
                </Popover> */}
            </div>
            <div className="inputs">
                <Input
                    placeholder="0"
                    value={tokenOneAmount}
                    // onChange={changeAmount}
                    disabled={!prices}
                />
                <Input placeholder="0" value={tokenTwoAmount} disabled={true} />
                <div className="switchButton" >
                    <ArrowDownOutlined className="switchArrow" />
                </div>
                <div className="assetOne" onClick={() => openModal(1)}>
                    <Image width={30} height={40} src={tokenOne.img} alt="assetOneLogo" className="assetLogo" />
                    {tokenOne.ticker}
                    <DownOutlined />
                </div>
                <div className="assetTwo" onClick={() => openModal(2)}>
                    <Image width={30} height={40} src={tokenTwo.img} alt="assetOneLogo" className="assetLogo" />
                    {tokenTwo.ticker}
                    <DownOutlined />
                </div>
            </div>
            <div className="swapButton" disabled={!tokenOneAmount || !isConnected} >Swap</div>
        </div>
    </>
  )
}

export default Swap