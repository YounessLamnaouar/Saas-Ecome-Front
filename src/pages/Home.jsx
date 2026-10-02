import React from "react";
import Hero from "../components/Hero";
import Category from "../components/Category";
import Order from "../components/Order";
import Products from "../components/Products";
import Collection from "../components/Collection";
import Deals from "../components/Deals";
import Cards from "../components/Cards";
import Navbar from "../components/Navbar";

export default function Home() {
  return (
    <>
      <Hero />
      <Category />
      <Order />
      <Products />
      <Collection />
      <Deals />
      <Cards />
    </>
  );
}
