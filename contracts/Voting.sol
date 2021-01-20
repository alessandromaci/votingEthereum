pragma solidity ^0.8.0;

import "./Registration.sol";

contract Voting is Registration {
    
    uint public totalVote = 0;
    // total count of vote for each address
    mapping(address => uint) public voteCount;
    
    // to forbid double voting 
    mapping(address => bool) public alreadyVoted;
    
    //function to assign a vote to the selected address  
    function vote(address _address) public {
        require(alreadyVoted[msg.sender] == false, "You are not allowed to vote twice");
        require(isCandidate[_address] == true, "This account is not registered among the candidates");
        voteCount[_address] ++;
        totalVote ++;
        alreadyVoted[msg.sender] = true;
    }
    
    function getPickWinner() public view returns(string memory){
        uint256 largest = 0; 
        uint256 i;
        string memory winner;

        for(i = 0; i < candidates.length; i++){
            if(voteCount[candidates[i]._address] > largest) {
                largest = voteCount[candidates[i]._address];
                winner = candidates[i]._lastName;
            } 
        }
        return winner;
    }      
    
}