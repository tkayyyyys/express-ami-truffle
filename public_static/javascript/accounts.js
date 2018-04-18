// This is JQuery.
$(document).ready(function () {
  var curraccount;
  var selectedAccount;


   //const Web3 = require('web3');
   //const truffle_connect = require('./connection/app.js');   

 /*  $.post('/sendCoin', {webthreee : this.web3}, function (response) {
     // $('#balance').text(response);
      //$('#status').text("Sent!!");
      console.log("response:" + response);
    })
*/

  //alert("YE");

 $.get('/getAccounts', function (response) {
    console.dir(" RESPONSE TO CLIENT: " + response);
    

      var storyTemplate = $('#storyTemplate');
      var narrativeRow = $('#returnedNarrativeText');

      for(let i = 0; i < response.length; i++){
        console.log(i + "response i: " + response[i]);
        storyTemplate.find('#narrative-main-text').text(response[i]);
     //   storyTemplate.find('#narrative-main-text').text(value[2].valueOf());
     //   storyTemplate.find('#narrative-main-date').text(date.toLocaleString('en-us', options));
     //   storyTemplate.find('#narrative-main-address').text(value[3].valueOf());
        narrativeRow.append(storyTemplate.html());
      }
   
    //console.log("CLIENT RESPONSE GET ACCOUNTS! : " + response.length);
    //for(let i = 0; i < response.length; i++){
    //  curraccount = response[i];
    //  $('#options').append("<option value='"+curraccount+"'>"+curraccount+"</option>");
   // }
  })
  
  
/*
  $('#submit').click(function () {
    selectedAccount = $('#options').val();
    console.log(selectedAccount);
    $.post('/getBalance', {account : selectedAccount}, function (response) {
      $('.select').removeClass("active");
      $('.send').addClass("active");
      $('#account').text(selectedAccount);
      $('#balance').text(response[0]);
      var current_account_index = response[1].indexOf(selectedAccount);
      response[1].splice(current_account_index,1); //remove the selected account from the list of accounts you can send to.
      $('#all-accounts').addClass("active");
      var list= $('#all-accounts > ol');
      for(let i=0;i< response[1].length;i++){
        li="<li>"+response[1][i]+"</li>";
        list.append(li)
      }


    })
  })
  */

   $('.btn-contribute').click(function () {
    //$('#status').text("Sending...");
     //var narrativeText = document.getElementById("narrativeText");
     let narrativeText = $('#narrativeText').val();
     //alert("HERE");
    $.post('/contribute', {narrative: narrativeText}, function (response) {
      console.log(response);
      console.log("SENT");
      //$('#balance').text(response);
      //$('#status').text("Sent!!");
    })

    // alert("narrativeText" + narrativeText);
   /* let amount = $('#amount').val();
    let receiver = $('#receiver').val();
    $.post('/sendCoin', {amount : amount, sender : selectedAccount, receiver : receiver}, function (response) {
      $('#balance').text(response);
      $('#status').text("Sent!!");
    })*/

  });

 /*
  $('#send').click(function () {
    $('#status').text("Sending...");
    let amount = $('#amount').val();
    let receiver = $('#receiver').val();
    $.post('/sendCoin', {amount : amount, sender : selectedAccount, receiver : receiver}, function (response) {
      $('#balance').text(response);
      $('#status').text("Sent!!");
    })

  });
  */
})
