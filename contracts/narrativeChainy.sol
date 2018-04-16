 pragma solidity ^0.4.16;
 import "./owned.sol";

/**
 * This contract is a heavily slimmed down version of Chainy.sol
 * 
 * It saves string information along with some basic metadata to the 
 * ETH blockchain.
 * 
 * */

/**
 * From: Chainy.sol
 *
 * Copyright 2016 Everex https://everex.io
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */


contract narrativeChainy is owned {
    
    // Configuration
    mapping(string => uint256) private chainyConfig;

    // Service accounts
    mapping (address => bool) private srvAccount;

    // Fee receiver
    address private receiverAddress;
    
    //Legth of narrative
    uint256 public totalNarrativeLength;

    // int storyType:
    // 1 = Narrative,
    // 2 = event
    // 3 = Image 
    
    struct data {uint256 timestamp; uint256 storyType; string narrative; address sender;}
    mapping (uint256 => data) private chainy;

    event narrativeAdded(uint256 item, uint256 storyType, uint256 timestamp, string narrative, address sender);

    // Constructor
    function narrativeChainy(){
        setConfig("fee", 0);
        // change the block offset to 1000000 to use contract in testnet
        setConfig("blockoffset", 2000000);
        totalNarrativeLength = 0;
       
    }

    // Sets configuration option
    function setConfig(string _key, uint256 _value) internal onlyOwner {
        chainyConfig[_key] = _value;
    }

    // Returns configuration option
    function getConfig(string _key) internal constant returns (uint256 _value) {
        return chainyConfig[_key];
    }

    // Add/Remove service account
    function setServiceAccount(address _address, bool _value) external onlyOwner {
        srvAccount[_address] = _value;
    }

    // Set receiver address
    function setReceiverAddress(address _address) external onlyOwner {
        receiverAddress = _address;
    }

    // Send all ether back to owner
    function releaseFunds() external onlyOwner {
        if(!owner.send(this.balance)) throw;
    }

    // Add record
    function addChainyData(string _narrative, uint256 _type) external {
        //checkFormat(json);
        // TODO: Check _narrative input 
        require(_type >= 1 && _type <=3);
        uint256 _item = totalNarrativeLength;
       
        // Checks if the record exist
        if (getChainyTimestamp(_item) > 0) throw;

        //Fee check.
        processFee();
        
        chainy[_item] = data({
            timestamp: block.timestamp,
            storyType: _type,
            // imageLink : //Sting
            narrative: _narrative,
            sender: tx.origin
        });

        totalNarrativeLength++;
        
        // Fire event
        narrativeAdded(_item, _type, block.timestamp, _narrative, tx.origin);
    }

    // Get record timestamp
    function getChainyTimestamp(uint _code) public constant returns (uint256) {
        return chainy[_code].timestamp;
    }

    // Get record JSON
    function getChainyData(uint _code) external constant returns (string) {
        return chainy[_code].narrative;
    }

    // Get record sender
    function getChainySender(uint _code) external constant returns (address) {
        return chainy[_code].sender;
    }

    // Get all records
    // timestamp: block.timestamp, storyType: _type, narrative: _narrative, sender: tx.origin
    // uint256 timestamp; uint256 storyType; string narrative; address sender;
    function getChainyAll(uint _code) external constant returns (uint256, uint256, string, address) {
        return (chainy[_code].timestamp, chainy[_code].storyType, chainy[_code].narrative, chainy[_code].sender);
    }

    // Checks if enough fee provided
    function processFee() internal {
        var fee = getConfig("fee");
        if (srvAccount[msg.sender] || (fee == 0)) return;

        if (msg.value < fee)
            throw;
        else
            if (!receiverAddress.send(fee)) throw;
    }

     function getNarrativeLength() external returns (uint256){
        return totalNarrativeLength;
    }
    // GET narrative length.. why you deleted ?


}
