pragma solidity ^0.5.0;

contract Tether{
    // some static characteristic for the tether
    string public name = "Tether";
    string public symbol = "USDT";
    uint public totalSupply = 1000000000000000000000000;  // 1 million tokens
    uint public decimals = 18;
    
    // event to emit transfers
    // indexed allow us to filter through the addresses so we could search for them
    event Transfer(
        address indexed _from,
        address indexed _to,
        uint _value
    );

    // event to approve transfers
    event Approve(
        address indexed _owner,
        address indexed _spender,
        uint _value
    );

    // mapping to keep track of the account balances
    mapping (address => uint) public balances;
    // mapping to keep track of the allowance for each account
    mapping (address => mapping(address => uint)) public allowance;

    constructor() public{
        balances[msg.sender] = totalSupply;
    }

    // function to transfer funds
    function transfer(address _to, uint _value) public returns (bool success){
        // require the value to be transferred to be less than or equal to the account balance
        require(balances[msg.sender] >= _value);
        // transfer the amount and subtract the value from sender
        balances[msg.sender] -= _value;
        // add the balance to the receiver
        balances[_to] += _value;
        // emit the transfer event
        emit Transfer(msg.sender, _to, _value);
        return true;
    }

    // function to transfer our SibiCoin from one account to another
    function transferFrom(address _from, address _to, uint _value) public returns (bool success){
        require(balances[_from] >= _value);
        require(allowance[msg.sender][_from] >= _value);
        // transfer the amount and subtract the value from sender
        balances[_from] -= _value;
        // add the balance to the receiver
        balances[_to] += _value;
        // reflect the changes in allowance as transfer is done
        allowance[msg.sender][_from] -= _value;
        allowance[msg.sender][_to] += _value;
        // emit the transfer event
        emit Transfer(_from, _to, _value);
        return true;
    }

    // function to approve a transaction
    function approve(address _spender, uint _value) public returns (bool success){
        allowance[msg.sender][_spender] = _value;
        emit Approve(msg.sender, _spender, _value);
        return true;
    }

    
}