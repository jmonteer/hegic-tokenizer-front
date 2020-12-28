import React, { useContext, useState, useEffect } from 'react';
import { useHegicETHOptionsNFTContract, useHegicWBTCOptionsNFTContract } from '../../../contracts/useContract';
import { Row, Col, Modal, ModalHeader, ModalBody, ModalFooter, Button, InputGroup, InputGroupAddon, InputGroupText, Input } from 'reactstrap';
import { AppContext } from '../../../context/App';
import { timeToMaturity, truncateEtherValue } from '../../../utils';
import { ethers } from 'ethers';

function ExerciseModal(props) {
    const app = useContext(AppContext);

    const ethNFTOptions = useHegicETHOptionsNFTContract();
    const wbtcNFTOptions = useHegicWBTCOptionsNFTContract();
    
    const asset = props.provider == wbtcNFTOptions.address ? "WBTC" : "ETH";
    const nftProvider = props.provider == wbtcNFTOptions.address ? wbtcNFTOptions : ethNFTOptions;

    const [exerciseButtonDisabled, setExerciseButtonDisabled] = useState(props.currentProfit <= 0);

    const exercise = async () => {
        const txRequest = await nftProvider.exerciseOption(props.tokenId);
        props.toggle()
        await app.updateAndWait(app.updateStatusMsg, txRequest, "Exercise Option");

    }
    
    useEffect(() => {
        setExerciseButtonDisabled(props.currentProfit <= 0);
    }, [props.currentProfit])

    return (
        <>
            <Modal isOpen={props.modal} toggle={props.toggle}>
            <ModalHeader><h4>Exercise Option</h4></ModalHeader>
            <ModalBody>
                Once you exercise the option, you will realize its P&L.
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
                        <InputGroupText style={{minWidth:'150px'}}>CURRENT P&L ({asset})</InputGroupText>
                    </InputGroupAddon>  
                    <Input value={truncateEtherValue(props.currentProfit.toString(), 4)} disabled />
                </InputGroup>
                <Button size="sm" className="main-button" id="exerciseButton" style={{height:'100%', width:'100%'}} disabled = {exerciseButtonDisabled} onClick={async () => await exercise()}>EXERCISE</Button>
            </ModalBody>
            <ModalFooter>
                    <Button className="secondary-button" onClick={props.toggle}>CLOSE</Button>
            </ModalFooter>
            </Modal>
        </>
    )
}

export default ExerciseModal;