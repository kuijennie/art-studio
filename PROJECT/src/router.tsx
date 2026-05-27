import { createRootRoute, createRoute, createRouter, Outlet } from '@tanstack/react-router'
import { CartProvider } from './context/CartContext'
import Header from './components/Header'
import CartDrawer from './components/CartDrawer'
import HomePage from './pages/HomePage'
import ProductPage from './pages/ProductPage'
import CheckoutPage from './pages/CheckoutPage'
import SignInPage from './pages/SignInPage'
import SignUpPage from './pages/SignUpPage'
import AdminPage from './pages/AdminPage'

function RootLayout() {
  return (
    <CartProvider>
      <div aria-hidden="true" className="grain" />
      <Outlet />
      <CartDrawer />
    </CartProvider>
  )
}

function HomeLayout() {
  return (
    <>
      <Header darkMode={true} />
      <HomePage />
    </>
  )
}

function ProductLayout() {
  return (
    <>
      <Header darkMode={true} />
      <ProductPage />
    </>
  )
}

const rootRoute = createRootRoute({ component: RootLayout })

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HomeLayout,
})

const productRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/products/$slug',
  component: ProductLayout,
})

const checkoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/checkout',
  component: CheckoutPage,
})

const signInRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/sign-in',
  component: SignInPage,
})

const signInSplatRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/sign-in/$',
  component: SignInPage,
})

const signUpRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/sign-up',
  component: SignUpPage,
})

const signUpSplatRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/sign-up/$',
  component: SignUpPage,
})

const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin',
  component: AdminPage,
})

const routeTree = rootRoute.addChildren([
  indexRoute,
  productRoute,
  checkoutRoute,
  signInRoute,
  signInSplatRoute,
  signUpRoute,
  signUpSplatRoute,
  adminRoute,
])

export const router = createRouter({ routeTree })

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
