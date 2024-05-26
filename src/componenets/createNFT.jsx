import React, { useState } from 'react';
import { ethers } from 'ethers';
import NFT_ABI from '../contracts/NFT_ABI.json'; // Your NFT contract's ABI
import NFTMarketplace_ABI from '../contracts/NFTMarketplace_ABI.json'; // Your Marketplace contract's ABI

const CreateNFT = () => {
    const [tokenURI, setTokenURI] = useState('');
    const [price, setPrice] = useState('');
    const nftAddress = '0x1387d5b2319f3A50b7A8a1CF3C7f8c6FA9BBac1A'; // Replace with your NFT contract address
    const marketplaceAddress = '0xF75e1a3ce70D2F442AAA445f0ee37bD623a888Fc'; // Replace with your Marketplace contract address

    const handleCreateNFT = async () => {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();

        const nftContract = new ethers.Contract(nftAddress, NFT_ABI, signer);
        const marketplaceContract = new ethers.Contract(marketplaceAddress, NFTMarketplace_ABI, signer);

        // Step 1: Create the NFT
        const tx = await nftContract.createToken(tokenURI);
        const receipt = await tx.wait();
        const tokenId = receipt.events[0].args.tokenId.toNumber();

        // Step 2: Approve the Marketplace to manage the NFT
        const approvalTx = await nftContract.approve(marketplaceAddress, tokenId);
        await approvalTx.wait();

        // Step 3: List the NFT on the Marketplace
        const priceInWei = ethers.utils.parseEther(price);
        const listingTx = await marketplaceContract.listToken(tokenId, priceInWei);
        await listingTx.wait();

        alert('NFT created, approved, and listed successfully!');
    };

    return (
        <div className='flex items-center flex-col mt-5 gap-2'>
            <h2>Create and List NFT</h2>
            <div className='flex flex-col gap-5 mt-4 items-center'>

                <input
                    type="text"
                    placeholder="Token URI"
                    value={tokenURI}
                    onChange={(e) => setTokenURI(e.target.value)}
                    className='border'
                />
                <input
                    type="text"
                    placeholder="Price in MATIC"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className='border'
                />
            </div>
            <button onClick={handleCreateNFT} className='bg-black text-white rounded px-1 py-2 mt-2'>Create and List NFT</button>
        </div>
    );
};

export default CreateNFT;
