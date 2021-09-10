pragma solidity ^0.5.0;

contract Migrations{
    address public owner;
    uint public last_completed_migration;   // keep track of each migration

    constructor() public{
        owner = msg.sender; // the currently connected account to the migrations
    }

    // modifier to check if the current contract caller is the owner who deployed the contract
    modifier restricted() {
        if (msg.sender == owner){
            _;
        }
    }

    // only the owner can run this function, every last completed migration is set to completed which is the uint in this function
    function setCompleted(uint completed) public restricted{
        last_completed_migration = completed;
    }

    // function to update/upgrade to the new address that runs this contract
    function upgrade(address new_address) public restricted{
        Migrations upgraded = Migrations(new_address);
        upgraded.setCompleted(last_completed_migration);
    }
}