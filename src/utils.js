import { ethers } from 'ethers'

const truncateEtherValue = (str, maxDecimalDigits) => {
    if (str.includes(".")) {
    const parts = str.split(".");
    return parts[0] + "." + parts[1].slice(0, maxDecimalDigits);
    }
    return str;
};

const formatBN = (bn) => {
    return ethers.utils.commify(ethers.utils.formatEther(bn.toString()));
}

const truncateAddress = (str) => {
    const len = str.length;
    return str.substring(0, 3) + '...' + str.substring(len-4, len-1);
}

const timeToMaturity = (expiration) => {
    if(!expiration) return 0;
    let seconds = expiration.toNumber() - new Date().getTime()/1000;
    if(seconds < 0) return "EXPIRED";
    const days = Math.floor(seconds / (3600*24));
    seconds  -= days*3600*24;
    const hrs   = Math.floor(seconds / 3600);
    seconds  -= hrs*3600;
    return days+'d '+hrs+'h';
}

const Asset = {Invalid: 0, WBTC: 1, ETH: 2}
const OptionType = {Invalid: 0, Put: 1, Call: 2}

export {
    truncateEtherValue,
    formatBN, 
    truncateAddress,
    Asset,
    OptionType,
    timeToMaturity
}