const forwarderOrigin = 'http://localhost:9010'
var contract_abi =  JSON.parse(abi);
var contract_address = '0x6f9598C5aA315aeD504eabFe6EE5EaEb39124d4f';
const provider = "https://rinkeby.infura.io/v3/46affe2abd6f43658c9552c6a6cf891d";

var web3Provider = new Web3.providers.HttpProvider(provider);
var web3 = new Web3(web3Provider);
var vokaNFTContract = new web3.eth.Contract(contract_abi, contract_address);

const initialize = () => {
	const getAccountsResult = document.getElementById('getAccountsResult');
	const getAccountsButton = document.getElementById('getAccounts');
	const onboardButton = document.getElementById('connectButton');
	const nftButton = document.getElementById('getOpenseaNFTs');
	const getNFTNumberButton = document.getElementById('getNFTNumber');
	const NFTNumerResult = document.getElementById('result');

	const onClickInstall = () => {
		onboardButton.innerText = 'Onboarding in progress';
		onboardButton.disabled = true;
		//On this object we have startOnboarding which will start the onboarding process for our end user
		onboarding.startOnboarding();
	};
	const onClickConnect = async () => {
		try {
			console.log("connect");
			// Will open the MetaMask UI
			// You should disable this button while the request is pending!
			await ethereum.request({ method: 'eth_requestAccounts' });
		} catch (error) {
			console.error(error);
		}
	};

	//Created check function to see if the MetaMask extension is installed
	const isMetaMaskInstalled = () => {
		//Have to check the ethereum binding on the window object to see if it's installed
		const { ethereum } = window;
		return Boolean(ethereum && ethereum.isMetaMask);
	};
	//------Inserted Code------\\
	const MetaMaskClientCheck = () => {
		//Now we check to see if MetaMask is installed
		if (!isMetaMaskInstalled()) {
			//If it isn't installed we ask the user to click to install it
			onboardButton.innerText = 'Click here to install MetaMask!';
			//When the button is clicked we call th is function
			onboardButton.onclick = onClickInstall;
			//The button is now disabled
			onboardButton.disabled = false;
		} else {
			//If it is installed we change our button text
			onboardButton.innerText = 'Connect';
			//When the button is clicked we call this function to connect the users MetaMask Wallet
			onboardButton.onclick = onClickConnect;
			//The button is now disabled
			onboardButton.disabled = false;
		}
	};

	async function mintNFT(tokenURI) {
		const nonce = await web3.eth.getTransactionCount(ethereum.selectedAddress, 'latest'); //get latest nonce

		//the transaction
		const tx = {
			'from': ethereum.selectedAddress,
			'to': contract_address,
			'nonce': nonce.toString(),
			'gas': '500000',
			'data': vokaNFTContract.methods.createNFT(ethereum.selectedAddress, tokenURI).encodeABI()
		};
		const txHash = await ethereum.request({
			method: 'eth_sendTransaction',
			params: [tx],
		});
		alert("mint NFT Succeed!");
		console.log(txHash);

		//const signPromise = web3.eth.accounts.signTransaction(tx, PRIVATE_KEY);
		//signPromise.then((signedTx) => {
			//web3.eth.sendSignedTransaction(signedTx.rawTransaction, function(err, hash) {
				//if (!err) {
					//console.log("The hash of your transaction is: ", hash, "\nCheck Alchemy's Mempool to view the status of your transaction!");
				//} else {
					//console.log("Something went wrong when submitting your transaction:", err)
				//}
			//});
		//}).catch((err) => {
			//console.log("Promise failed:", err);
		//});
	}

	getNFTNumberButton.addEventListener('click', async () => {
		vokaNFTContract.methods.balanceOf(ethereum.selectedAddress).call().then(function(res){
			console.log(res);
			result.innerHTML = res || '获取失败';
		});
	});
	MetaMaskClientCheck();
	//Eth_Accounts-getAccountsButton
	getAccountsButton.addEventListener('click', async () => {
		//we use eth_accounts because it returns a list of addresses owned by us.
		const accounts = await ethereum.request({ method: 'eth_accounts' });
		//We take the first address in the array of addresses and display it
		getAccountsResult.innerHTML = accounts[0] || 'Not able to get accounts';
	});
	nftButton.addEventListener('click', async() => {
		mintNFT("test2");
	});
}
window.addEventListener('DOMContentLoaded', initialize)
