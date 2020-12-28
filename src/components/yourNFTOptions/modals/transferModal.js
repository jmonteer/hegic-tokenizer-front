import React, { useContext, useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { useHegicETHOptionsNFTContract, useHegicWBTCOptionsNFTContract } from '../../../contracts/useContract';
import { Row, Col, Modal, ModalHeader, ModalBody, ModalFooter, Button, InputGroup, InputGroupAddon, InputGroupText, Input } from 'reactstrap';
import { AppContext } from '../../../context/App';
import { WalletContext } from '../../../context/Wallet';

function TransferModal(props) {
    const tokenId = props.tokenId;
    const app = useContext(AppContext);
    const wallet = useContext(WalletContext);
    const {account} = wallet.context;

    const ethNFTOptions = useHegicETHOptionsNFTContract();
    const wbtcNFTOptions = useHegicWBTCOptionsNFTContract();
    
    const asset = props.provider == wbtcNFTOptions.address ? "WBTC" : "ETH";
    const nftProvider = props.provider == wbtcNFTOptions.address ? wbtcNFTOptions : ethNFTOptions;

    const [transferButtonDisabled, setTransferButtonDisabled] = useState(true);
    const [destinationAddress, setDestinationAddress] = useState('');

    useEffect(() => {
        setTransferButtonDisabled(!ethers.utils.isAddress(destinationAddress))
    }, [destinationAddress]);

    const transferToken = async () => {
        const txRequest = await nftProvider.transferFrom(account, destinationAddress, tokenId);
        await app.updateAndWait(app.updateStatusMsg, txRequest, "Transfer Token");
    }
    
    return (
        <>
            <Modal isOpen={props.modal} toggle={props.toggle}>
            <ModalHeader><h4>Transfer Option</h4></ModalHeader>
            <ModalBody>
                This will transfer the token holding the option to the receiver's address.
                        <InputGroup size="sm">
                            <InputGroupAddon addonType="prepend">
                                <InputGroupText>RECEIVER</InputGroupText>
                            </InputGroupAddon>  
                                <Input placeholder="0x0000000000000000000000000000000000000000" value={destinationAddress} onChange={(event) => setDestinationAddress(event.target.value)} />
                        </InputGroup>
                        <Button size="sm" className="main-button" style={{height:'100%', width:'100%'}} disabled={transferButtonDisabled} onClick={async () => transferToken()}>TRANSFER</Button>
            </ModalBody>
            <ModalFooter>
                    <Button className="secondary-button" onClick={props.toggle}>CLOSE</Button>
            </ModalFooter>
            </Modal>
        </>
    )
}

export default TransferModal;