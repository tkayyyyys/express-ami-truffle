

App = {
  url: "https://ropsten.etherscan.io/address/",
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

    return App.initContract();
  },

   initContract: function() {
    
    // $.getJSON('narrativeChainy.json', function(data) {
    $.getJSON('/jsoncontent', function(data) { 
      var MetaNarrativeArtifact = data;

      App.contracts.narrativeChainy = TruffleContract(MetaNarrativeArtifact);
      App.contracts.narrativeChainy.setProvider(App.web3Provider);
      
      // Defaults for browser
      var gasMinimum = window.web3.toWei(20, 'gwei');
      App.contracts.narrativeChainy.defaults({
          //from: account,
          //gas: 4712388,
          gas: 4653035,
          gasPrice: gasMinimum
      });

      //App.refreshNarrative();
      App.refreshNarrative().then(() => {
        console.log('refresh narrative done')
      }).catch((e) => {
        console.error(e)
      })
      App.calculateGas();

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

    });
     return App.bindEvents();
  },

  bindEvents: function() {
   console.log("binding");
    $(document).on('click', '.btn-contribute', App.contributeText); 
    $(document).on('click', '.btn-contribute-event', App.contributeEvent); 
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

  refreshNarrative: async function() {
    var metaInstance;
    storyLength = 0;
  

   //$("#processing-request").show();
   $('#returnedNarrativeText').html("");

    console.dir(App.web3Provider);
    console.dir(App.contracts);
    console.dir(App.contracts.narrativeChainy);

    let instance = await App.contracts.narrativeChainy.deployed();
    let value = await instance.getNarrativeLength.call();

    var balance_element = document.getElementById("balance");
  
    balance_element.innerHTML = value.valueOf();
    storyLength = value.valueOf();

    if(storyLength > 0){
        for (i = storyLength - 1; i >= 0; i--) {
        
            let value = await instance.getChainyAll.call(i).then(function (strings) {
                 console.log("await returned " + strings[0]);
                 var narrativeRow = $('#returnedNarrativeText');
                 var storyTemplate = $('#story-container');
                 var eventTemplate = $('#event-container');

                 var date;

                 date = new Date(strings[0].valueOf() * 1000);
    
                let options = {  
                 weekday: 'long',
                 year: 'numeric',
                 month: 'short',
                 day: 'numeric',
                 hour: '2-digit',
                  minute: '2-digit'
                };

                if(strings[1].valueOf() == 1){
                  storyTemplate.find('#story-body').text(strings[2].valueOf());
                  storyTemplate.find('#story-date-value').text(date.toLocaleString('en-us', options));
                  storyTemplate.find('#story-address-value').text(strings[3].valueOf());
                  storyTemplate.find('#story-address-value').attr("href", App.url + strings[3].valueOf());
                  console.dir(narrativeRow);
                  narrativeRow.append(storyTemplate.html());
                  //narrativeRow.append(storyTemplate.html());
                } else if (strings[1].valueOf() == 2){

                  eventTemplate.find('#event-story-body').text(strings[2].valueOf());
                  eventTemplate.find('#event-story-date-value').text(date.toLocaleString('en-us', options));
                  eventTemplate.find('#event-story-address-value').text(strings[3].valueOf());
                  eventTemplate.find('#event-story-address-value').attr("href", App.url + strings[3].valueOf()); 
                  narrativeRow.append(eventTemplate.html());
                  
                } 
         
          });

         }
    }

  },


//async
/*
retrieveStoryItem: async function(storyItem) {
    var metaInstance;

   
    var narrativeRow = $('#returnedNarrativeText');
    var storyTemplate = $('#story-container');
    var eventTemplate = $('#event-container');

    var date;

    var retrieve_code = document.getElementById("retrieveCode");

    console.log("retrieve async");

    let instance = await App.contracts.narrativeChainy.deployed();
    let value = await instance.getChainyAll.call(storyItem);

     date = new Date(value[0].valueOf() * 1000);
    
      let options = {  
       weekday: 'long',
       year: 'numeric',
       month: 'short',
       day: 'numeric',
       hour: '2-digit',
        minute: '2-digit'
      };

      if(value[1].valueOf() == 1){
        storyTemplate.find('#story-body').text(value[2].valueOf());
        storyTemplate.find('#story-date-value').text(date.toLocaleString('en-us', options));
        storyTemplate.find('#story-address-value').text(value[3].valueOf());
        storyTemplate.find('#story-address-value').attr("href", App.url + value[3].valueOf());
        console.dir(narrativeRow);
        narrativeRow.sort(function asc_sort(a, b) {
        }).append(storyTemplate.html());
        //narrativeRow.append(storyTemplate.html());
      } else if (value[1].valueOf() == 2){

        eventTemplate.find('#event-story-body').text(value[2].valueOf());
        eventTemplate.find('#event-story-date-value').text(date.toLocaleString('en-us', options));
        eventTemplate.find('#event-story-address-value').text(value[3].valueOf());
        eventTemplate.find('#event-story-address-value').attr("href", App.url + value[3].valueOf()); 
        narrativeRow.append(eventTemplate.html());
        
      } 
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

     App.contracts.narrativeChainy.deployed().then(function(instance) {
        
        metaInstance = instance;
        /* TODO: retrieve TEXT from window. */

        // Use the keyword 'estimateGas' after the function name to get the gas estimation for this particular function 
        //return metaInstance.giveAwayDividend.estimateGas(1);
       return metaInstance.addChainyData.estimateGas("STRING", 1)
    }).then(function(result) {
        var gas = Number(result);

        $('#gas-cost-estimate').text(App.contracts.narrativeChainy.web3.fromWei((gas * gasPrice), 'ether') + " Ether");
        //console.log("gas estimation = " + gas + " units");
        //console.log("gas cost estimation = " + (gas * gasPrice) + " wei");
        //console.log("gas cost estimation = " +  App.contracts.narrativeChainy.web3.fromWei((gas * gasPrice), 'ether') + " ether");

    });
  //});
  },

   contributeEvent: function() {
    var metaInstance;

    var narrativeText = document.getElementById("narrativeText");
    console.log("Contribute Event Text : " + narrativeText.value);
   
    var returnCode;
    console.log(" JSON:  " + JSON.stringify(narrativeText.value));// + " string: " + strong);
    $("#processing-again").hide(); 
    $("#processing-request").show();

    App.contracts.narrativeChainy.deployed().then(function(instance) {
      metaInstance = instance;

      // Solidity: function addChainyData(string _narrative, uint256 _type) does not return anything.
      return metaInstance.addChainyData(JSON.stringify(narrativeText.value), 2);
    }).then(function(value) {
    $("#processing-request").hide(); 
    $("#processing-response").show(); 

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

      $("#processing-response").hide(); 
      $("#processing-again").show(); 
      App.refreshNarrative();  
   }).catch(function(e) {
     console.log(e);
     App.setStatus("Error in contributeText; see log.");
   });
  },  

  contributeText: function() {
    var metaInstance;

    var narrativeText = document.getElementById("narrativeText");
    console.log("narrativeText : " + narrativeText.value);
    var returnCode;

    console.log(" JSON:  " + JSON.stringify(narrativeText.value));// + " string: " + strong);

    $("#processing-again").hide(); 
    $("#processing-request").show();


    App.contracts.narrativeChainy.deployed().then(function(instance) {
      metaInstance = instance;
    

      // Solidity: function addChainyData(string _narrative, uint256 _type) does not return anything.
      return metaInstance.addChainyData(JSON.stringify(narrativeText.value), 1);
    }).then(function(value) {
    $("#processing-request").hide(); 
     $("#processing-response").show(); 

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

      $("#processing-response").hide(); 
      $("#processing-again").show(); 

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
