import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./commonpages/Login";
import UserRegister from "./commonpages/UserRegister";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import ClientRegister from "./commonpages/ClientRegister";
import ClientDashboard from "./pages/dashboards/ClientDashboard";
import AdminDashboard from "./pages/dashboards/AdminDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import ClientApprov from "./pages/dashboards/admincomponent/ClientApprov"
import ForgotPassword from "./pages/ForgotPassword"
import ResetPassword from "./pages/ResetPassword"
import AddProduct from "./pages/AddProduct";
import ProductDetail from "./commonpages/ProductDetail";
import AddCategory from "./pages/AddCategory";
import AddTag from "./pages/AddTag";
import AddBrands from "./pages/AddBrands";
import UserDashboard from "./pages/dashboards/UserDashboard";
import AddAttributeTerms from "./pages/AddAttributeTerms";
import AddAttribute from "./pages/AddAttribute";
import Allproduct from "./commonpages/Allproduct"
import Cart from "./commonpages/Cart";
import Checkout from "./commonpages/Checkout";
import OrdersPage from "./pages/Orders";
import MyOrders from "./pages/myoders";
import Register from "./commonpages/register";

import "./index.css";
import Home from "./commonpages/Home"
import Profile from "./pages/Profile";
import ChangePassword from "./pages/ChangePassword";
import AllUsers from "./pages/AllUsers";
import AllProductList from "./pages/AllProductList"
import ProductEdit from "./pages/ProductEdit"
import ProductsList from "./pages/productList";
import ClientOrders from "./pages/ClientOrders"
import OrderSuccess from "./pages/OrderSuccess";
import Categories from "./commonpages/Categories";
import CategoryProducts from "./commonpages/CategoryProducts";
import BrandsPage from "./commonpages/Brands";
import BrandProductsPage from "./commonpages/BrandProductsPage.jsx";
import Brands from "./commonpages/Brands";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
export default function App() {
return (
<BrowserRouter>
<Routes>
  <Route path="/brand/:slug" element={<BrandProductsPage />} />
  <Route path="/brands" element={<Brands/>} />

  

<Route path="/" element={<Home />} />
<Route path="/login" element={<Login />} />
<Route path="/register" element={<Register/>}/>
<Route path="/user-register" element={<UserRegister />} />
<Route path="/client-register" element={<ClientRegister />} />
<Route path="/products/edit/:id" element={<ProductEdit/>} />

<Route path="/Allproducts" element={<ProductsList/>}/>

<Route
path="/user"
element={<ProtectedRoute role="user"><UserDashboard /></ProtectedRoute>}
/>
<Route
path="user/orders"
element={<MyOrders />}
/>

<Route
path="/client"
element={<ProtectedRoute role="client"><ClientDashboard /></ProtectedRoute>}
/>
<Route
path="/admin"
element={<ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>}
/>

<Route
path="/admin/clientapprov"
element={<ProtectedRoute role="admin"><ClientApprov/></ProtectedRoute>}
/>
<Route path="/forgot-password" element={<ForgotPassword />} />
<Route path="/reset-password" element={<ResetPassword />} />
<Route path="/add-product" element={<AddProduct />} />
{/* <Route path="/product-details" element={<ProductDetail />} /> */}
<Route path="/cart" element={<Cart />} />
<Route path="/checkout" element={<Checkout/>} />

 <Route path="/admin/categories" element={<ProtectedRoute roles={["admin", "client"]}><AddCategory /></ProtectedRoute>} />
 <Route path="/admin/tags" element={<ProtectedRoute roles={["admin", "client"]}> <AddTag /></ProtectedRoute>}/>
<Route path="/admin/brands" element={<ProtectedRoute roles={["admin", "client"]}><AddBrands/></ProtectedRoute>} />
<Route path="/products" element={<Allproduct/>}/>
<Route path="/product/:slug" element={<ProductDetail />} />
<Route path="admin/products" element={<ProtectedRoute role="admin" ><AllProductList/> </ProtectedRoute>}/>
<Route path="/client/orders" element={<ProtectedRoute roles={["admin", "client"]}><ClientOrders/></ProtectedRoute>} />

<Route
  path="/admin/attributes"
  element={
    <ProtectedRoute roles={["admin", "client"]}>
      <AddAttribute />
    </ProtectedRoute>
  }
/>
        <Route path="/categories" element={<Categories />} />
        < Route path="/category/:slug" element={<CategoryProducts />} />
        < Route path="/Brand" element={<BrandsPage />} /> 

<Route path="/order-success" element={<OrderSuccess/>} />
<Route path="/admin/users" element={<AllUsers/>} />

 <Route path="/profile" element={<Profile />} />
 <Route path="/change-password" element={<ChangePassword />} />

<Route path="/admin/orders" element={<ProtectedRoute role="admin"><OrdersPage/></ProtectedRoute>}/>
<Route
  path="/add-attribute-terms"
  element={
    <ProtectedRoute roles={["admin", "client"]}>
      <AddAttributeTerms />
    </ProtectedRoute>
  }
/>

</Routes>

</BrowserRouter>
);
}