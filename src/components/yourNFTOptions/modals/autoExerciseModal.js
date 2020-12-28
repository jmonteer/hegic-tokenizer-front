import React, { useContext, useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { useHegicBotContract, useHegicETHOptionsNFTContract, useHegicWBTCOptionsNFTContract } from '../../../contracts/useContract';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, InputGroup, InputGroupAddon, InputGroupText, Input } from 'reactstrap';
import { AppContext } from '../../../context/App';
import { timeToMaturity } from '../../../utils';
import { Alert } from 'reactstrap';
import { WalletContext } from '../../../context/Wallet';
import { truncateEtherValue } from '../../../utils';

function AutoExerciseModal(props) {
    const app = useContext(AppContext);
    const wallet = useContext(WalletContext);
    const {account} = wallet.context;

    const hegicBot = useHegicBotContract();
    const ethNFTOptions = useHegicETHOptionsNFTContract();
    const wbtcNFTOptions = useHegicWBTCOptionsNFTContract();
    
    const asset = props.provider == wbtcNFTOptions.address ? "WBTC" : "ETH";
    const nftProvider = props.provider == wbtcNFTOptions.address ? wbtcNFTOptions : ethNFTOptions;

    const [autoExerciseButtonDisabled, setAutoExerciseButtonDisabled] = useState(true);
    const [hegicBotApproved, setHegicBotApproved] = useState(false);
    const [targetPrice, setTargetPrice] = useState();

    useEffect(() => {
        setAutoExerciseButtonDisabled(false);
        checkHegicBotApproved();
        
    }, []);

    const checkHegicBotApproved = async () => {
        setHegicBotApproved(await nftProvider.isApprovedForAll(account, hegicBot.address));
    }

    const addToAutoExercise = async () => {
        const txRequest = await hegicBot.track(props.tokenId, ethers.utils.parseUnits(targetPrice, 8));
        await app.updateAndWait(app.updateStatusMsg, txRequest, "Add to auto-exercise");
    }

    const approveOperator = async () => {
        const txRequest = await nftProvider.setApprovalForAll(hegicBot.address, true);
        await app.updateAndWait(app.updateStatusMsg, txRequest, "Approve");
    }
    
    return (
        <>
            <Modal isOpen={props.modal} toggle={props.toggle}>
            <ModalHeader><h4>Auto-exerciser</h4><h6>by @macarse and @jmonteer23</h6></ModalHeader>
            <ModalBody>
                Set a target price and your option will be exercised when that price is reached.
                <br></br>
                1. Approve Hegic Bot as operator of your options
                <br></br>
                2. Input a target price at which the option will be exercised
                <br></br>
                3. Press "Track"
                <br></br>
                { hegicBotApproved ? 
                    ( null )
                     : 
                    (<Alert style={{textAlign:"center"}} color="info">
                        You need to approve the Hegic Bot to operate your options.<br></br>
                        <Button className="main-button" onClick={async () => await approveOperator(false)}>APPROVE</Button>
                    </Alert>)
                }
                <InputGroup size="sm">
                    <InputGroupAddon addonType="prepend">
                        <InputGroupText style={{minWidth:'150px'}}>EXPIRES IN</InputGroupText>
                    </InputGroupAddon>  
                    <Input value={timeToMaturity(props.expiration)} disabled />
                </InputGroup>
                <InputGroup size="sm">
                    <InputGroupAddon addonType="prepend">
                        <InputGroupText style={{minWidth:'150px'}}>{asset} PRICE (USD)</InputGroupText>
                    </InputGroupAddon>  
                    <Input value={truncateEtherValue((props.currentPrice/1e8).toString(), 2)} disabled />
                </InputGroup>
                <InputGroup size="sm">
                    <InputGroupAddon addonType="prepend">
                        <InputGroupText style={{minWidth:'150px'}}>TARGET PRICE (USD)</InputGroupText>
                    </InputGroupAddon>  
                    <Input placeholder='0' value={targetPrice} onChange={(event) => setTargetPrice(event.target.value)} />
                </InputGroup>
                {
                    targetPrice > 0 ?
                    (
                        <span style={{marginTop:"10px"}}>
                            Your option will be exercised when {asset} spot price reaches ${truncateEtherValue((targetPrice.toString()), 2)}.
                            <br />
                            Your P&L will be 0.15{asset}
                        </span>
                    ) : (null)
                }
                <Button size="sm" className="main-button" id="autoExerciseButton" style={{height:'100%', width:'100%'}} disabled = {autoExerciseButtonDisabled} onClick={async () => await addToAutoExercise()}>TRACK</Button>
                <span className='modalDescription'>
                    Cost of keep3r (10% of gas fees) + 1% performance fee applies.
                </span>
            </ModalBody>
            <ModalFooter>
                    <Button className="secondary-button" onClick={props.toggle}>CLOSE</Button>
            </ModalFooter>
            </Modal>
        </>
    )
}

export default AutoExerciseModal;