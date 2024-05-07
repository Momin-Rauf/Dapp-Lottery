const {developmentChains} = require('../helper-hardhat-config');
const BASE_FEE = '100000000000000000';
const GAS_PRICE_LINK = '1000000000'

module.exports = async function({getNamedAccounts,deployments}) {
    const {deploy,log} = deployments;
    const {deployer} = await getNamedAccounts();
    const chainId = network.config.chainId
    if (developmentChains.includes(network.name)){
        console.log("Network:",network.name);
        console.log("deploying mocks for local testing.....")
        await deploy("VRFCoordinatorV2Mock",{
            from:deployer,
            log:true,
            args:[BASE_FEE,GAS_PRICE_LINK]
        })
        log('mocks deployed');
        log('----------------------------------------------------')
    }
}


module.exports.tags = ["all","lottery"];
