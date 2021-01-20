// candidates should register before they can be voted
pragma solidity ^0.8.0;

contract Registration {
    
    //mapping to determine whether the account is eligible or not
    mapping(address => bool) isCandidate;
    
    struct candidateDetails {
        string _lastName;
        address _address;
    }
    
    candidateDetails[] candidates;
    
    //candidate register himself by filling his name
    function register(string memory _lastName) public {
        require(isCandidate[msg.sender] == false, "Your account is already registered");
        candidates.push(candidateDetails(_lastName, msg.sender));
        isCandidate[msg.sender] = true;
    }
    
    // read function to see the list of candidates
    function getCandidates() external view returns(candidateDetails[] memory) {
        return candidates;
    }
    
}