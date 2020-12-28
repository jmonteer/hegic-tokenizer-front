import React, { useContext, useState, useEffect } from 'react';
import { useHegicETHOptionsNFTContract, useHegicWBTCOptionsNFTContract } from '../../../contracts/useContract';
import { Row, Col, Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';
import { AppContext } from '../../../context/App';

function DetokenizeModal(props) {
    const tokenId = props.tokenId;
    const app = useContext(AppContext);

    const ethNFTOptions = useHegicETHOptionsNFTContract();
    const wbtcNFTOptions = useHegicWBTCOptionsNFTContract();
    
    const nftProvider = props.provider == wbtcNFTOptions.address ? wbtcNFTOptions : ethNFTOptions;

    const detokenize = async (burn) => {
        const txRequest = await nftProvider.detokenizeOption(props.tokenId, burn);
        await app.updateAndWait(app.updateStatusMsg, txRequest, "Detokenize Option");
    }
    
    return (
        <>
            <Modal isOpen={props.modal} toggle={props.toggle}>
            <ModalHeader><h4>Detokenize Option</h4></ModalHeader>
            <ModalBody>
                If you detokenize the option, the Hegic option will no longer be held by an ERC721 token, removing most of its functionality.
                The Hegic Option ownership will be transferred back to you from the ERC721 contract. You can always tokenize it again.
                <Row>
                    <Col md={{size:2}}>
                        <Button className="main-button" onClick={async () => await detokenize(false)}>DETOKENIZE</Button>
                    </Col>
                    <Col md={{size:8, offset: 2}}>
                        <Button className="main-button warning"  onClick={async () => await detokenize(true)}>DETOKENIZE AND BURN TOKEN</Button>
                    </Col>
                </Row>
            </ModalBody>
            <ModalFooter>
                    <Button className="secondary-button" onClick={props.toggle}>CLOSE</Button>
            </ModalFooter>
            </Modal>
        </>
    )
}

export default DetokenizeModal;