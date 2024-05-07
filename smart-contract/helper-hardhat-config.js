const networkConfig = {
    11155111: {
        name: "sepolia",
        vrfCoordinatorV2: "0x271682DEB8C4E0901D1a1550aD2e64D568E69909",
        gasLane:"0x8af398995b04c28e9951adb9721ef74c74f93e6a478f39e7e0777be13527e7ef",
        entranceFee: ethers.utils.parseEther('0.01'),
        subscriptionId:"10731",
        callBackGasLimit: 1000000,
        interval: "30",
    },
    31337 :{
        name: "local",
        gasLane:"0x8af398995b04c28e9951adb9721ef74c74f93e6a478f39e7e0777be13527e7ef",
        entranceFee: ethers.utils.parseEther('0.01'),
        subscriptionId:"0",
        callBackGasLimit: 100,
        interval: "30",
    },
    1337 :{
        name: "ganache",
        gasLane:"0x8af398995b04c28e9951adb9721ef74c74f93e6a478f39e7e0777be13527e7ef",
        entranceFee: ethers.utils.parseEther('0.01'),
        subscriptionId:"0",
        callBackGasLimit: 100,
        interval: "30",
    }
}


const developmentChains = ['localhost','hardhat','ganache'];

module.exports = {
    networkConfig,
    developmentChains
}