import React, { useContext } from 'react';
import { ethers } from 'ethers'
import { useHegicWBTCOptionsContract, useHegicWBTCOptionsNFTContract, useHegicETHOptionsNFTContract } from '../../contracts/useContract';
import { timeToMaturity, truncateEtherValue } from '../../utils'
import { UncontrolledTooltip } from 'reactstrap';
import { WalletContext } from '../../context/Wallet';
import { AppContext } from '../../context/App';

function OptionItem(props) {
    const app = useContext(AppContext)
    const wallet = useContext(WalletContext);
    const { account } = wallet.context;
    const wbtcOptions = useHegicWBTCOptionsContract();
    const wbtcNFTOptions = useHegicWBTCOptionsNFTContract();
    const ethNFTOptions = useHegicETHOptionsNFTContract();

    const id = props.id;
    const decimals = props.provider == wbtcOptions.address ? 8 : 18;
    const asset = props.provider == wbtcOptions.address ? "WBTC" : "ETH";
    const optionType = props.optionType == 1 ? "PUT" : "CALL";
    const nftProvider = props.provider == wbtcOptions.address ? wbtcNFTOptions : ethNFTOptions;

    const amount = ethers.utils.formatUnits(props.amount, decimals);
    const strike = ethers.utils.formatUnits(props.strike, 8);

    const tokenize = async (id) => {
        const txRequest = await nftProvider.tokenizeOption(id, account);
        await app.updateAndWait(app.updateStatusMsg, txRequest, "Tokenize");
        app.updateData();
    }

    return (
    <tr>
        <th scope="row">{asset+'['+id+']'}</th>
        <td>{optionType}</td>
        <td>{amount}</td>
        <td>${truncateEtherValue(strike, 2)}</td>
        <td>{timeToMaturity(props.expiration)}</td> 
        <td><a href="#" id="tokenizeLink" onClick={async () => await tokenize(id)}>TOKENIZE</a>
        <UncontrolledTooltip placement="right" target="tokenizeLink">
            You will need to transfer option's ownership to this contract AFTER tokenizing
      </UncontrolledTooltip></td>
    </tr>
    )
}

export default OptionItem;