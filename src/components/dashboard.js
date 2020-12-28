import React from 'react'
import { Container, Row, Col } from 'reactstrap'
import YourNFTOptions from './yourNFTOptions/index';
import Tokenizer from './tokenizer';
import OptionSeller from './optionSeller';



function Dashboard() {
  return (
    <Container style={{minHeight:'100%', paddingBottom:'60px', marginTop:'-58px', paddingTop:'58px', marginBottom:'-60px'}}>
      <Row style={{marginTop:'20px'}}>
        <Col md={{offset:1, size: 10}} style={{padding:"10px"}}>
          <YourNFTOptions/>
        </Col>
      </Row>
    </Container>
  );
}

export default Dashboard;