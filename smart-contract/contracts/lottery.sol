//Raffle

//enter lottry (paying some amount)
//Pick a random number (verifiable)
//completly automatic random number generates for winner
//chinlink oracle -> randonmes, automated excution (Chainlink keeper)

// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.7;

import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";
import "@chainlink/contracts/src/v0.8/vrf/VRFConsumerBaseV2.sol";
import "@chainlink/contracts/src/v0.8/automation/AutomationCompatible.sol";





error notEnoughFee();
error Raffle__notOpen(); 
error upKeepnotNeeded();

contract lottery is VRFConsumerBaseV2 , AutomationCompatibleInterface  {
   
    enum LotteryState{
        OPEN,
        CALCULATING
    }
    
    
    uint256 private immutable i_entrance;//entrance fee
    //array to store players
    address payable[] private s_players; //we have made players payable because we have to give them money when they win 
    VRFCoordinatorV2Interface private immutable i_vrfCoordinator;
    bytes32 private immutable i_gaslane;
    uint16 private constant REQUEST_CONFIRMATIONS = 3;
    uint32 private immutable i_callbackgaslimit;
    uint32 private constant Num_words = 1;
    uint64 private immutable i_subscriptionId;
    //keep track of state using enum

    //lottery variables
    address private s_recentWinner;
    LotteryState private s_lotteryState;
    uint256 private s_lastTImeStamp;
    uint256 private immutable i_interval;
    
    
    
    //events
    event LotteryEnter(address indexed player);
    event RequestLotteryWinner(uint256 indexed requestId);
    event winnerPicked(address indexed winner);
    //contructor called each time contract is deployed (mostly once)
    constructor(uint256 interval ,uint32 callbackgaslimit,uint64 subscriptionId,bytes32 gaslane,address vrfCoordinatorV2,uint256 entranceFee) VRFConsumerBaseV2(vrfCoordinatorV2) {
        i_entrance = entranceFee;  
        i_vrfCoordinator = VRFCoordinatorV2Interface(vrfCoordinatorV2);
        i_gaslane = gaslane;
        i_subscriptionId = subscriptionId;
        s_lotteryState = LotteryState.OPEN; //0 means open
        i_callbackgaslimit = callbackgaslimit;
        s_lastTImeStamp =  block.timestamp;
        i_interval = interval;
    }   

    //function for the user to enter in the lottery
    function enterLottery() public  payable{  
        //while entering the lottery if somehow user fails to add value greater than entrance value error will be thrown
        if(msg.value < i_entrance) {revert notEnoughFee();}
        if(s_lotteryState != LotteryState.OPEN ){revert Raffle__notOpen(); }
        s_players.push(payable(msg.sender));
    
    }

    //function to get the player at given index 
    function getPlayer(uint256 index) public view returns(address){
        return s_players[index];
    }

     /**
     * @dev This is the function that the Chainlink Keeper nodes call
     * they look for `upkeepNeeded` to return True.
     * the following should be true for this to return true:
     * 1. The time interval has passed between raffle runs.
     * 2. The lottery is open.
     * 3. The contract has ETH.
     * 4. Implicity, your subscription is funded with LINK.
     */
    function checkUpkeep(
        bytes memory /* checkData */
    )
        public
        view
        override
        returns (
            bool upkeepNeeded,
            bytes memory /* performData */
        )
    {
        bool isOpen = LotteryState.OPEN == s_lotteryState;
        bool timePassed = ((block.timestamp - s_lastTImeStamp) > i_interval);
        bool hasPlayers = s_players.length > 0;
        bool hasBalance = address(this).balance > 0;
        upkeepNeeded = (timePassed && isOpen && hasBalance && hasPlayers);
        return (upkeepNeeded, "0x0"); // can we comment this out?
    }






    //external is cheaper
    function performUpkeep(bytes calldata /*performData*/ )  external override {
        //request random number and then do something to it, it involves two transactions and it is preffered
      
      (bool upKeepNeeded,) = checkUpkeep("");

      if(!upKeepNeeded){ revert upKeepnotNeeded();}
      
      s_lotteryState = LotteryState.CALCULATING;
      uint256 requestId =  i_vrfCoordinator.requestRandomWords(
            i_gaslane,
            i_subscriptionId,
            REQUEST_CONFIRMATIONS,
            i_callbackgaslimit,
            Num_words
               );
            
        emit RequestLotteryWinner(requestId);
    }

    function fulfillRandomWords(uint256 ,uint256[] memory randomwords) internal override {
        uint256 indexOfWinner = randomwords[0] % s_players.length;
        address payable winner = s_players[indexOfWinner];
        s_recentWinner = winner;
        s_lastTImeStamp = block.timestamp;
        s_lotteryState = LotteryState.OPEN;
        s_players = new address payable[](0);
         (bool success, ) = winner.call{value: address(this).balance}("");
         if(!success){
            revert notEnoughFee();
         }
        emit winnerPicked(winner);
    }

    function getRecentWinner() public view returns (address){
        return s_recentWinner;
    }

    function getEntranceFee() public view returns (uint256){
        return i_entrance;
    }

    function getLotteryState() public view returns(LotteryState){
    
       return s_lotteryState;
    }

    function getNumOfPlayers() public view returns(uint256){
        return s_players.length;
    }

    function getInterval() public view returns(uint256){
        return i_interval;
    }
}