import { Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";
import Home from "./components/Home";
import Category from "./components/Category";
import Product from "./components/Product";
import History from "./components/History";

import "./css/Global.css";

function App() {
  return (
    <>
      <NavBar />
      <div className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/categories" element={<Category />} />
          <Route path="/products" element={<Product />} />
          <Route path="/history" element={<History />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
