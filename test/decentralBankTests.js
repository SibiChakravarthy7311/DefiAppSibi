// two extensions to act as frameworks for running our tests - Mocha(popular testing framework) and Chai
// to test, bring in the artifacts
const RWD = artifacts.require("RWD");
const Tether = artifacts.require("Tether");
const DecentralBank = artifacts.require("DecentralBank");

// to bring in the library chai; chai-as-promised is an extension so that we can use chai with promised and we need not handle it
// should allows us to include arbitrary assertion messages and format the output similar to python {} but [] brackets are used here
require('chai')
.use(require('chai-as-promised'))
.should();


// function for contract
contract("DecentralBank", (accounts) => {
    // All of our code for testing goes here
    // describe - first test to run is an assertion using chai library; check different kinds of things, eg: name matching in our contracts i.e, if the names in our contract corresponding to the parameters are mapped correctly - an important equality test
    // the argument we put in our describe will run the test we want to create/description of our test, an anonymous async arrow function to add testing functionality

    // to declare our variables on top
    let tether, rwd, decentralBank;

    // create a function to convert to convert ether to wei since it would be reused multiple times
    function tokens(number){
        return web3.util.toWei(number, "Ether");
    }

    // any code we add to before for our tests will run first before anything; it can be put anywhere in the code, but easy to maintain if present on the top
    before(async () => {
        // Load contracts
        tether = await Tether.new();
        rwd = await RWD.new();
        decentralBank = await DecentralBank.new(rwd.address, tether.address);

        // Transfer all of our tokens to the Decentral Bank
        await rwd.transfer(DecentralBank.address, tokens('1000000'));

        // Test transfer of 100 tether to the investor account
        await tether.transfer(accounts[1], tokens(100), {from: accounts[0]});
    });

    // test 1 - Name matching for mock tether deployment
    describe("Mock Tether Deployment", async () => {
        // it allows us to bring in a description
        it("Matches name successfully", async () => {
            // another async pattern to fetch our contract information to make sure our contracts ran successfully
            // tether = await Tether.new(); // new() to get an instance of everything from our Tether // // The instantiation can be done locally as well as in the before function
            // await is necessary here because, we don't want the assertion test to happen even before the variable "name" gets the value assigned
            const name = await tether.name();
            // to match the name of the deployed contract to the name we assigned to tether in our contract
            assert.equal(name, "Tether");
        });
    });

    // test 2 - Name matching for reward token deployment
    describe("Reward Token", async () => {
        it("Matches name successfully", async () => {
            // rwd = await RWD.new(); // The instantiation can be done locally as well as in the before function
            const name = await rwd.name();
            assert.equal(name, "Reward Token");
        });
    });
})
