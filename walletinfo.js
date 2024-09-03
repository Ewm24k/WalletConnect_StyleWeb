// Function to fetch and display the balance and wallet address
async function displayWalletInfo() {
    if (!connectedAccount || !currentNetwork) return;

    try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const balance = await provider.getBalance(connectedAccount);
        const balanceInEth = ethers.utils.formatEther(balance);

        let balanceSymbol = 'ETH'; // Default to ETH
        switch (currentNetwork) {
            case 'Binance Smart Chain Mainnet':
            case 'Binance Smart Chain Testnet':
                balanceSymbol = 'BNB';
                break;
            case 'Polygon Mainnet':
                balanceSymbol = 'MATIC';
                break;
            case 'Avalanche Mainnet':
                balanceSymbol = 'AVAX';
                break;
        }

        // Update the span elements with the wallet information
        document.getElementById('networkConnection').textContent = currentNetwork;
        document.getElementById('walletAddress').textContent = connectedAccount;
        document.getElementById('walletBalance').textContent = `${balanceInEth} ${balanceSymbol}`;
    } catch (error) {
        console.error('Error fetching wallet info:', error);
        // Display an error message in case of failure
        document.getElementById('networkConnection').textContent = 'Error fetching network info.';
        document.getElementById('walletAddress').textContent = 'Error fetching wallet address.';
        document.getElementById('walletBalance').textContent = 'Error fetching balance.';
    }
}
