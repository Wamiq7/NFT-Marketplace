import React, { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import SubscriptionService from '../contracts/SubscriptionService.json'; // Your contract's ABI

// Replace with your contract address
const contractAddress = '0x4c78a62D2731baED7695C4cC8C7683413dC206ED';

const SubscribeNetflix = () => {
    const [userAccount, setUserAccount] = useState(null);
    const [isActive, setIsActive] = useState(false);
    const [statusMessage, setStatusMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    // Request account from MetaMask
    const requestAccount = useCallback(async () => {
        if (window.ethereum) {
            try {
                await window.ethereum.request({ method: 'eth_requestAccounts' });
                const accounts = await window.ethereum.request({ method: 'eth_accounts' });
                setUserAccount(accounts[0]);
            } catch (error) {
                setErrorMessage(`MetaMask request error: ${error.message}`);
            }
        } else {
            setErrorMessage('MetaMask is required. Please install it.');
        }
    }, []); // Memoize since it doesn't depend on other state/props

    // Initialize ethers and contract
    const initEthers = useCallback(async () => {
        if (userAccount) {
            try {
                const provider = new ethers.providers.Web3Provider(window.ethereum);
                const signer = provider.getSigner();
                const contract = new ethers.Contract(contractAddress, SubscriptionService, signer);

                const active = await contract.isActive(); // Check subscription status
                setIsActive(active);
            } catch (error) {
                setErrorMessage(`Contract initialization error: ${error.message}`);
            }
        }
    }, [userAccount]); // Depends on userAccount

    useEffect(() => {
        requestAccount(); // Connect to MetaMask on component mount
    }, [requestAccount]); // Depend on memoized function to avoid re-creation

    useEffect(() => {
        initEthers(); // Initialize contract when userAccount changes
    }, [userAccount, initEthers]); // Use memoized initEthers to avoid unnecessary re-renders

    const subscribe = useCallback(async () => {
        if (userAccount) {
            try {
                const provider = new ethers.providers.Web3Provider(window.ethereum);
                const signer = provider.getSigner();
                const contract = new ethers.Contract(contractAddress, SubscriptionService, signer);

                const tx = await contract.subscribe({
                    value: ethers.utils.parseEther('0.1'), // Adjust subscription cost
                });
                await tx.wait(); // Wait for transaction to complete

                setIsActive(true); // Update status
                setStatusMessage('Subscription successful!');
            } catch (error) {
                setErrorMessage(`Subscription error: ${error.message}`);
            }
        }
    }, [userAccount]); // Memoized function, depends on userAccount

    const cancelSubscription = useCallback(async () => {
        if (userAccount) {
            try {
                const provider = new ethers.providers.Web3Provider(window.ethereum);
                const signer = provider.getSigner();
                const contract = new ethers.Contract(contractAddress, SubscriptionService, signer);

                const tx = await contract.cancelSubscription();
                await tx.wait(); // Wait for transaction to complete

                setIsActive(false); // Update status
                setStatusMessage('Subscription cancelled!');
            } catch (error) {
                setErrorMessage(`Cancellation error: ${error.message}`);
            }
        }
    }, [userAccount]); // Memoized function, depends on userAccount

    return (
        <div className="subscription-app">
            <button onClick={requestAccount}>
                {userAccount ? 'Connected' : 'Connect Wallet'}
            </button>

            {userAccount && (
                <>
                    <p>Subscription Status: {isActive ? 'Active' : 'Inactive'}</p>
                    <div className='flex gap-3 items-center justify-center mt-4'>

                        <button className='px-5 py-3 text-white bg-black rounded' onClick={subscribe}>Subscribe</button>
                        <button className='px-5 py-3 text-white bg-black rounded' onClick={cancelSubscription} disabled={!isActive}>
                            Cancel Subscription
                        </button>
                    </div>
                </>
            )}

            {statusMessage && <p>{statusMessage}</p>}
            {errorMessage && <p>Error: {errorMessage}</p>}
        </div>
    );
};

export default SubscribeNetflix;
