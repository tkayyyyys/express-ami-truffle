

App = {
  web3Provider: null,
  contracts: {},

  init: function() {
    return App.initWeb3();
  },


  initWeb3: function() {
   // Is there an injected web3 instance?
    if (typeof web3 !== 'undefined') {
      App.web3Provider = web3.currentProvider;
      console.log("Web3 provider found! Great!");
    } else {
      // If no injected web3 instance is detected, fall back to Ganache. Fine for Dev but
      // TODO: change for PRODUCTION
      
      console.log("No web3 detected. Falling back to http://localhost:7545. You should remove this fallback when you deploy live.");
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
    }
    web3 = new Web3(App.web3Provider);

    //console.log("initWeb3");
    return App.initContract();
  },

   initContract: function() {
    
    // $.getJSON('narrativeChainy.json', function(data) {
    $.getJSON('/jsoncontent', function(data) { 
      var MetaNarrativeArtifact = data;

      App.contracts.narrativeChainy = TruffleContract(MetaNarrativeArtifact);
      App.contracts.narrativeChainy.setProvider(App.web3Provider);
      
      // Defaults for browser
      var gasMinimum = window.web3.toWei(2, 'gwei');
      App.contracts.narrativeChainy.defaults({
          //from: account,
          //gas: 4712388,
          gas: 4653035,
          gasPrice: gasMinimum
      });

    });   

    return App.start();
  },


  start: function() {
 
    // Get the initial account balance so it can be displayed.
    web3.eth.getAccounts(function(err, accs) {
      if (err != null) {
        alert("There was an error fetching your accounts.");
        return;
      }

      if (accs.length == 0) {
        alert("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.");
        return;
      }
      App.refreshNarrative();

      // Calculate GAS.
      App.calculateGas();
    });
     return App.bindEvents();
  },

  bindEvents: function() {
   console.log("binding");
    $(document).on('click', '.btn-contribute', App.contributeText); 
   // $(document).on('click', '.btn-retrieve-code', App.retrieveText); 
   },

  setStatus: function(message) {
    var status = document.getElementById("status");
    status.innerHTML = message;
  },

  /*
  async gas price
  async () => {
  let result = await MyContract.function(payload);                  
  var gasPrice = web3.eth.getTransaction(result.tx).gasPrice.toNumber();
  // Executes in the VM but don't get mined to blockchain and report consumed gas.
  let gas = await MyContract.function.estimateGas(payload); 
  ...
}

  */

  refreshNarrative: function() {
    var metaInstance;
    storyLength = 0;
    console.log(" ----- REFRESH ------");
   
   // $('#returnedNarrativeText').remove();
   // TODO: HERE. Figure out how to clear rows..

    App.contracts.narrativeChainy.deployed().then(function(instance) {
      metaInstance = instance;
        
     // let estimatedGas = metaInstance.sign.estimateGas('arg of my function', { from: '0xAddress' });
     // console.log("gas" + estimatedGas);

      return metaInstance.getNarrativeLength.call();
    }).then(function(value) {

      console.log("NARRATIVE LENGTH:" + value.valueOf());
      var balance_element = document.getElementById("balance");
  
      balance_element.innerHTML = value.valueOf();
      storyLength = value.valueOf();
    
       if(storyLength > 0){
         for (var i = 0; i < storyLength; i++) {
           App.retrieveStoryItem(i);
         }
       }

    }).catch(function(e) {
      console.log(e);
      App.setStatus("Error getting balance; see log.");
    });
   
  },

  retrieveStoryItem: function(storyItem) {
    var metaInstance;

    //var storyTemplate = $('#storyTemplate');
    //var narrativeRow = $('#returnedNarrativeText');

    var storyTemplate = $('#story-container');
    var narrativeRow = $('#returnedNarrativeText');

    var date;

    var retrieve_code = document.getElementById("retrieveCode");


     App.contracts.narrativeChainy.deployed().then(function(instance) {
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

      //console.log(" DATE: " + date.toLocaleString('en-us', options));

      /*
      storyTemplate.find('#narrative-main-text').text(value[2].valueOf());
      storyTemplate.find('#narrative-main-date').text(date.toLocaleString('en-us', options));
      storyTemplate.find('#narrative-main-address').text(value[3].valueOf());
      */
      storyTemplate.find('#story-body').text(value[2].valueOf());
      storyTemplate.find('#story-date').text(date.toLocaleString('en-us', options));
      storyTemplate.find('#story-address').text(value[3].valueOf());

      narrativeRow.append(storyTemplate.html());

    }).catch(function(e) {
      console.log(storyItem + " FAILED ");
      console.log(e);
      App.setStatus("Error getting balance; see log.");
    });
     
  },



  /*
   retrieveText: function() {
    var metaInstance;

    var retrieve_code = document.getElementById("retrieveCode");
    //console.log("retrieve_code: " + retrieve_code.value);

     App.contracts.narrativeChainy.deployed().then(function(instance) {
      metaInstance = instance;
      return metaInstance.getChainyTimestamp.call(retrieve_code.value);
    }).then(function(value) {
     $('#individual-story-text').text(value.valueOf());
     console.dir(value);
     // balance_element.innerHTML = value.valueOf();
      return metaInstance.getChainyData.call(storyLength);
    }).then(function(value) {
      $('#individual-story-text').text(value.valueOf());
      
    }).catch(function(e) {
      console.log("Retrieve Story Item FAILED");
      console.log(e);
      App.setStatus("Error retrieveing the story item; see log.");
    });
  },
  */


   calculateGas: function() {
  //TestContract.web3.eth.getGasPrice(function(error, result){ 

    var metaInstance;
 
 /*
    TODO: implement this. Calculate $$ not just ETH.
    var https = require('https'); 
    var optionsget = {
      host : 'api.coinmarketcap.com', 
      port : 443,
      path : '/v1/ticker/bitcoin/', 
      method : 'GET'
    };

    var reqGet = https.request(optionsget, function(res) {

    res.on('data', function(d) {
        info = JSON.parse(d);
        console.log(info);
        });
    });

    reqGet.end();
    reqGet.on('error', function(e) {
        console.error(e);
    });
 */
    
    //var gasPrice = Number(result);
    var gasPrice =  window.web3.toWei(2, 'gwei');

    console.log("Gas Price is " + gasPrice + " wei"); // "10000000000000"

    // Get Contract instance
    //TestContract.deployed().then(function(instance) {
   
     App.contracts.narrativeChainy.deployed().then(function(instance) {
        
        metaInstance = instance;
        /* TODO: retrieve TEXT from window. */

        // Use the keyword 'estimateGas' after the function name to get the gas estimation for this particular function 
        //return metaInstance.giveAwayDividend.estimateGas(1);
       return metaInstance.addChainyData.estimateGas("STRING", 1)
    }).then(function(result) {
        var gas = Number(result);

        $('#gas-cost-estimate').text(App.contracts.narrativeChainy.web3.fromWei((gas * gasPrice), 'ether') + " ether");
        //console.log("gas estimation = " + gas + " units");
        //console.log("gas cost estimation = " + (gas * gasPrice) + " wei");
        //console.log("gas cost estimation = " +  App.contracts.narrativeChainy.web3.fromWei((gas * gasPrice), 'ether') + " ether");

    });
  //});
  },

  contributeText: function() {
    var metaInstance;

    var narrativeText = document.getElementById("narrativeText");
    console.log("narrativeText : " + narrativeText.value);
    var returnCode;

    console.log(" JSON:  " + JSON.stringify(narrativeText.value));// + " string: " + strong);

    App.contracts.narrativeChainy.deployed().then(function(instance) {
      metaInstance = instance;

      // Solidity: function addChainyData(string _narrative, uint256 _type) does not return anything.
      return metaInstance.addChainyData(JSON.stringify(narrativeText.value), 1);
    }).then(function(value) {
     console.log("AddChainyData SUCCESS!")
     console.log("Tx: " + value);
     console.log("RETURNED " + value.logs[0].args.item); //res.logs[0].args.message
     console.dir(value);
     returnCode = value.logs[0].args.item;
     return metaInstance.getChainyData.call(value.logs[0].args.item);
   }).then(function(value) {
     console.log("getChainyData SUCCESS");
     console.log("Tx: " + value.valueOf());
     console.dir(value);
     return metaInstance.getNarrativeLength.call();
   }).then(function(value) {
      // If it's all good, let's refresh.
      console.log("RETURNED Narrative Length:" + value.valueOf());
      console.log("NARRATIVE Tx: " );
      console.dir(value);
      App.refreshNarrative();  
   }).catch(function(e) {
     console.log(e);
     App.setStatus("Error in contributeText; see log.");
  });
  


  },

 
};


$(function() {
  $(window).load(function() {
    App.init();
    // TODO: Get popover to work
    //$("[data-toggle=popover]").popover();
  });
});
