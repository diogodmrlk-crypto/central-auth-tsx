import { Toaster } from "sonner";
import * as Tooltip from "@radix-ui/react-tooltip";
import NotFound from "./pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import Home from "./pages/Home";
import Login from "./pages/Login";

function Router() {
  const { isLoggedIn } = useAuth();

  return (
    <>
      {!isLoggedIn && <Login />}
      {isLoggedIn && (
        <Switch>
          <Route path={"/"} component={Home} />
          <Route path={"/404"} component={NotFound} />
          <Route component={NotFound} />
        </Switch>
      )}
    </>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <AuthProvider>
          <Tooltip.Provider>
            <Toaster />
            <Router />
          </Tooltip.Provider>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
