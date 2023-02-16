import { useState , useEffect} from "react"
import { Input, Popover, Radio, Modal, message } from "antd";
import style from '@/styles/Home.module.css'
import { useSendTransaction, useWaitForTransaction } from "wagmi";
import axios from "axios";

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

    const {data, sendTransaction} = useSendTransaction({
        request: {
          from: address,
          to: String(txDetails.to),
          data: String(txDetails.data),
          value: String(txDetails.value),
        }
    })
    
    const { isLoading, isSuccess } = useWaitForTransaction({
        hash: data?.hash,
    })

    
    
      function handleSlippageChange(e) {
        setSlippage(e.target.value);
      }
    

      function changeAmount(e) {
        setTokenOneAmount(e.target.value);
        if(e.target.value && prices){
          setTokenTwoAmount((e.target.value * prices.ratio).toFixed(2))
        }else{
          setTokenTwoAmount(null);
        }
      }

    // fetching price 
      async function fetchPrices(one,two){

        const res = await axios.get('http://localhost:3000/api/tokenprice',{
            params:{addressOne: one, addressTwo: two}
        })

        setPrices(res.data)
      }

      function openModal(asset) {
        setChangeToken(asset);
        setIsOpen(true);
      }
    
      function modifyToken(i){
        setPrices(null);
        setTokenOneAmount(null);
        setTokenTwoAmount(null);
        if (changeToken === 1) {
          setTokenOne(tokenList[i]);
          fetchPrices(tokenList[i].address, tokenTwo.address)
        } else {
          setTokenTwo(tokenList[i]);
          fetchPrices(tokenOne.address, tokenList[i].address)
        }
        setIsOpen(false);
      }

      async function fetchDexSwap(){

        const allowance = await axios.get(`https://api.1inch.io/v5.0/1/approve/allowance?tokenAddress=${tokenOne.address}&walletAddress=${address}`)

        if(allowance.data.allowance === "0"){

            const approve = await axios.get(`https://api.1inch.io/v5.0/1/approve/transaction?tokenAddress=${tokenOne.address}`)
      
            setTxDetails(approve.data);
            console.log("not approved")
            return
      
          }
      
          const tx = await axios.get(
            `https://api.1inch.io/v5.0/1/swap?fromTokenAddress=${tokenOne.address}&toTokenAddress=${tokenTwo.address}&amount=${tokenOneAmount.padEnd(tokenOne.decimals+tokenOneAmount.length, '0')}&fromAddress=${address}&slippage=${slippage}`
          )
      
          let decimals = Number(`1E${tokenTwo.decimals}`)
          setTokenTwoAmount((Number(tx.data.toTokenAmount)/decimals).toFixed(2));
      
          setTxDetails(tx.data.tx);

      }

      useEffect(()=>{

        fetchPrices(tokenList[0].address, tokenList[1].address)
    
      }, [])

      useEffect(()=>{

        if(txDetails.to && isConnected){
          sendTransaction();
        }
    }, [txDetails])

    useEffect(()=>{

        messageApi.destroy();
    
        if(isLoading){
          messageApi.open({
            type: 'loading',
            content: 'Transaction is Pending...',
            duration: 0,
          })
        }    
    
      },[isLoading])
    
      useEffect(()=>{
        messageApi.destroy();
        if(isSuccess){
          messageApi.open({
            type: 'success',
            content: 'Transaction Successful',
            duration: 1.5,
          })
        }else if(txDetails.to){
          messageApi.open({
            type: 'error',
            content: 'Transaction Failed',
            duration: 1.50,
          })
        }
    
    
      },[isSuccess])

    const settings = (
        <>
          <div>Slippage Tolerance</div>
          <div>
            <Radio.Group value={slippage} onChange={handleSlippageChange}>
              <Radio.Button value={0.5}>0.5%</Radio.Button>
              <Radio.Button value={2.5}>2.5%</Radio.Button>
              <Radio.Button value={5}>5.0%</Radio.Button>
            </Radio.Group>
          </div>
        </>
      );

  return (
    <>
        <Modal
            open={isOpen}
            footer={null}
            onCancel={() => setIsOpen(false)}
            title="Select a token"
        >
            <div className="modalContent">
            {tokenList?.map((e, i) => {
                return (
                <div
                    className="tokenChoice"
                    key={i}
                    onClick={() => modifyToken(i)}
                >
                    <Image src={e.img} width={30} height={40} alt={e.ticker} className="tokenLogo" />
                    <div className="tokenChoiceNames">
                    <div className="tokenName">{e.name}</div>
                    <div className="tokenTicker">{e.ticker}</div>
                    </div>
                </div>
                );
            })}
            </div>
        </Modal>
        <div className="tradeBox">
            <div className="tradeBoxHeader">
                <h4>Swap</h4>
                <Popover
                    content={settings}
                    title="Settings"
                    trigger="click"
                    placement="bottomRight"
                >
                    <SettingOutlined className="cog" />
                </Popover>
            </div>
            <div className="inputs">
                <Input
                    placeholder="0"
                    value={tokenOneAmount}
                    onChange={changeAmount}
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
            <div className="swapButton" disabled={!tokenOneAmount || !isConnected} onClick={fetchDexSwap} >Swap</div>
        </div>
    </>
  )
}

export default Swap