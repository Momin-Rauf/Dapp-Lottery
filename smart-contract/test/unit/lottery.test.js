const {assert,expect} = require("chai");
const { getNamedAccounts, deployments, ethers } = require("hardhat");
const {developmentChains, networkConfig} = require("../../helper-hardhat-config");

!developmentChains.includes(network.name) 
? describe.skip  
: describe("Raffle Unit Tests",async function () {
    let lottery , vrfCoordinatorV2Mock

    beforeEach(async function(){
        deployer = (await getNamedAccounts()).deployer;
        await deployments.fixture(['all']);
        lottery = await ethers.getContract("lottery",deployer);
        vrfCoordinatorV2Mock = await ethers.getContract("VRFCoordinatorV2Mock",deployer);

    })

    describe("constructor",async function(){
        it("initializes the lottery system", async function(){
            //ideally we make our tests 1 assert per it
            let chainId = network.config.chainId;
            const lotteryState = await lottery.getLotteryState();
            const interval = await lottery.getInterval();
            assert.equal(lotteryState.toString(),"0");
            assert.equal(interval.toString(),networkConfig[chainId]["interval"]);
        })
    })

    describe("enterLottery", async () => {
        it("reverts if not enough paid", async () => {
            await expect(lottery.enterLottery()).to.be.revertedWith(
                "notEnoughFee()"
            );
        });
    });
    
})