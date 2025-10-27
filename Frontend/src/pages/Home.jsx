import React from 'react'
import Navbar from '../components/Navbar'
import About from '../components/About'
import AiTools from '../components/AiTools'
import Reviews from '../components/Reviews'
import Plans from '../components/Plans'
import Footer from '../components/Footer'

const Home = () => {
  return (
    <>
      <Navbar />

      <section id="about">
        <About />
      </section>

      <section id="ai-tools">
        <AiTools />
      </section>

      <section id="reviews">
        <Reviews />
      </section>

      <section id="subscription">
        <Plans />
      </section>

      <section id="contact">
        <Footer />
      </section>
    </>
  )
}

export default Home
