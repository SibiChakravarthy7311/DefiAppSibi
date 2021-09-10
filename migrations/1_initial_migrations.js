const Migrations = artifacts.require("Migrations"); // Since we have the configuration set up to specify the contracts folder, the contract location need not be specified

module.exports = function (deployer) {
    deployer.deploy(Migrations);
};