import React from 'react';
import {Row, Col} from 'reactstrap'
function Footer() {
    return (
        <div style={{height:'60px', position:'relative', color:'#defefe', textAlign:'center'}}>
            <Row style={{display:'flex', justifyContent:'middle', flexDirection:'row', verticalAlign:'center'}}>
                <Col md={{size:2, offset:3}}>
                    <a href="https://jmonteer.medium.com/" target="_blank">About</a>
                </Col>
                <Col md={{size:2}}>
                    By <a href="https://twitter.com/jmonteer23" target="_blank">@jmonteer23</a>
                </Col>
                <Col md={{size:2}}>
                    <a href="https://twitter.com/messages/compose?recipient_id=1302979429820502016" target="_blank">Feedback</a>
                </Col>
            </Row>
        </div>
    )
}

export default Footer;