// const sdk = require('api')('@opensea/v1.0#4vnv6l38vynjp');

const initializeOpensea = () => {
	const getOpenseaNFTsButton = document.getElementById('getOpenseaNFTs');
	getOpenseaNFTsButton.addEventListener('click', async () => {
		const url='https://testnets-api.opensea.io/api/v1/assets?owner=0x111Aa21DceCe2b5d15d309c703d2C71a5498D3E9&order_direction=desc&offset=0&limit=20';
		// const url = 'https://jsonplaceholder.typicode.com/posts';
		$.getJSON(url, function(result) {
			console.log(result);
		});
	});
}
window.addEventListener('DOMContentLoaded', initializeOpensea)

