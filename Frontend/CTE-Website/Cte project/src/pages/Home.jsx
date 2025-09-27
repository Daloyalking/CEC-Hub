import React from 'react'
import Navbar from '../components/Navbar'
import HomeNotification from '../components/HomeNotification'
import HomeProject from '../components/HomeProject'
import HomeGallery from '../components/HomeGallery'

const Home = () => {
  return (
    <div>
        <HomeNotification/>
        <HomeProject/>
        <HomeGallery/>
    </div>
  )
}

export default Home