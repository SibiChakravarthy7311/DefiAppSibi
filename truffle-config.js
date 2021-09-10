require("babel-register");
require("babel-polyfill");

module.exports = {
    // network configuration
    networks:{
        development:{
            host: "127.0.0.1",
            port: "7545",
            network_id: "*" // Connect to any network
        },
    },

    // contract directory
    contracts_directory: "./src/contracts/",
    // our contracts spit out the result/information in the abis as json response and it is where we access our information from
    contracts_build_directory: "./src/truffle_abis",
    // setting up our compilers
    compilers:{
        solc:{
            version: "^0.5.0",
            optimizer:{
                enabled: true,
                runs: 200
            },
        }
    }
}
