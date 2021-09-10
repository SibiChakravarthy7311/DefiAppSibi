pragma solidity ^0.5.0;

import './RWD.sol';
import './Tether.sol';

contract DecentralBank{
    string public name = "Sibi Decentral Bank";
    address public owner;
    Tether public tether;
    RWD public rwd;
    
    // wiring the smart contracts to each other using solidity language
    constructor(RWD _rwd, Tether _tether) public{
        tether = _tether;
        rwd = _rwd;
        owner = msg.sender;
    }

    
}