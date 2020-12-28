import React, { useEffect, useContext } from 'react'
// import { useWeb3React } from '@web3-react/core'
import { Badge, Button, Col, Navbar} from 'reactstrap';
import { truncateAddress, truncateEtherValue, formatBN } from '../utils'
import { WalletContext } from '../context/Wallet'
import { useHegicETHOptionsContract, useHegicWBTCOptionsContract, useHegicETHOptionsNFTContract, useHegicWBTCOptionsNFTContract } from '../contracts/useContract';
import { AppContext } from '../context/App';

function Header(props) {
    const app = useContext(AppContext)
    const wallet = useContext(WalletContext);
    const { account, library, chainId, active } = wallet.context;

    const nftETHOptions = useHegicETHOptionsNFTContract();
    const nftWBTCOptions = useHegicWBTCOptionsNFTContract();
    const ethOptions = useHegicETHOptionsContract();
    const wbtcOptions = useHegicWBTCOptionsContract();

    const updateMyOptions = async () => {
        const myOptions = []
        const alreadyInOptionIds = [];

        // const optionProviders = [ethOptions, wbtcOptions];
        const optionProviders = [ethOptions];
        for(const op of optionProviders) {
            const filter = op.filters.Create(null, account);
            const events = await op.queryFilter(filter);
            await Promise.all(events.map(async (x) => {
                const option = await op.options(x.args.id);
                // console.log("Expiration: ", option.expiration.toNumber())
                // console.log("Now: ", new Date().getTime()/1000)
                // console.log("Id", x.args.id.toNumber(), "result: ", option.expiration.toNumber() >= new Date().getTime()/1000)
                if(option.holder == account && !alreadyInOptionIds.includes(x.args.id.toNumber()) && option.state == 1 && option.expiration.toNumber() >= new Date().getTime()/1000){
                    myOptions.push({index: x.args.id.toNumber(), provider: op.address , ...option})
                    alreadyInOptionIds.push(x.args.id.toNumber())
                }
            }))
        }

        // detokenized options: options created using NFT contract but that are now owned by the user
        const nftOptionProviders = [nftETHOptions, nftWBTCOptions];
        for(const nop of nftOptionProviders) {
            const filter2 = nop.filters.Detokenized(account, null);
            const events2 = await nop.queryFilter(filter2);
            await Promise.all(events2.map(async (x) => {
                const op = await nop.optionsProvider();
                const option = await nop.getUnderlyingOptionParams(x.args.tokenId);
                const optionId = await nop.getUnderlyingOptionId(x.args.tokenId);
                if(option.holder == account && !alreadyInOptionIds.includes(optionId.toNumber()) && option.state == 1 && option.expiration.toNumber() >= new Date().getTime()/1000){
                    myOptions.push({index: optionId.toNumber(), provider: op , ...option})
                    alreadyInOptionIds.push(optionId.toNumber())
                }
            }))       
         }
        wallet.options.hegic.setValue(myOptions);
    }

    const updateMyNFTOptions = async () => {
        const myNFTOptions = [];
        const nftProviders = [nftETHOptions, nftWBTCOptions];
        let index = 0;
        for(const np of nftProviders){
            const ownedTokens = await np.balanceOf(account).then(x => x.toNumber());
            while(index < ownedTokens){
                try {
                    myNFTOptions.push({index, provider: np.address, tokenId: await np.tokenOfOwnerByIndex(account, index)});
                    index++;
                }catch(error){
                    break;
                }
            }
            index = 0;
        }
        console.log(myNFTOptions)
        wallet.options.nft.setValue(myNFTOptions);
    }

    useEffect(() => {
        if(!!account && !!library && app.reload) {
            library.getBalance(account).then((balance) => {
                wallet.balances.ETHBalance.setValue(balance)
            });

            updateMyOptions();

            updateMyNFTOptions();
            app.updateData();
        }
    }, [account, library, chainId, app.reload])

    const Wallet = () => {
        return (
            <>
                <Col sm='0' md={{size:2, offset:5}} style={{display:'flex', justifyContent:'center'}}>
                    <h3 style={{color:'#45fff4', zIndex:'99', fontFamily:'Jura', fontWeight:'bold'}}>HEGIC<span style={{color:"white"}}>:TOKENIZER</span></h3>
                </Col>
                <Col sm='12' md={{size:5, offset:0}} style={{display:'flex', justifyContent:'flex-end'}}>
                { active ? (
                    <div>
                        <Badge color="primary" style={{margin:"2.5px"}}>{truncateEtherValue(formatBN(wallet.balances.HEGICBalance.value),2)} HEGIC </Badge>
                        <Badge color="secondary" style={{margin:"2.5px"}}>{truncateEtherValue(formatBN(wallet.balances.ETHBalance.value),4)} ETH </Badge>
                        <span style={{color:'#defefe', fontSize:'12px'}}>{truncateAddress(account)}</span>
                        <Button color="link" onClick={wallet.disconnect}>Disconnect</Button>
                    </div>
                ) : (
                    <Button color="link" onClick={wallet.connect}>Connect</Button>
                )}
                </Col>
            </>
        )
    }
    
    return (
            <Navbar style={{display:'flex', backgroundColor:'#19274d', borderBottom: '1px solid #45fff4'}}>
                <Wallet />
            </Navbar>
    );
}

export default Header;