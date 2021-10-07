const RWD = artifacts.require("RWD");
const Tether = artifacts.require("Tether");
const DecentralBank = artifacts.require("DecentralBank");


module.exports = async function (deployer, network, accounts) {
    // Deploy Tether contract
    await deployer.deploy(Tether);
    // creating a deployed instance of Tether contract
    const tether = await Tether.deployed();

    // Deploy RWD contract
    await deployer.deploy(RWD);
    // for transferring rwd tokens to the DBank, creating a deployed instance of RWD contract
    const rwd = await RWD.deployed();

    // Deploy DecentralBank contract
    await deployer.deploy(DecentralBank, rwd.address, tether.address);
    // creating a deployed instance of RWD contract
    const decentralBank = await DecentralBank.deployed();

    // Transfer all rwd tokens into the central bank; await for it before it happens/wait till the process is complete
    await rwd.transfer(decentralBank.address, '1000000000000000000000000');

    // Distribute 100 Tether tokens to investor
    await tether.transfer(accounts[1], '100000000000000000000');

};

