const { network } = require("hardhat");
const { developmentChains, networkConfig } = require("../helper-hardhat-config");
const { ethers } = require("hardhat"); 

module.exports = async function ({ getNamedAccounts, deployments }) {
    const { deploy, log } = deployments;
    const { deployer } = await getNamedAccounts();
    let vrfCoordinatorV2Address;

    if (developmentChains.includes(network.name)) {
        const VRFCoordinatorV2Mock = await ethers.getContract("VRFCoordinatorV2Mock");
        vrfCoordinatorV2Address = VRFCoordinatorV2Mock.address;
        console.log(vrfCoordinatorV2Address);
        const transactionResponse = await VRFCoordinatorV2Mock.createSubscription();
        const transactionReceipt = await transactionResponse.wait(1);
        subscriptionId = transactionReceipt.events[0].args.subId;
        // //fund the subscription
        console.log("subid:",subscriptionId);
        await VRFCoordinatorV2Mock.fundSubscription(subscriptionId, ethers.utils.parseEther('2'));
    } else {
        vrfCoordinatorV2Address = networkConfig[network.config.chainId]["vrfCoordinatorV2"];
        subscriptionId = networkConfig[network.config.chainId]["subscriptionId"];
    }
    
    log(network.config.chainId);
    interval = networkConfig[network.config.chainId]["interval"];
    entranceFee = networkConfig[network.config.chainId]["entranceFee"];
    log(entranceFee)
    callBackGasLimit = networkConfig[network.config.chainId]["callBackGasLimit"]; // Ensure it's fetched as a regular number
    gasLane = networkConfig[network.config.chainId]["gasLane"];

    console.log(network.config.chainId);
    const lottery = await deploy("lottery", {
        from: deployer,
        args: [interval, callBackGasLimit,subscriptionId, gasLane,vrfCoordinatorV2Address, entranceFee ],
        log: true,
    });
}



module.exports.tags = ["all","mocks"];