// Mac: shift + option + f
// requirejs(["lodash"], function (lodash) {
//     const headerEl = document.getElementById("header");
//     headerEl.textContent = lodash.upperCase("hello world");
//   });
// const FARMING_CONTRACT_ADDRESS = "0x2aE5d5EEaa65F0E6F1489Ef67fd3058D3CcaDf19"
// const LP_TOKEN_ADDRESS = "0x880921d4FC666412A1a4B4AC35b3495cB0cc0281"

const loginButton = document.getElementById('loginButton')
const logoutButton = document.getElementById('logoutButton')
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

    logoutButton.removeEventListener('click', signOutOfMetaMask)
    setTimeout(() => {
        loginButton.addEventListener('click', loginWithMetaMask)
    }, 200)
    isConnected = false;
}


async function loginWithMetaMask() {
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
    const chainId = 97

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
                            chainName: 'BINANCE TEST',
                            chainId: web3.utils.toHex(chainId),
                            nativeCurrency: { name: 'TBNB', decimals: 18, symbol: 'TBNB' },
                            rpcUrls: ['https://data-seed-prebsc-1-s1.binance.org:8545/'],
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
            //deu merda
            console.log(result);
        }
    );

}
