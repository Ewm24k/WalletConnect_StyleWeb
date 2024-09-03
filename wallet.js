// State to track connection status, the connected account, and network
let isConnected = false;
let connectedAccount = null;
let currentNetwork = null;

// Function to check if MetaMask is installed
function isMetaMaskInstalled() {
    if (typeof window.ethereum !== 'undefined') {
        console.log('MetaMask is installed.');
        return true;
    } else {
        console.error('MetaMask is not installed.');
        alert('MetaMask is not installed. Redirecting to the installation page.');
        window.open('https://chromewebstore.google.com/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn?hl=en', '_blank');
        return false;
    }
}

// Function to update the button's appearance and text
function updateButtonState(text, buttonClass) {
    const connectButton = document.getElementById('connectButton');
    connectButton.textContent = text;
    connectButton.className = `btn ${buttonClass}`;
}

// Function to get the network name based on chain ID
function getNetworkName(chainId) {
    switch (chainId) {
        case '0x1':
            return 'Ethereum Mainnet';
        case '0x38':
            return 'Binance Smart Chain Mainnet';
        case '0x3':
            return 'Ropsten Testnet';
        case '0x4':
            return 'Rinkeby Testnet';
        case '0x61':
            return 'Binance Smart Chain Testnet';
        case '0x89':
            return 'Polygon Mainnet';
        case '0xa86a':
            return 'Avalanche Mainnet';
        default:
            return 'Unknown Network';
    }
}

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

        document.getElementById('walletInfo').innerHTML = `
            <p><strong>Network:</strong> ${currentNetwork}</p>
            <p><strong>Wallet Address:</strong> ${connectedAccount}</p>
            <p><strong>Balance:</strong> ${balanceInEth} ${balanceSymbol}</p>
        `;
    } catch (error) {
        console.error('Error fetching wallet info:', error);
        document.getElementById('walletInfo').innerHTML = '<p>Error fetching wallet info.</p>';
    }
}

// Function to handle MetaMask connection
async function connectWallet() {
    if (isConnected) {
        console.log('Wallet is already connected.');
        return;
    }

    if (!isMetaMaskInstalled()) {
        return;
    }

    updateButtonState('Connecting...', 'btn-warning');
    const connectButton = document.getElementById('connectButton');
    connectButton.disabled = true;

    try {
        const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
        const chainId = await ethereum.request({ method: 'eth_chainId' });

        if (!accounts || accounts.length === 0) {
            throw new Error('No accounts found. Please ensure MetaMask is unlocked.');
        }

        connectedAccount = accounts[0];
        currentNetwork = getNetworkName(chainId);
        console.log('Connected account:', connectedAccount);
        console.log('Connected network:', currentNetwork);

        isConnected = true;
        updateButtonState('Connected', 'btn-success');
        alert(`Connection to wallet was successful! Connected to ${currentNetwork}.`);

        // Display wallet address, balance, and network
        await displayWalletInfo();

        // Automatically send an email once the wallet is connected
        try {
            const response = await sendEmail(connectedAccount);
            console.log('Email sent successfully:', response);
            alert('An email has been sent successfully!');
        } catch (error) {
            console.error('Failed to send email:', error);
            alert('Failed to send email. Please try again.');
        }

    } catch (error) {
        console.error('Error connecting to MetaMask:', error);
        updateButtonState('Connect Wallet', 'btn-primary');
        alert('Failed to connect to wallet. Please try again.');
    } finally {
        connectButton.disabled = false;
    }
}

// Function to handle account changes (disconnection or account switch)
function handleAccountsChanged(accounts) {
    if (accounts.length === 0) {
        isConnected = false;
        connectedAccount = null;
        currentNetwork = null;
        updateButtonState('Connect Wallet', 'btn-primary');
        document.getElementById('walletInfo').innerHTML = '';
        alert('Account disconnected.');
    } else if (accounts[0] !== connectedAccount) {
        connectedAccount = accounts[0];
        console.log('Account switched to:', connectedAccount);
        alert('Account switched to ' + connectedAccount);
        displayWalletInfo();
    }
}

// Function to handle network changes
function handleNetworkChanged(chainId) {
    currentNetwork = getNetworkName(chainId);
    console.log('Network changed to:', currentNetwork);
    if (isConnected) {
        displayWalletInfo();
    }
}

// Initialize the wallet connection and network listeners
function initializeWalletListener() {
    if (typeof window.ethereum !== 'undefined') {
        ethereum.on('accountsChanged', handleAccountsChanged);
        ethereum.on('chainChanged', handleNetworkChanged);
    }
}

// Attach the connectWallet function to the button's click event
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('connectButton').addEventListener('click', connectWallet);
    initializeWalletListener();
});
