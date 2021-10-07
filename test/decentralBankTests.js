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
contract("DecentralBank", ([owner, customer]) => {
    // All of our code for testing goes here
    // describe - first test to run is an assertion using chai library; check different kinds of things, eg: name matching in our contracts i.e, if the names in our contract corresponding to the parameters are mapped correctly - an important equality test
    // the argument we put in our describe will run the test we want to create/description of our test, an anonymous async arrow function to add testing functionality

    // to declare our variables on top
    let tether, rwd, decentralBank;

    // create a function to convert to convert ether to wei since it would be reused multiple times
    function tokens(number){
        return web3.utils.toWei(number, "ether");
    }

    // any code we add to before for our tests will run first before anything; it can be put anywhere in the code, but easy to maintain if present on the top
    before(async () => {
        // Load contracts
        tether = await Tether.new();
        rwd = await RWD.new();
        decentralBank = await DecentralBank.new(rwd.address, tether.address);

        // Transfer all of our tokens to the Decentral Bank
        await rwd.transfer(decentralBank.address, tokens('1000000'));

        // Test transfer of 100 tether to the investor account
        await tether.transfer(customer, tokens('100'), {from: owner});
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
    describe("Reward Token Deployment", async () => {
        it("Matches name successfully", async () => {
            // rwd = await RWD.new(); // The instantiation can be done locally as well as in the before function
            const name = await rwd.name();
            assert.equal(name, "Reward Token");
        });
    });

    // test 2 - Name matching for reward token deployment
    describe("Decentral Bank Deployment", async () => {
        it("Matches name successfully", async () => {
            // rwd = await RWD.new(); // The instantiation can be done locally as well as in the before function
            const name = await decentralBank.name();
            assert.equal(name, "Sibi Decentral Bank");
        });

        // to check if the decentral has reward tokens to offer
        it("Contract has tokens", async () => {
            let balance = await rwd.balances(decentralBank.address);
            assert.equal(balance, tokens('1000000'));
        });

        // Rewarding tokens for deposited amount on a proof of stake basis
        describe('Yield Farming', async () => {
            it('Rewards tokens for staking', async () => {
                let result;

                // Check investor balance
                result = await tether.balances(customer);
                assert.equal(result.toString(), tokens('100'), "Customer mock tether balance before staking");

                // Check staking for customer
                await tether.approve(decentralBank.address, tokens('100'), {from: customer});
                await decentralBank.depositTokens(tokens('100'), {from: customer});

                // Check Updated Balance of Customer
                result = await tether.balances(customer)
                assert.equal(result.toString(), tokens('0'), 'Customer mock wallet balance after staking 100 tokens')     
                
                // Check Updated Balance of Decentral Bank
                result = await tether.balances(decentralBank.address)
                assert.equal(result.toString(), tokens('100'), 'Decentral bank mock wallet balance after staking from customer')     
                
                // Is Staking Update
                result = await decentralBank.isStaking(customer)
                assert.equal(result.toString(), 'true', 'Customer is staking status after staking')

                // Issue Tokens
                await decentralBank.issueTokens({from: owner})

                // Ensure Only The Owner Can Issue Tokens
                await decentralBank.issueTokens({from: customer}).should.be.rejected;

                // Unstake Tokens
                await decentralBank.unstakeTokens({from: customer})

                // Check Unstaking Balances
                result = await tether.balances(customer)
                assert.equal(result.toString(), tokens('100'), 'Customer mock wallet balance after unstaking')     
                
                // Check Updated Balance of Decentral Bank
                result = await tether.balances(decentralBank.address)
                assert.equal(result.toString(), tokens('0'), 'Decentral bank mock wallet balance after staking from customer')     
                
                // Is Staking Update
                result = await decentralBank.isStaking(customer)
                assert.equal(result.toString(), 'false', 'Customer is no longer staking after unstaking')
            });
        });
    });
})

