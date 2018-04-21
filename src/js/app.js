

App = {
  url: "https://ropsten.etherscan.io/address/",
  web3Provider: null,
  contracts: {},
  orderedstories: [],
  astory: [],

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

      App.refreshNarrative();
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

  refreshNarrative: function() {
    var metaInstance;
    storyLength = 0;
    console.log(" ----- REFRESH ------");
   
   // $('#returnedNarrativeText').remove();
   // TODO: HERE. Figure out how to clear rows..
   //ERROR BELOW!

    console.dir(App.web3Provider);
    console.dir(App.contracts);
    console.dir(App.contracts.narrativeChainy);

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
      //console.dir(App.orderedstories);

       console.dir(App.orderedstories);
       console.log("before");
       App.orderedstories = jQuery.map(App.orderedstories, function( n, i ) {
          console.log(" ordered n : " + n + " i " + i);

          return ( i );
        });
        console.log("after");
/*
       console.dir(App.orderedstories);

       App.orderedstories.sort(function(x, y){
           // return x.date - y.date;
           console.log(" in sort ");
           console.dir(x);
           return x[1].date- y[1].date;
        });
       console.log("After sort:");
      console.dir(App.orderedstories);
*/
    }).catch(function(e) {
      console.log(e);
      App.setStatus("Error getting balance; see log.");
    });

    /*var el = document.getElementById('story-date');
    var sortable = Sortable.create(el,{group: "sorting",
      sort: true});
      */
   
  },


  retrieveStoryItem: function(storyItem) {
    var metaInstance;

   
    var narrativeRow = $('#returnedNarrativeText');
    var storyTemplate = $('#story-container');
    var eventTemplate = $('#event-container');

    var date;

    var retrieve_code = document.getElementById("retrieveCode");

    App.contracts.narrativeChainy.deployed().then(function(instance) {
      metaInstance = instance;
       return metaInstance.getChainyAll.call(storyItem); 

    }).then(function(value) {

      //console.dir(value);
     
      date = new Date(value[0].valueOf() * 1000);
    
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
          console.log("0 story type: " + value[0].valueOf());
          console.log("1 story type: " + value[1].valueOf()); 
          console.log("2 story type:" + value[2].valueOf());
          console.log("3 story type:" + value[3].valueOf());
      */

      // should be narrative = 1, event = 2
    /*   App.astory = {"text": value[2].valueOf(), "date": value[0].valueOf(), "url": value[3].valueOf()};
       App.orderedstories.push(App.astory);

       console.dir(App.orderedstories);
       */
     /*  App.orderedstories = jQuery.map(App.orderedstories, function( n, i ) {
          console.log(" ordered n : " + n + " i " + i);

          return ( i );
        });
        */

     //  console.log("ASTORY");
     //  console.dir(App.astory);
     
      //App.orderedstories.push(value[2].valueOf());
      // App.orderedstories.push(App.astory);

      if(value[1].valueOf() == 1){
        storyTemplate.find('#story-body').text(value[2].valueOf());
        storyTemplate.find('#story-date-value').text(date.toLocaleString('en-us', options));
        storyTemplate.find('#story-address-value').text(value[3].valueOf());
        storyTemplate.find('#story-address-value').attr("href", App.url + value[3].valueOf());
        console.dir(narrativeRow);
        narrativeRow.sort(function asc_sort(a, b) {
          //a.children[0].childNodes[5].innerText
          //return ($(a).children(0).childNodes(5).innerText) < ($(b).children(0).childNodes(5).innerText) ? 1 : -1;
         // console.log("in ASC_SORT");
         // return ($(b).text().toUpperCase()) < ($(a).text().toUpperCase()) ? 1 : -1;
        }).append(storyTemplate.html());
        //narrativeRow.append(storyTemplate.html());
      } else if (value[1].valueOf() == 2){

        eventTemplate.find('#event-story-body').text(value[2].valueOf());
        eventTemplate.find('#event-story-date-value').text(date.toLocaleString('en-us', options));
        eventTemplate.find('#event-story-address-value').text(value[3].valueOf());
        eventTemplate.find('#event-story-address-value').attr("href", App.url + value[3].valueOf()); 
        narrativeRow.append(eventTemplate.html());
        //narrativeRow.sort(sortDescending).append(eventTemplate.html());
        //eventTemplate.attr('link-row', 'link-row-event');
      } 
   /*   console.log("before sort");
      narrativeRow.sort(function asc_sort(a, b) {
        console.log("in ASC_SORT");
        //return ($(b).text().toUpperCase()) < ($(a).text().toUpperCase()) ? 1 : -1;
        });
      console.log("after sort");
      */
     // var sorted = $(".list li").sort(asc_sort);
  //  $(".list").append(sorted);
    

    }).catch(function(e) {
      console.log(storyItem + " FAILED ");
      console.log(e);
      App.setStatus("Error getting balance; see log.");
    });
     
     //console.log("ordered list:");
     ///console.dir(App.orderedstories);
/*      console.log("Afta");
    App.orderedstories.sort(function(a, b) {
         
         // a = new Date(a.date);
         // b = new Date(b.date);

          console.log("HERE");
          console.dir(a);
          console.log(" a.date: " + a.date);
          return a.date>b.date ? -1 : a.date<b.date ? 1 : 0;
      });
*/

    // console.log("SORTED list:");
     // console.dir(App.orderedstories);
  },



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

    App.contracts.narrativeChainy.deployed().then(function(instance) {
      metaInstance = instance;

      // Solidity: function addChainyData(string _narrative, uint256 _type) does not return anything.
      return metaInstance.addChainyData(JSON.stringify(narrativeText.value), 2);
    }).then(function(value) {

    // console.log("AddChainyData SUCCESS!")
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

    // TEST sort.
    /*function sortDescending(a, b) {
      var date1 = $(a).find(".ytube_date").text();
      var date2 = $(b).find(".ytube_date").text();
      return (date1 < date2) ? -1 : (date1 > date2) ? 1 : 0;
    };*/
    App.init();
    // TODO: Get popover to work
    //$("[data-toggle=popover]").popover();
  });
});
