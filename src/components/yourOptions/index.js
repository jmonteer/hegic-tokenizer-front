import React from 'react';
import {Card} from 'reactstrap'
import OptionsList from './optionsList';

function YourOptions() {
    return (
        <Card body style={{padding:'15px', minHeight:'250px'}}>
            <h3>Your Hegic options</h3>
            <span>Here you will find your regular Hegic options. </span>
            <OptionsList />
        </Card>
    )
}

export default YourOptions;