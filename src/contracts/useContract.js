import { useWeb3React } from '@web3-react/core'
import { useMemo } from 'react'
import { ethers } from 'ethers'

import { abi as HEGIC_WBTC_OPTIONS_NFT_ABI } from './json/HegicERC20OptionsNFT.json'
import { abi as HEGIC_ETH_OPTIONS_NFT_ABI } from './json/HegicETHOptionsNFT.json'
import { abi as HEGIC_OPTIONS_WBTC_ABI } from './json/FakeHegicWBTCOptions.json'
import { abi as HEGIC_OPTIONS_ETH_ABI } from './json/FakeHegicETHOptions.json'
import { abi as HEGIC_BOT_ABI } from './json/HegicBot.json'
import { abi as HEGIC_ABI } from './json/FakeHEGIC.json'
import { abi as WBTC_ABI } from './json/FakeWBTC.json'
const AGGREGATORV3INTERFACE_ABI = [{"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"description","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint80","name":"_roundId","type":"uint80"}],"name":"getRoundData","outputs":[{"internalType":"uint80","name":"roundId","type":"uint80"},{"internalType":"int256","name":"answer","type":"int256"},{"internalType":"uint256","name":"startedAt","type":"uint256"},{"internalType":"uint256","name":"updatedAt","type":"uint256"},{"internalType":"uint80","name":"answeredInRound","type":"uint80"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"latestRoundData","outputs":[{"internalType":"uint80","name":"roundId","type":"uint80"},{"internalType":"int256","name":"answer","type":"int256"},{"internalType":"uint256","name":"startedAt","type":"uint256"},{"internalType":"uint256","name":"updatedAt","type":"uint256"},{"internalType":"uint80","name":"answeredInRound","type":"uint80"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"version","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"}];

//mainnet contracts
const ETHUSD_ADDRESS = "0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419";
const WBTCUSD_ADDRESS = "0xF4030086522a5bEEa4988F8cA5B36dbC97BeE88c";
const HEGIC_ETH_OPTIONS_NFT_ADDRESS = "0xE302E3083C2A04c90995E823b83B89925E0B8CD9";
const HEGIC_WBTC_OPTIONS_NFT_ADDRESS = "0x6da28Db16ecB33C2468FF934CD3A3447c588309A";
const HEGIC_OPTIONS_WBTC_ADDRESS = "0x3961245DB602eD7c03eECcda33eA3846bD8723BD";
const HEGIC_OPTIONS_ETH_ADDRESS = "0xEfC0eEAdC1132A12c9487d800112693bf49EcfA2";
const HEGIC_ADDRESS = '0x584bC13c7D411c00c01A62e8019472dE68768430';
const HEGIC_BOT_ADDRESS = '0x92C0aC795b70eD0cC8B923ca59aedc6CA564D12F';
const WBTC_ADDRESS = '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599';

//rinkeby contracts
// const ETHUSD_ADDRESS = "0x8A753747A1Fa494EC906cE90E9f37563A8AF630e";
// const WBTCUSD_ADDRESS = "0xECe365B379E1dD183B20fc5f022230C044d51404";
// const HEGIC_ETH_OPTIONS_NFT_ADDRESS = "0x230525E7ccF8e79127764b12888Da542D3309AD1";
// const HEGIC_WBTC_OPTIONS_NFT_ADDRESS = "0x3f910ca1093D5f31AA778fA355FA05280D2D0419";
// const HEGIC_OPTIONS_WBTC_ADDRESS = "0x3A97B5d06593AC649E25850Ab47121d96832041F";
// const HEGIC_OPTIONS_ETH_ADDRESS = "0xC5c5aF6Fc7afd67C1C6bE5b306CC9b59cbc77583";
// const HEGIC_ADDRESS = '0x584bC13c7D411c00c01A62e8019472dE68768430'
// const WBTC_ADDRESS = '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599'

// returns null on errors
function getContract(address, ABI, library, account) {
    return new ethers.Contract(address, ABI, library.getSigner(account))
}

function useContract(address, ABI, withSignerIfPossible = true) {
  const { library, account } = useWeb3React()

  return useMemo(() => {
    if (!address || !ABI || !library) return null
    try {
      return getContract(address, ABI, library, withSignerIfPossible && account ? account : undefined)
    } catch (error) {
      console.error('Failed to get contract', error)
      return null
    }
  }, [address, ABI, library, withSignerIfPossible, account])
} 

export function useHegicETHOptionsContract() {
  return useContract(HEGIC_OPTIONS_ETH_ADDRESS, HEGIC_OPTIONS_ETH_ABI);
}

export function useHegicWBTCOptionsContract() {
  return useContract(HEGIC_OPTIONS_WBTC_ADDRESS, HEGIC_OPTIONS_WBTC_ABI);
}

export function useHegicETHOptionsNFTContract() {
  return useContract(HEGIC_ETH_OPTIONS_NFT_ADDRESS, HEGIC_ETH_OPTIONS_NFT_ABI);
}

export function useHegicWBTCOptionsNFTContract() {
  return useContract(HEGIC_WBTC_OPTIONS_NFT_ADDRESS, HEGIC_WBTC_OPTIONS_NFT_ABI);
}

export function useHegicBotContract() {
  return useContract(HEGIC_BOT_ADDRESS, HEGIC_BOT_ABI);
}

export function useHegicContract() {
  return useContract(HEGIC_ADDRESS, HEGIC_ABI);
}

export function useWBTCContract() {
  return useContract(WBTC_ADDRESS, WBTC_ABI);
}

export function useWBTCUSDContract() {
  return useContract(WBTCUSD_ADDRESS, AGGREGATORV3INTERFACE_ABI);
}

export function useETHUSDContract() {
  return useContract(ETHUSD_ADDRESS, AGGREGATORV3INTERFACE_ABI);
}