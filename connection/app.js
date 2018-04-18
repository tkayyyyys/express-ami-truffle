const contract = require('truffle-contract');
//const Web3 = require('web3');

//const metacoin_artifact = require('../build/contracts/MetaCoin.json');
const narrative_artifact = require('../build/contracts/narrativeChainy.json');
var MetaNarrativeArtifact = contract(narrative_artifact);


module.exports = {
  start: function(callback) {
    var self = this;
    console.log("INSIDE connection/app.js START");
    // -- I think this should connect to the contract!


    /*// Set gas limits...
      // THink this needs to be moved.. / fixed somewhere..

      //------- self.account in particular.
      var gasMinimum = self.web3.toWei(2, 'gwei');
      MetaNarrativeArtifact.defaults({
            from: self.account,
            gas: 4712388,
            gasPrice: gasMinimum
        });
      //------
      //self.refreshNarrative();
      */

    // Move this into client side, I think!!
  
   /*if (typeof self.web3 !== 'undefined') {
      console.warn("Using web3 detected from external source. If you find that your accounts don't appear or you have 0 MetaCoin, ensure you've configured that source properly. If using MetaMask, see the following link. Feel free to delete this warning. :) http://truffleframework.com/tutorials/truffle-and-metamask")
      // Use Mist/MetaMask's provider
      self.web3 = new Web3(web3.currentProvider);
    } else {
      console.warn("No web3 detected. Falling back to http://127.0.0.1:7545. You should remove this fallback when you deploy live, as it's inherently insecure. Consider switching to Metamask for development. More info here: http://truffleframework.com/tutorials/truffle-and-metamask");
      // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
      self.web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:7545"));
    }
    */

    
    // Bootstrap contract abstraction for Use.
    MetaNarrativeArtifact.setProvider(self.web3.currentProvider);

    MetaNarrativeArtifact.deployed().then(function(arb) {
        //$('option.default-arbitrator-option').val(arb.address);
        console.log("Deployed at: " + arb.address);
    });


    // At the moment this connects to the account list. We want it to connect to the contract instance.  
    // Get the initial account balance so it can be displayed.
   /* self.web3.eth.getAccounts(function(err, accs) {
      if (err != null) {
        alert("There was an error fetching your accounts.");
        return;
      }

      if (accs.length == 0) {
        alert("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.");
        return;
      }
      self.accounts = accs;
      self.account = self.accounts[2];

      callback(self.accounts);

    });
    */
    
  },


  refreshNarrative: function(callback) {
    //var metaInstance;
    var self = this;
    storyLength = 0;
    console.log(" ----- REFRESH ------");
   
   // $('#returnedNarrativeText').remove();
   // TODO: HERE. Figure out how to clear rows..
    MetaNarrativeArtifact.setProvider(self.web3.currentProvider);

    MetaNarrativeArtifact.deployed().then(function(instance) {
      metaInstance = instance;
        
     // let estimatedGas = metaInstance.sign.estimateGas('arg of my function', { from: '0xAddress' });
     // console.log("gas" + estimatedGas);

      return metaInstance.getNarrativeLength.call();
    }).then(function(value) {

      console.dir(value);
      console.log("NARRATIVE LENGTH:" + value.valueOf());
  //    var balance_element = document.getElementById("balance");
        var storyData = []; 
      // self.retrieveStoryItem(i);
  //    balance_element.innerHTML = value.valueOf();
       storyLength = value.valueOf();  
       if(storyLength > 0){
         for (var i = 0; i < storyLength; i++) {
           console.log(i + "why this don't work?");
           self.retrieveStoryItem(i, function(result){
              console.log("result!! " + result);
              storyData.push(result);
              if(storyData.length ==  storyLength){
                console.dir(storyData);
                console.log("FULL");
                callback(storyData);
              }
           });
         }
       }

      // console.dir(storyData);
      // console.log("storyData:" + storyData.length);

      // retturn an array here!!
     // callback(value.valueOf());
  
    }).catch(function(e) {
      console.log(e);
      console.log("Error getting balance; see above log.")
     // App.setStatus("Error getting balance; see log.");
    });
   
  },

  retrieveStoryItem: function(storyItem, callback) {
  
  /*  var metaInstance;
    var storyTemplate = $('#storyTemplate');
    var narrativeRow = $('#returnedNarrativeText');
*/
    var self = this;
   // console.log("Reterive STORY ITEM");
    var date;

 //   var retrieve_code = document.getElementById("retrieveCode");

// HERE. 
    MetaNarrativeArtifact.setProvider(self.web3.currentProvider);
    MetaNarrativeArtifact.deployed().then(function(instance) {
     
      metaInstance = instance;
      return metaInstance.getChainyAll.call(storyItem); 
    }).then(function(value) {

      date = new Date(value[0].valueOf() * 1000);
      //date.format('dd-m-yy');
      let options = {  
       weekday: 'long',
       year: 'numeric',
       month: 'short',
       day: 'numeric',
       hour: '2-digit',
        minute: '2-digit'
      };

      console.log(storyItem + "TEXT" + value[2].valueOf());
      console.log(storyItem + " DATE: " + date.toLocaleString('en-us', options));
      console.log(storyItem + " Address: " + value[3].valueOf());

      callback(value[2].valueOf());
    //  storyTemplate.find('#narrative-main-text').text(value[2].valueOf());
    //  storyTemplate.find('#narrative-main-date').text(date.toLocaleString('en-us', options));
    //  storyTemplate.find('#narrative-main-address').text(value[3].valueOf());
    //  narrativeRow.append(storyTemplate.html());

    }).catch(function(e) {
      console.log(storyItem + " FAILED ");
      console.log(e);
      console.log("Error getting balance; see log.");
     // App.setStatus("Error getting balance; see log.");
    });
     
  },



   /*
    Working.. can contribute text
   */
   contributeText: function(narrative, callback) {
    var self = this;

    // Bootstrap the MetaCoin abstraction for Use.
    MetaNarrativeArtifact.setProvider(self.web3.currentProvider);
    var returnCode;

    console.log("narrativeText : " + narrative);
    console.log(" JSON:  " + JSON.stringify(narrative));// + " string: " + strong);

    MetaNarrativeArtifact.deployed().then(function(instance) {
      metaInstance = instance;

      // Solidity: function addChainyData(string _narrative, uint256 _type) does not return anything.
      return metaInstance.addChainyData(JSON.stringify(narrative), 1);
    }).then(function(value) {
     //console.log("AddChainyData SUCCESS!")
     //console.log("Tx: " + value);
     //console.log("RETURNED " + value.logs[0].args.item); //res.logs[0].args.message
     //console.dir(value);
     returnCode = value.logs[0].args.item;
     return metaInstance.getChainyData.call(value.logs[0].args.item);
   }).then(function(value) {
     //console.log("getChainyData SUCCESS");
     //console.log("Tx: " + value.valueOf());
     console.dir(value);
     return metaInstance.getNarrativeLength.call();
   }).then(function(value) {
      // If it's all good, let's refresh.
      
  //-- HERE. Figure out how to refresh..

      //console.log("RETURNED Narrative Length:" + value.valueOf());
      //console.log("NARRATIVE Tx: " );
      //console.dir(value);

      callback(value.valueOf());

  //    self.refreshBalance(sender, function (answer) {
  //      callback(answer);
  //    });

// HERE Fix this.
//      App.refreshNarrative();  

   }).catch(function(e) {
     console.log(e);
// HERE fix
//     App.setStatus("Error in contributeText; see log.");
  });
  },


 /* refreshBalance: function(account, callback) {
    var self = this;

    // Bootstrap the MetaCoin abstraction for Use.
    MetaNarrativeArtifact.setProvider(self.web3.currentProvider);

   var meta;
    MetaCoin.deployed().then(function(instance) {
      meta = instance;
      return meta.getBalance.call(account, {from: account});
    }).then(function(value) {
        callback(value.valueOf());
    }).catch(function(e) {
        console.log(e);
        callback("Error 404");
    });
    
  },
  */
  sendCoin: function(amount, sender, receiver, callback) {
    var self = this;

    // Bootstrap the MetaCoin abstraction for Use.
    MetaNarrativeArtifact.setProvider(self.web3.currentProvider);

 /*   var meta;
    MetaCoin.deployed().then(function(instance) {
      meta = instance;
      return meta.sendCoin(receiver, amount, {from: sender});
    }).then(function() {
      self.refreshBalance(sender, function (answer) {
        callback(answer);
      });
    }).catch(function(e) {
      console.log(e);
      callback("ERROR 404");
    });
    */
  }
}
