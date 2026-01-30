import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router";
import CategoryModal from "./components/features/admin/CategoryModal";
import AdminLayout from "./components/features/admin/Layout";
import AuthPageLayout from "./components/layout/AuthPageLayout";
import BaseLayout from "./components/layout/Layout";
import ProtectedRoute from "./components/features/auth/ProtectedRoute";
import ToasterWrapper from "./components/providers/ToasterWrapper";
import UnauthenticatedRoutes from "./components/features/auth/UnauthenticatedRoutes";
import AuthContextProvider from "./store/AuthContextProvider";
import AdminCategories from "./pages/Admin/Categories";
import AdminDashboard from "./pages/Admin/Dashboard";
import AdminProducts from "./pages/Admin/Products";
import ProductVariations from "./pages/Admin/ProductVariations";
import VariationKinds from "./pages/Admin/VariationKinds";
import VariationOptions from "./pages/Admin/VariationOptions";
import ForgotPassword from "./pages/ForgotPassword";
import Home from "./pages/Home";
import Login from "./pages/Login";
import NewProduct from "./pages/NewProduct";
import NotFound from "./pages/NotFound";
import Product from "./pages/Product";
import Register from "./pages/Register";
import ResetPassword from "./pages/ResetPassword";
import EditProduct from "./pages/EditProduct";
import VariationKindsCreate from "./components/features/admin/VariationKindsCreate";
import VariationKindsEdit from "./components/features/admin/VariationKindsEdit";
import VariationOptionModal from "./pages/Admin/VariationOptionModal";
import Collections from "./pages/Collections";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthContextProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<ToasterWrapper />}>
              <Route element={<ProtectedRoute requireAdmin />}>
                <Route path="/admin" element={<AdminLayout />}>
                  <Route index element={<AdminDashboard />} />
                  <Route path="products" element={<AdminProducts />} />
                  <Route path="categories" element={<AdminCategories />}>
                    <Route path="new" element={<CategoryModal />} />
                  </Route>
                  <Route path="variation-kinds" element={<VariationKinds />}>
                    <Route path="new" element={<VariationKindsCreate />} />
                    <Route path="edit/:id" element={<VariationKindsEdit />} />
                  </Route>
                  <Route
                    path="variation-options"
                    element={<VariationOptions />}
                  >
                    <Route path="new" element={<VariationOptionModal />} />
                  </Route>
                  <Route
                    path="product-variations"
                    element={<ProductVariations />}
                  />
                  <Route path="products/new" element={<NewProduct />} />
                  <Route path="products/edit/:slug" element={<EditProduct />} />
                </Route>
              </Route>

              <Route element={<BaseLayout />}>
                <Route path="/" element={<Home />} />
                <Route path="*" element={<NotFound />} />
                <Route path="/products/:slug" element={<Product />} />
                <Route path="/collections" element={<Collections />} />

                <Route element={<UnauthenticatedRoutes />}>
                  <Route element={<AuthPageLayout />}>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route
                      path="/forgot-password"
                      element={<ForgotPassword />}
                    />
                    <Route path="/reset-password" element={<ResetPassword />} />
                  </Route>
                </Route>
              </Route>
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthContextProvider>
    </QueryClientProvider>
  );
}

export default App;
