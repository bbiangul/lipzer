// Mac: shift + option + f
// requirejs(["lodash"], function (lodash) {
//     const headerEl = document.getElementById("header");
//     headerEl.textContent = lodash.upperCase("hello world");
//   });
// const FARMING_CONTRACT_ADDRESS = "0x2aE5d5EEaa65F0E6F1489Ef67fd3058D3CcaDf19"
// const LP_TOKEN_ADDRESS = "0x880921d4FC666412A1a4B4AC35b3495cB0cc0281"

const liPrice = document.getElementById('liPrice')
const loginButton = document.getElementById('loginButton')
const logoutButton = document.getElementById('logoutButton')
const buylip = document.getElementById('buylip')
const userWallet = document.getElementById('userWallet')
const logged = document.getElementById('dropdownMenuButton')
let abi;
let web3;
let currentAccount;

window.addEventListener('DOMContentLoaded', () => {
    begin()
    try {
        const response = fetch("https://api.pancakeswap.info/api/v2/tokens");
        response.then(function (res) {
            const priceData = res.json();
            return priceData.then(function (result){
                console.log(result.data["0x0DFCb45EAE071B3b846E220560Bbcdd958414d78"].price)
            })  
        }, function (err){

        })
         //Address of DOGECOIN on BSC Mainnet
      } catch (e) {
        console.log(e);
        return 0;
      }
});

const getDodgecoinPriceInBNB = async () => {
    try {
      const response = await fetch("https://api.pancakeswap.info/api/v2/tokens");
      const priceData = await response.json();
      return priceData.data["0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82"].price_BNB; //Address of DOGECOIN on BSC Mainnet
    } catch (e) {
      console.log(e);
      return 0;
    }
  };

function begin() {
    requirejs(["upnav"], function(util) {
        //This function is called when scripts/helper/util.js is loaded.
        //If util.js calls define(), then this function is not fired until
        //util's dependencies have loaded, and the util argument will hold
        //the module value for "helper/util".
        // https://requirejs.org/docs/errors.html#scripterror
        console.log(util)
    }, function (error){
        console.log(error)
    });
    // ("#upnav").html(menu)
    if (!window.ethereum) {
        loginButton.innerText = 'MetaMask is not installed'
        loginButton.classList.remove('bg-purple-500', 'text-white')
        loginButton.classList.add('bg-gray-500', 'text-gray-100', 'cursor-not-allowed')
        return false
    }

    loginButton.addEventListener('click', loginWithMetaMask)

    web3 = new Web3(window.ethereum);
    web3.eth.net.isListening()

    .then((ac) => {
        console.log('is connected' + ac)
        getc()
    })
    .catch(e => console.log('Wow. Something went wrong: ' + e));

    $.getJSON("staking.json", function (result) {
        abi = result
    });
}

function signOutOfMetaMask() {
    userWallet.innerText = ''
    loginButton.style = 'display: block;'
    logged.style = 'display: none;'
    DivLipValue.classList = 'd-flex justify-content-center mr-3 DivLipValue'
    liPrice.classList = 'li-price'

    logoutButton.removeEventListener('click', signOutOfMetaMask)
    setTimeout(() => {
        loginButton.addEventListener('click', loginWithMetaMask)
    }, 200)
    isConnected = false;
}


async function loginWithMetaMask() {
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
    const chainId = 56

    // var version = web3.version.api;
    // console.log("Using web3 version: " + version);
    // web3 = new Web3(new Web3.providers.HttpProvider("https://bsc-dataseed1.binance.org:443"));

    if (window.ethereum.networkVersion != chainId) {
        try {

            await window.ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: web3.utils.toHex(chainId) }],
            });
            isConnected = true;
        } catch (err) {
            // This error code indicates that the chain has not been added to MetaMask.
            if (err.code === 4902) {
                await window.ethereum.request({
                    method: 'wallet_addEthereumChain',
                    params: [
                        {
                            chainName: 'BINANCE SMART CHAIN',
                            chainId: web3.utils.toHex(chainId),
                            nativeCurrency: { name: 'BNB', decimals: 18, symbol: 'BNB' },
                            rpcUrls: ['https://bsc-dataseed1.binance.org'],
                        },
                    ],
                });
            }
        }
    }

    if (!accounts) { return }
    currentAccount = accounts[0];
    connected(accounts[0]);

    getValue()
}

function getc() {
    const accounts = window.ethereum.request({ method: 'eth_requestAccounts' })
    accounts.then(function (result) {
        connected(result[0])
    }, function (error) {
        //loginWithMetaMask();
        console.log("user is not connected")
    })
    if (!accounts) { return }
    currentAccount = accounts[0];
}

function connected(userWalletAddress) {
    userWallet.innerText = userWalletAddress
    loginButton.style = 'display: none;'
    logged.style = 'display: block;'
    DivLipValue.classList = 'd-flex justify-content-center mr-2 DivLipValue'
    liPrice.classList = 'li-price active'
    buylip.innerText = "Buy lip"

    loginButton.removeEventListener('click', loginWithMetaMask)
    setTimeout(() => {
        logoutButton.addEventListener('click', signOutOfMetaMask)
    }, 200)
}

async function getValue() {
    console.log('GetValue')
    const contractFirst = new web3.eth.Contract(
        abi,
        "0x2aE5d5EEaa65F0E6F1489Ef67fd3058D3CcaDf19"
    );
    contractFirst.methods.pendingLipzer(0, "0x332E0A2Bf8B0fDEF523Cd4f0E8f72911e78E4958").call().then(function (result) {
        //contractFirst.methods.owner().call().then(function (result) {                
        $('#getValue').html(result)
    });

    loading = true;
    contractFirst.methods.setDevAddress("0x332E0A2Bf8B0fDEF523Cd4f0E8f72911e78E4958").send({ from: currentAccount }).then(
        // se cair aqui eh sucesso
        function (result) {
            console.log(result);
        }, function (err) {
            //deu erro
            console.log(result);
        }
    );

}

var navbar = '<div class="navbar navbar-expand-lg navbarcolor navbar-dark"> <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarTogglerDemo01" aria-controls="navbarTogglerDemo01" aria-expanded="false" aria-label="Toggle navigation"> <span class="navbar-toggler-icon"></span> </button> <img class="logo col-lg-auto col-md-auto mr-auto" src="img/logo.png"> <div class="collapse navbar-collapse" id="navbarTogglerDemo01"> <ul class="navbar-nav d-flex justify-content-around"> <li class="nav-item active"> <a href="index.html" class="nav-link">Home</a> </li><li class="nav-item"> <a href="nft.html" class="nav-link">NFT</a> </li><li class="nav-item"> <a href="earn.html" class="nav-link">Earn</a> </li><li class="nav-item"> <a href="marketplace.html" class="nav-link">Marketplace</a> </li><li class="nav-item mr-auto"> <a href="invite.html" class="nav-link">Friends</a> </li><li class="nav-item li-price" id="liPrice"> <div id="DivLipValue" class="d-flex justify-content-center mr-3 DivLipValue"> <img class="L-style" src="./img/L.png"/> <p class="font-weight-bold LipValue">$5,24</p></div></li><li class="nav-item"> <div> <button type="button" id="loginButton" class="btn btn-light block">Connect to Wallet</button> <div class="dropdown"> <img src="./img/profile.png" class="dropdown-toggle img-connected" id="dropdownMenuButton" data-toggle="dropdown" aria-expanded="false"/> <div class="dropdown-menu text-center" aria-labelledby="dropdownMenuButton"> <div class=""> <p class="p-user" id="userWallet"></p></div><div class="d-flex justify-content-center"> <div style="background-color: #071b3c; border-radius: 20px;" class="mb-3 col-9"> <p style="bottom: -18px; color: white;">Total Balance:</p><div class="d-flex justify-content-center mb-2"> <p class="mt-2 font-weight-bold" style="color: white; font-size: larger;">0.000100</p><p class="mt-2 font-weight-bold" style="color: white; font-size: larger;"> LIP</p></div></div></div><button class="btn btn-lip btn-connect mb-2" type="button" id="logoutButton">Logout metamask</button> </div></div></div></li></ul> </div></div>';
document.getElementById('navbar').innerHTML = navbar;