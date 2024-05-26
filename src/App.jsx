import React from 'react'
import { Link, Route, Routes } from 'react-router-dom'
import CreateNFT from './componenets/createNFT'
import BuyNFT from './componenets/buyNFT'
import SubscribeNetflix from './componenets/subscribeNetflix'

const App = () => {
  return (
    <div>
      <nav >
        <ul className='flex justify-around bg-black h-20 text-white items-center'>
          <li className='hover:bg-white hover:text-black rounded py-2 px-1'>
            <Link to="/createNFT">Create and List NFT</Link>
          </li>
          <li className='hover:bg-white hover:text-black rounded py-2 px-1'>
            <Link to="/buyNFT">Buy NFT</Link>
          </li>
          <li className='hover:bg-white hover:text-black rounded py-2 px-1'>
            <Link to="/subscribeNetflix">Subscribe Netflix</Link>
          </li>
        </ul>
      </nav>
      <Routes>
        <Route path='/createNFT' element={<CreateNFT />} />
        <Route path='/buyNFT' element={<BuyNFT />} />
        <Route path='/subscribeNetflix' element={<SubscribeNetflix />} />
      </Routes>


    </div>
  )
}

export default App
