import React from 'react'
import Navbar from './Navbar'
import BrandsPage from './Brands'
import Banner from "./Banner"
import ProductSlider from './ProductSlider'
import CategorySlider from './CatSlider'
import Footer from './Footer'
function Home() {
  return (
    <div>
        <Navbar/>
        <Banner/>
        <BrandsPage/>
        <ProductSlider/>
        <CategorySlider/>
        <ProductSlider/>

<Footer/>
    </div>
  )
}

export default Home 