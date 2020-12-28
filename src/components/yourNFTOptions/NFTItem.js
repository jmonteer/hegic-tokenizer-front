import React, { useState, useEffect, useContext } from 'react';
import { ethers } from 'ethers'
import { useHegicETHOptionsNFTContract, useHegicBotContract, useHegicWBTCOptionsNFTContract, useHegicWBTCOptionsContract, useHegicETHOptionsContract, useWBTCUSDContract, useETHUSDContract } from '../../contracts/useContract';
import { timeToMaturity, truncateEtherValue } from '../../utils'
import { WalletContext } from '../../context/Wallet';
import { AppContext } from '../../context/App';
import TransferModal from './modals/transferModal'
import ExerciseModal from './modals/exerciseModal'
import AutoExerciseModal from './modals/autoExerciseModal'
import DetokenizeModal from './modals/detokenizeModal'

function NFTItem(props) {
    const app = useContext(AppContext);
    const wallet = useContext(WalletContext);
    const {account} = wallet.context
    const wbtcNFTOptions = useHegicWBTCOptionsNFTContract();
    const ethNFTOptions = useHegicETHOptionsNFTContract();
    const wbtcOptions = useHegicWBTCOptionsContract();
    const ethOptions = useHegicETHOptionsContract();
    const ethusdPriceProvider = useETHUSDContract();
    const wbtcusdPriceProvider = useWBTCUSDContract();
    const hegicBot = useHegicBotContract();

    const tokenId = props.tokenId;
    
    const decimals = props.provider == wbtcNFTOptions.address ? 8 : 18;
    const asset = props.provider == wbtcNFTOptions.address ? "WBTC" : "ETH";
    const nftProvider = props.provider == wbtcNFTOptions.address ? wbtcNFTOptions : ethNFTOptions;
    const optionsProvider = props.provider == wbtcNFTOptions.address ? wbtcOptions : ethOptions;
    const priceProvider = props.provider == wbtcNFTOptions.address ?  wbtcusdPriceProvider : ethusdPriceProvider;

    const [underlyingOptionParams, setUnderlyingOptionParams] = useState();
    const [amount, setAmount] = useState();
    const [strike, setStrike] = useState();
    const [expiration, setExpiration] = useState();
    const [isValid, setIsValid] = useState(false);
    const [currentProfit, setCurrentProfit] = useState(0);
    const [currentPrice, setCurrentPrice] = useState(0);
    const [optionId, setOptionId] = useState(0);
    const [optionType, setOptionType] = useState(0);

    useEffect(() => {
        retrieveOptionParams(props.tokenId);
    }, [])

    useEffect(() => {
        getCurrentProfit();
    }, [underlyingOptionParams])

    const getCurrentProfit = async () => {
        if(underlyingOptionParams){
            const strike = underlyingOptionParams.strike.toNumber();
            const amount = ethers.utils.formatUnits(underlyingOptionParams.amount, decimals)
            const cp = await priceProvider.latestRoundData().then(x => x.answer.toNumber());
            const optionType = underlyingOptionParams.optionType == 1 ? "PUT" : "CALL";
            setCurrentPrice(cp);
            setOptionType(optionType);
            let profit = 0;
            console.log("optionType", optionType)
            if(optionType == "CALL") {
                profit = ((cp-strike)/cp)*amount;
            } else if (optionType == "PUT") {
                profit = (strike - cp)/cp*amount;
            }

            if(profit < 0) profit = 0;
    
            if(profit > underlyingOptionParams.lockedAmount)
                profit = underlyingOptionParams.lockedAmount;

            setCurrentProfit(profit);
        }
    }

    const retrieveOptionParams = async () => {
        const uop = await nftProvider.getUnderlyingOptionParams(tokenId);
        setUnderlyingOptionParams(uop);
        setAmount(ethers.utils.formatUnits(uop.amount, decimals));
        setOptionId(await nftProvider.getUnderlyingOptionId(tokenId).then(x=>x.toNumber()));
        setStrike(ethers.utils.formatUnits(uop.strike, 8));
        setExpiration(uop.expiration);
        setIsValid(uop.holder == nftProvider.address);
    }

    const transferOwnership = async () => {
        const optionId = await nftProvider.getUnderlyingOptionId(tokenId);
        const txRequest = await optionsProvider.transfer(optionId, nftProvider.address);
        await app.updateAndWait(app.updateStatusMsg, txRequest, "Transfer Ownership");

    }

    const [showTransferModal, setShowTransferModal] = useState(false);
    const [showExerciseModal, setShowExerciseModal] = useState(false);
    const [showAutoExerciseModal, setShowAutoExerciseModal] = useState(false);
    const [showDetokenizeModal, setShowDetokenizeModal] = useState(false);


    const toggleExercise = () => {
        setShowExerciseModal(!showExerciseModal);
    }

    const toggleAutoExercise = () => {
        setShowAutoExerciseModal(!showAutoExerciseModal);
    }

    const toggleSell = () => {
    }

    const toggleTransfer = () => {
        setShowTransferModal(!showTransferModal);
    }

    const toggleDetokenize = () => {
        setShowDetokenizeModal(!showDetokenizeModal);
    }

    return (
    <tr style={{textAlign:'center'}}>
        <th scope="row">{asset+'['+optionId+']'}</th>
        <td>{optionType}</td>
        <td>{amount}</td>
        <td>${truncateEtherValue(strike || '',2)}</td>
        <td>{expiration ? timeToMaturity(expiration):(null)}</td> 
        { 
            isValid ? 
                (<>
                <td><a href="#" onClick={toggleExercise}>EXERCISE</a></td>
                <td><a href="#" onClick={() => {}}>👀</a></td>
                <td><a href="#" onClick={() => {}}>👀</a></td>
                <td><a href="#" onClick={toggleTransfer}>TRANSFER</a></td>
                <td><a href="#" onClick={toggleDetokenize}>DETOKENIZE</a></td>
                </>) 
            :
                (<td><a href="#" onClick={async () => await transferOwnership(tokenId)}>TRANSFER OWNERSHIP</a></td>)
        }
        <TransferModal modal={showTransferModal} toggle={toggleTransfer} provider={props.provider}/>
        <DetokenizeModal modal={showDetokenizeModal} toggle={toggleDetokenize} tokenId={tokenId} provider={props.provider}/>
        <ExerciseModal modal={showExerciseModal} 
            toggle={toggleExercise}
            provider={props.provider}
            tokenId={tokenId}
            currentPrice={currentPrice}
            currentProfit={currentProfit}
            expiration={expiration}
        />
        <AutoExerciseModal modal={showAutoExerciseModal} 
            toggle={toggleAutoExercise}
            provider={props.provider}
            tokenId={tokenId}
            currentPrice={currentPrice}
            currentProfit={currentProfit}
            expiration={expiration}
        />
    </tr>
    )
}

export default NFTItem;