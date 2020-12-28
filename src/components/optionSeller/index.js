import React, { useEffect, useState, useContext } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, InputGroup, InputGroupAddon, InputGroupText, Input } from 'reactstrap';
import { useETHUSDContract, useWBTCUSDContract, useHegicETHOptionsNFTContract, useHegicWBTCOptionsNFTContract } from '../../contracts/useContract'
import { truncateEtherValue } from '../../utils'
import { ethers } from 'ethers'

import { AppContext } from '../../context/App';
import { WalletContext } from '../../context/Wallet';

function OptionSeller() {
    const [showOptionSellerModal, setShowOptionSellerModal] = useState(false);

    const toggleOptionSeller = () => {
        setShowOptionSellerModal(!showOptionSellerModal);
    }

    return (
        <>
            <Button className="main-button" onClick={toggleOptionSeller}>BUY OPTIONS</Button>
            <OptionSellerModal modal={showOptionSellerModal} toggle={toggleOptionSeller} />
        </>
    )
}

function OptionSellerModal(props) {
    const app = useContext(AppContext);
    const wallet = useContext(WalletContext);
    const {account} = wallet.context;

    const ethusdPriceProvider = useETHUSDContract();
    const wbtcusdPriceProvider = useWBTCUSDContract();
    const ethNFTOptions = useHegicETHOptionsNFTContract();
    const wbtcNFTOptions = useHegicWBTCOptionsNFTContract();

    const [asset, setAsset] = useState('ETH');
    const [strike, setStrike] = useState();
    const [optionType, setOptionType] = useState('PUT');
    const [size, setSize] = useState(1);
    const [period, setPeriod] = useState(86400);
    const [priceProvider, setPriceProvider] = useState(ethusdPriceProvider);
    const [optionCost, setOptionCost] = useState();
    const [isBuyButtonDisabled, setIsBuyButtonDisabled] = useState(true);
    useEffect(() => {
        if(asset == 'ETH') setPriceProvider(ethusdPriceProvider);
        else setPriceProvider(wbtcusdPriceProvider);

        updateCurrentPrice();
    }, [asset]);

    useEffect(() => {
        if(!!asset && !!optionType && !!size && !!strike && !!period)
            getOptionCost();
        else setOptionCost()
    }, [asset, optionType, size, strike, period])

    useEffect(() => {
            setIsBuyButtonDisabled(!optionCost);
    }, [optionCost])

    const updateCurrentPrice = async () => {
        const cp = await priceProvider.latestRoundData();
        setStrike(truncateEtherValue(ethers.utils.formatUnits(cp.answer, 8),2));
    }

    const getOptionCost = async () => {
        const _optionsProvider = asset == 'ETH' ? ethNFTOptions : wbtcNFTOptions;
        const _optionType = optionType == 'PUT' ? ethers.BigNumber.from('1') : ethers.BigNumber.from('2');
        const decimals = asset == 'ETH' ? 18 : 8;
        const _size = ethers.utils.parseUnits(size.toString(), decimals);
        const _strike = ethers.utils.parseUnits(strike.toString(), 8);
        const _period = ethers.BigNumber.from(period.toString());

        setOptionCost(await _optionsProvider.getOptionCostETH(_period, _size, _strike, _optionType));
    }

    const buyOption = async () => {
        const _optionsProvider = asset == 'ETH' ? ethNFTOptions : wbtcNFTOptions;
        const _optionType = optionType == 'PUT' ? ethers.BigNumber.from('1') : ethers.BigNumber.from('2');
        const decimals = asset == 'ETH' ? 18 : 8;
        const _size = ethers.utils.parseUnits(size.toString(), decimals);
        const _strike = ethers.utils.parseUnits(strike.toString(), 8);
        const _period = ethers.BigNumber.from(period.toString());

        const txRequest = await _optionsProvider.createOption(_period, _size, _strike, _optionType, account, {from: account, value:optionCost});
        await app.updateAndWait(app.updateStatusMsg, txRequest, "Buy Option");

    }

    return (
        <Modal isOpen={props.modal} toggle={props.toggle}>
        <ModalHeader><h4>Buy your tokenized Hegic option </h4></ModalHeader>
        <ModalBody>
            <InputGroup size="sm">
                    <InputGroupAddon addonType="prepend">
                        <InputGroupText style={{minWidth:'150px'}}>ASSET</InputGroupText>
                    </InputGroupAddon>  
                    <Input type="select" placeholder='0' value={asset} onChange={(event) => setAsset(event.target.value)}>
                        <option>ETH</option>
                        {/* <option>WBTC</option> */}
                    </Input>
            </InputGroup>
            <InputGroup size="sm">
                    <InputGroupAddon addonType="prepend">
                        <InputGroupText style={{minWidth:'150px'}}>OPTION TYPE</InputGroupText>
                    </InputGroupAddon>  
                    <Input type="select" placeholder='0' value={optionType} onChange={(event) => setOptionType(event.target.value)}>
                        <option>PUT</option>
                        <option>CALL</option>
                    </Input>
            </InputGroup>
            <InputGroup size="sm">
                    <InputGroupAddon addonType="prepend">
                        <InputGroupText style={{minWidth:'150px'}}>SIZE ({asset})</InputGroupText>
                    </InputGroupAddon>  
                    <Input placeholder='0' value={size} onChange={(event) => setSize(event.target.value)} />
            </InputGroup>
            <InputGroup size="sm">
                    <InputGroupAddon addonType="prepend">
                        <InputGroupText style={{minWidth:'150px'}}>STRIKE (USD)</InputGroupText>
                    </InputGroupAddon>  
                    <Input placeholder='' value={strike} onChange={(event) => setStrike(event.target.value)} />
            </InputGroup>
            <InputGroup size="sm">
                    <InputGroupAddon addonType="prepend">
                        <InputGroupText style={{minWidth:'150px'}}>PERIOD</InputGroupText>
                    </InputGroupAddon>  
                    <Input type="select" placeholder='0' value={period} onChange={(event) => setPeriod(event.target.value)}>
                        <option value="86400">1 DAY</option>
                        <option value="604800">1 WEEK (7 DAYS)</option>
                        <option value="1209600">2 WEEKS (14 DAYS)</option>
                        <option value="1814400">3 WEEKS (21 DAYS)</option>
                        <option value="2419200">4 WEEKS (28 DAYS)</option>
                    </Input>            
            </InputGroup>
            { optionCost ? 
                (<span>
                    Your option cost: {truncateEtherValue(ethers.utils.formatEther(optionCost),4)}ETH
                </span>) : (null)
            }   
            <Button size="sm" className="main-button" id="autoExerciseButton" style={{height:'100%', width:'100%'}} onClick={buyOption} disabled={isBuyButtonDisabled}>BUY OPTION</Button>
        </ModalBody>
        <ModalFooter>
                <Button className="secondary-button" onClick={props.toggle}>CLOSE</Button>
        </ModalFooter>
        </Modal>
    )
}

export default OptionSeller;