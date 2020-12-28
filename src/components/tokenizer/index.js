import React, { useState } from 'react';
import { Button, Modal, ModalBody, ModalHeader, ModalFooter } from 'reactstrap';
import OptionsList from '../yourOptions/optionsList';

function Tokenizer() {
    const [showTokenizerModal, setShowTokenizerModal] = useState(false);

    const toggleTokenizer = () => {
        setShowTokenizerModal(!showTokenizerModal);
    }

    return (
        <>
            <Button className="main-button" onClick={toggleTokenizer}>TOKENIZE OPTIONS</Button>
            <TokenizerModal modal={showTokenizerModal} toggle={toggleTokenizer} />
        </>
    )
}

function TokenizerModal(props) {
    
    return (
        <Modal isOpen={props.modal} toggle={props.toggle}>
        <ModalHeader><h4>Tokenize your Hegic Options</h4></ModalHeader>
        <ModalBody>
            <span>
                Here you will see your options purchased at Hegic.co<br></br>
                Clicking tokenize will mint an ERC721 token. In order for it to be valid, you need to transfer option's ownership to that token.<br></br>
            </span>
            <OptionsList></OptionsList>
        </ModalBody>
        <ModalFooter>
                <Button className="secondary-button" onClick={props.toggle}>CLOSE</Button>
        </ModalFooter>
        </Modal>
    )
}

export default Tokenizer;