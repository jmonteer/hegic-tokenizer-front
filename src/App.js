import React, { useState, useEffect, useContext } from 'react';
import Dashboard from './components/dashboard';
import Header from './components/header'
import Intro from './components/intro'
import Footer from './components/footer'
import {Alert} from 'reactstrap'
import { useWeb3React, Web3ReactProvider } from '@web3-react/core'
import { ethers } from 'ethers';
import { useEagerConnect, useInactiveListener } from './hooks'
import { injected } from './connectors';
import { WalletContext } from './context/Wallet';
import { AppContext } from './context/App';
import StatusMsg from './components/statusMsg';

function getLibrary(provider, connector) {
  return new ethers.providers.Web3Provider(provider)
}

function App() {
  const [ETHBalance, setETHBalance] = useState(ethers.BigNumber.from('0'));
  const [HEGICBalance, setHEGICBalance] = useState(ethers.BigNumber.from('0'));
  const [HEGICAllowance, setHEGICAllowance] = useState(ethers.BigNumber.from('0'));
  const [myOptions, setMyOptions] = useState([]);
  const [myNFT, setMyNFT] = useState([])
  const [statusMsg, setStatusMsg] = useState("");
  const [statusMsgTitle, setStatusMsgTitle] = useState("");
  const [reload, setReload] = useState(true);

  const balances = {
    ETHBalance: {value: ETHBalance, setValue: setETHBalance},
    HEGICBalance: {value: HEGICBalance, setValue: setHEGICBalance},
  }

  const allowances = {
    HEGICAllowance: {value: HEGICAllowance, setValue: setHEGICAllowance}
  }

  const options = {
    hegic: { value: myOptions, setValue: setMyOptions },
    nft: { value: myNFT, setValue: setMyNFT }
  }

  const context = useWeb3React()
  const { connector, active, activate, deactivate } = context
  
  // handle logic to recognize the connector currently being activated
  const [activatingConnector, setActivatingConnector] = useState()
  useEffect(() => {
  if (activatingConnector && activatingConnector === connector) {
      setActivatingConnector(undefined)
  }
  }, [activatingConnector, connector])
  
  // handle logic to eagerly connect to the injected ethereum provider, if it exists and has granted access already
  const triedEager = useEagerConnect()
  
  // handle logic to connect in reaction to certain events on the injected ethereum provider, if it exists
  useInactiveListener(!triedEager || !!activatingConnector)
  
  function connect() {
      setActivatingConnector(injected)
      activate(injected)
  }
  
  function disconnect() {
  deactivate(injected)
  }

  const updateData = () => setReload(!reload);

  const updateStatusMsg = (title, message) => {
    setStatusMsgTitle(title);
    setStatusMsg(message);
  }
  const updateAndWait = async (updateStatusMsg, txRequest, from) => {
    const title = (<bold>{from}: Pending transaction </bold>)
    const message = (
      <>
        <a target='_blank' href={`https://etherscan.io/tx/${txRequest.hash}`}>
          See in etherscan
        </a>
      </>
    )
    updateStatusMsg(title, message);
    await txRequest.wait();
    updateStatusMsg("", "");
    updateData();
  }

  return (
    <AppContext.Provider value={{statusMsgTitle, statusMsg, updateStatusMsg, updateAndWait, reload, updateData}}>
      <WalletContext.Provider value={{context, connect, disconnect, balances, allowances, options}}>
        <div style={{ background:'radial-gradient(68.28% 53.52% at 50% 50%, #1c2a4f 0%, #111b35 100%)'}}>
            <div style={{backgroundImage:'url(https://www.hegic.co/assets/img/background-image.svg)', height:'100vh'}}>
                <Header />
                <Alert color="warning" style={{textAlign:'center', margin:'20px'}}>BETA: Only working for ETH options at the moment</Alert>
                { active ? (
                  <Dashboard />
                ) : (
                  <Intro />
                )}
                {/* <Stats /> */}
                <Footer />
                <StatusMsg></StatusMsg>
            </div>
        </div>
      </WalletContext.Provider>
  </AppContext.Provider>
  );
}


export default () => (
  <Web3ReactProvider getLibrary={getLibrary}>
    <App />
  </Web3ReactProvider>
)
