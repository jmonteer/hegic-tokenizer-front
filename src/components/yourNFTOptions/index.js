import React from 'react';
import {Card, Row, Col} from 'reactstrap'
import NFTList from './NFTList';
import Tokenizer from '../tokenizer';
import OptionSeller from '../optionSeller';

function YourNFTOptions() {
    return (
        <Card body style={{padding:'15px', minHeight:'250px'}}>
            <h3 style={{color:'#45fff4'}}>Your options portfolio</h3>
            <span>
                Manage your tokenized options: exercise, transfer or detokenize your options
            </span>
            <NFTList />
            <div style={{marginTop:'15px', textAlign:'center'}}>
                <h6>Get more tokenized options</h6>
                <Row>
                    <Col md={{offset:3, size: 3}} style={{padding:"10px", textAlign:'center'}}>
                        <Tokenizer/>
                    </Col>
                    <Col md={{size: 3}} style={{padding:"10px", textAlign:'center'}}>
                        <OptionSeller/>
                    </Col>
                </Row>
            </div>
            
        </Card>
    )
}

export default YourNFTOptions;