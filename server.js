const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const Web3 = require('web3');
const truffle_connect = require('./connection/app.js');
//const truffle_connect = require('./public_static/js/app.js');

const bodyParser = require('body-parser');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());


app.use('/', express.static('public_static'));

/*
app.get('/getAccounts', (req, res) => {
  console.log("**** GET /getAccounts ****");
  truffle_connect.start(function (answer) {
    res.send(answer);
  })
});

app.post('/getBalance', (req, res) => {
  console.log("**** GET /getBalance ****");
  console.log(req.body);
  let currentAcount = req.body.account;

  truffle_connect.refreshBalance(currentAcount, (answer) => {
    let account_balance = answer;
    truffle_connect.start(function(answer){
      // get list of all accounts and send it along with the response
      let all_accounts = answer;
      response = [account_balance, all_accounts]
      res.send(response);
    });
  });
});
*/

// Should happen by default.
app.get('/getAccounts', (req, res) => {
  console.log("**** GET /getAccounts START ****");
  
  truffle_connect.start(function (answer) {
   // res.send(answer);
  });

  console.log(" ****** NOW LOAD THE NARRATIVE ******");
  var narrativelength;
  
  // refresh narrative should return an array.. I guess.
  truffle_connect.refreshNarrative(function (answer) {
  
    console.log(" +++++++ answer: " + answer);
    console.dir(answer);
   // narrativelength = answer;
   res.send(answer);
        // This doesn't work. Cannot have individual items sent via callback. Must be an array.
        /*

         for (var i = 0; i < narrativelength; i++) {
           //console.log("in loop " + i);
            truffle_connect.retrieveStoryItem(i, function (answer) {
                //narrativelength = answer;
                //res.send(answer);
                console.log(" i = " + i + "answer" + answer);
                res.send(answer);
            });
         }
         */
  })
  //console.log("narrativelength: " + narrativelength);
});

app.post('/contribute', (req, res) => {
  //alert("SENDCOIN");
  console.log("**** POST contributeText ****");
  console.log(req.body);

  let narrative = req.body.narrative;
 /* let amount = req.body.amount;
  let sender = req.body.sender;
  let receiver = req.body.receiver;
  */

  truffle_connect.contributeText(narrative, (answer) =>{
    console.log("contribute TEXT ANSWER!!");
    res.send(answer);
  });
 /* truffle_connect.sendCoin(amount, sender, receiver, (balance) => {
    res.send(balance);
  });
  */
});

app.listen(port, () => {

  // Maybe contract should be found AND loaded here?! When server starts!! IDK..
  console.log("IN APP.LISTEN");

  // Move this to clientside..? on pg 'load'
/*
  if (typeof web3 !== 'undefined') {
    console.warn("Using web3 detected from external source. If you find that your accounts don't appear or you have 0 MetaCoin, ensure you've configured that source properly. If using MetaMask, see the following link. Feel free to delete this warning. :) http://truffleframework.com/tutorials/truffle-and-metamask")
    // Use Mist/MetaMask's provider
    truffle_connect.web3 = new Web3(web3.currentProvider);
  } else {
    console.warn("No web3 detected. Falling back to http://127.0.0.1:7545. You should remove this fallback when you deploy live, as it's inherently insecure. Consider switching to Metamask for development. More info here: http://truffleframework.com/tutorials/truffle-and-metamask");
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    truffle_connect.web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:7545"));
  }
  */
  console.log("Express Listening at http://localhost:" + port);

});
