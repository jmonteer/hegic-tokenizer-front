import React, { useContext, useEffect, useState } from 'react';
import { Table } from 'reactstrap'
import { WalletContext } from '../../context/Wallet';
import NFTItem from './NFTItem';

function NFTList() {

    const wallet = useContext(WalletContext);
    const { account, library, chainId } = wallet.context;

    const [rows, setRows] = useState([
    ]);

    useEffect(() => {
        updateRows();
    }, [wallet.options])

    const updateRows = async () => {
        const optionItems = await Promise.all(wallet.options.nft.value.map(async (o) => {
            return (
            <NFTItem
             key={o.index+'-'+o.provider}
             id={o.index}
             provider={o.provider}
             tokenId={o.tokenId} />
            )
        }));

        if(optionItems.length == 0)
            optionItems.push(
                <tr key="noOptionsNFT" style={{textAlign:"center", width:'100%'}}>
                    <th>
                        <h6>No options found</h6>
                    </th>
                </tr>
            )
        setRows(optionItems)
    }
    if(wallet.options.nft.value.length != 0) {
        return (<Table style={{color: "white", fontSize:'12px'}}>
        <thead >
            <tr style={{textAlign:'center'}}>
                <th>#</th>
                <th>Type</th>
                <th>Size</th>
                <th>Strike</th>
                <th>Expires in</th>
                <th>Exercise</th>
                <th>Auto-exerciser</th>
                <th>Sell</th>
                <th>Transfer</th>
                <th>Detokenize</th>
            </tr>
        </thead>
        <tbody>
            {rows}
        </tbody>
    </Table>)
    } else {
        return <span style={{margin:'25px', textAlign:'center', color:'#667fcc'}}>You have 0 tokenized options.<br/> Start by buying a tokenized option or tokenize one you already own.</span>
    }
    
}

export default NFTList;