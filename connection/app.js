const contract = require('truffle-contract');

//const metacoin_artifact = require('../build/contracts/MetaCoin.json');
const narrative_artifact = require('../build/contracts/narrativeChainy.json');
var MetaNarrativeArtifact = contract(narrative_artifact);

module.exports = {
  start: function(callback) {
    var self = this;
    console.log("connection/app.js START");
    // Bootstrap contract abstraction for Use.
    MetaNarrativeArtifact.setProvider(self.web3.currentProvider);


    // Get the initial account balance so it can be displayed.
    self.web3.eth.getAccounts(function(err, accs) {
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

      // Set gas limits...
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
    });
    
  },


  refreshNarrative: function() {
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
  
  //    balance_element.innerHTML = value.valueOf();
       storyLength = value.valueOf();  
       if(storyLength > 0){
         for (var i = 0; i < storyLength; i++) {
           this.retrieveStoryItem(i);
         }
       }
  
    }).catch(function(e) {
      console.log(e);
      App.setStatus("Error getting balance; see log.");
    });
   
  },

  retrieveStoryItem: function(storyItem) {
  
  /*  var metaInstance;
    var storyTemplate = $('#storyTemplate');
    var narrativeRow = $('#returnedNarrativeText');
*/
    console.log("Retrive STORY ITEM");
    var date;

 //   var retrieve_code = document.getElementById("retrieveCode");

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

      console.log("TEXT" + value[2].valueOf());
      console.log(" DATE: " + date.toLocaleString('en-us', options));
      console.log(" Address: " + value[3].valueOf());

    //  storyTemplate.find('#narrative-main-text').text(value[2].valueOf());
    //  storyTemplate.find('#narrative-main-date').text(date.toLocaleString('en-us', options));
    //  storyTemplate.find('#narrative-main-address').text(value[3].valueOf());
    //  narrativeRow.append(storyTemplate.html());

    }).catch(function(e) {
      console.log(storyItem + " FAILED ");
      console.log(e);
      App.setStatus("Error getting balance; see log.");
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
