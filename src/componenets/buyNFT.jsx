import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import NFT_ABI from '../contracts/NFT_ABI.json'; // Your contract's ABI
import NFTMarketplace_ABI from '../contracts/NFTMarketplace_ABI.json'; // Add the ABI JSON file for the NFTMarketplace contract

const BuyNFT = () => {
    const [nfts, setNfts] = useState([]);
    const nftAddress = '0x1387d5b2319f3A50b7A8a1CF3C7f8c6FA9BBac1A'
    const marketplaceAddress = '0xF75e1a3ce70D2F442AAA445f0ee37bD623a888Fc'

    useEffect(() => {
        loadNFTs();
    }, []);

    const loadNFTs = async () => {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const nftContract = new ethers.Contract(nftAddress, NFT_ABI, provider);
        const marketplaceContract = new ethers.Contract(marketplaceAddress, NFTMarketplace_ABI, provider);

        const tokenCount = await nftContract.tokenCounter();
        let items = [];

        for (let i = 0; i < tokenCount; i++) {
            try {
                const owner = await nftContract.ownerOf(i);
                if (owner === marketplaceAddress) {
                    const listing = await marketplaceContract.listings(i);
                    items.push({
                        tokenId: i,
                        price: listing.price,
                        tokenURI: await nftContract.tokenURI(i)
                    });
                }
            } catch (error) {
                console.error(error);
            }
        }

        setNfts(items);
    };

    const buyNFT = async (tokenId, price) => {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        const marketplaceContract = new ethers.Contract(marketplaceAddress, NFTMarketplace_ABI, signer);

        const tx = await marketplaceContract.buyToken(tokenId, { value: price });
        await tx.wait();

        alert('NFT bought successfully!');
        loadNFTs();
    };

    return (
        <div className='flex flex-col items-center justify-center mt-5 gap-4'>
            <h1 className='font-bold'>Buy NFTs</h1>
            <div className='border'>
                {nfts.map((nft) => (
                    <div key={nft.tokenId} className='flex flex-col gap-4 items-center justify-center'>
                        <p>Token ID: {nft.tokenId}</p>
                        <p>Price: {ethers.utils.formatEther(nft.price.toString())} MATIC</p>
                        <img src={`https://gateway.pinata.cloud/ipfs/${nft.tokenURI}`} className='size-40' />
                        <button className='bg-black text-white rounded px-4 py-2 mt-2' onClick={() => buyNFT(nft.tokenId, nft.price)}>Buy</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default BuyNFT;
