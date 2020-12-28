import React, { useContext, useEffect, useState } from 'react';
import { Table } from 'reactstrap'
import { WalletContext } from '../../context/Wallet';
import OptionItem from './optionItem';

function OptionsList() {

    const wallet = useContext(WalletContext);
    const { account, library, chainId } = wallet.context;

    const [rows, setRows] = useState([
    ]);

    useEffect(() => {
        updateRows();
    }, [wallet.options])

    const updateRows = async () => {
        const optionItems = await Promise.all(wallet.options.hegic.value.map(async (o) => {
            return (
            <OptionItem
             key={o.index+'-'+o.provider}
             id={o.index}
             holder={o.holder}
             amount={o.amount}
             provider={o.provider}
             strike={o.strike}
             expiration={o.expiration} 
             optionType={o.optionType}
             state={o.state} />
            )
        }));

        if(optionItems.length == 0){
            optionItems.push(
                <tr key="noOptionsHegic" style={{textAlign:"center", width:'100%'}}>
                    <th>
                        <h6>No options found</h6>
                    </th>
                </tr>
            )
}
        setRows(optionItems)
    }

    if(wallet.options.hegic.value.length > 0){
        return (<Table style={{color: "white", fontSize:'12px', textAlign:'center'}}>
            <thead>
                <tr>
                    <th>#</th>
                    <th>Type</th>
                    <th>Size</th>
                    <th>Strike</th>
                    <th>Maturity</th>
                    <th>Tokenize</th>
                </tr>
            </thead>
            <tbody>
                {rows}
            </tbody>
        </Table>)
    } else {
        return (
            <span style={{margin:'25px', textAlign:'center', color:'#667fcc'}}>
                You have 0 Hegic options. <br></br>
                You can buy an already tokenized option here.
            </span>
        )
    }
}

export default OptionsList;