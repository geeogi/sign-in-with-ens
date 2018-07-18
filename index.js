var sigUtil = require('eth-sig-util')
var Eth = require('ethjs')
var ENS = require('ethereum-ens');
window.Eth = Eth
var ens = new ENS(web3.currentProvider);
let userAccount = "0x"
var input = document.querySelector('#ensName');

/// watch input

input.addEventListener('input', function()
{
  ens.resolver(input.value).addr().then(function(addr) { 
    document.getElementById("user").innerHTML = "Your address: " + addr;
    userAccount = addr
  }).error();
});


//// get web 3 status 

if (typeof web3 !== 'undefined') {
  web3 = new Web3(web3.currentProvider);
  console.log("You've got Web3");
  //If there's web3, make sure it's not locked
  web3.eth.getAccounts(function(error, accounts) {
    if (error) {
    console.log(error);
    }
    else {
      if (accounts.length == 0){ //account is locked
      document.getElementById("user").innerHTML = "Please unlock your Web3 wallet.";
      console.log("Your Web3 is locked");
      }
      else {
        console.log("Your Web3 is unlocked");
        console.log("Your address is: " + accounts[0]);
        account = accounts[0]
        web3.version.getNetwork(function(err, netId) { //check if testnet or mainnet
  switch (netId) {
    case "1":
      console.log("You're connected to Mainnet.");
      break
    case "2":
      console.log("You're connected to a testnet.");
      break
    case "3":
      console.log("You're connected to Ropsten.");
      break
    case "4":
      console.log("You're connected to a testnet.");
      break
    case "42":
      console.log("You're connected to a testnet.");
      break
    default:
      console.log("You're connected to a testnet.");
  }
})
      }
    }
  })

} else {
        console.log("You don't have Web3, but you can log in with mobile (coming soon)");
        document.getElementById("user").innerHTML = "You don't have MetaMask installed";
        web3 = new Web3(web3.currentProvider);
   }

//// sign-in 


ethjsSignTypedDataButton.addEventListener('click', function(event) {
  event.preventDefault()

  const msgParams = [
    {
      type: 'string',
      name: 'Message',
      value: 'Hi ' + input.value + ', click below to sign into Zinc'
    },
    {
      type: 'uint32',
      name: 'Random: ',
      value: '1337'
    }
  ]

  var from = userAccount

  console.log('CLICKED, Sending personal sign request')
  var params = [msgParams, from]

  var eth = new Eth(web3.currentProvider)
  if(userAccount === web3.eth.accounts[0]) {
  
  eth.signTypedData(msgParams, from)
  .then((signed) => {
    console.log('Signed!  Result is: ', signed)
    console.log('Recovering...')

    // Note: This signed data should then be sent to the back-end for verification. Doing it all in browser here for demo.  

    const recovered = sigUtil.recoverTypedSignature({ data: msgParams, sig: signed })

    if (recovered === from ) {
      console.log('Successfully ecRecovered signer as ' + from);
      console.log('We can now send the user a token to keep them logged into this session');
      document.getElementById("sign-in").innerHTML = "You're now logged in as " + input.value;
      document.getElementById("user").innerHTML = "";
      
    } 
    else {
      document.getElementById("user").innerHTML = "Sign-in failed";
    }

  })
}
else {
  document.getElementById("user").innerHTML = "Sign-in failed";
}
})
