import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Rewards from "@/pages/Rewards";
import Navbar from "@/components/Navbar";
import OnboardingDialog from "@/components/OnboardingDialog";
import { useState, useEffect, createContext, useContext } from "react";
import { isOnboardingCompleted } from "@/lib/storage";

// Create a context for the showering state
type ShoweringContextType = {
  isShowering: boolean;
  setIsShowering: (value: boolean) => void;
};

export const ShoweringContext = createContext<ShoweringContextType>({
  isShowering: false,
  setIsShowering: () => {}
});

// Custom hook to use the showering context
export const useShoweringContext = () => useContext(ShoweringContext);

function Router() {
  // State to trigger re-render when onboarding completes
  const [onboardingDone, setOnboardingDone] = useState(isOnboardingCompleted());
  // State to track if user is currently showering
  const [isShowering, setIsShowering] = useState(false);

  return (
    <ShoweringContext.Provider value={{ isShowering, setIsShowering }}>
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-100">
        {/* Onboarding dialog */}
        <OnboardingDialog onComplete={() => setOnboardingDone(true)} />
        
        {/* Only show navbar when not showering */}
        {!isShowering && <Navbar />}
        
        <main className={`container mx-auto px-4 py-4 max-w-md ${isShowering ? 'pt-0' : ''}`}>
          <Switch>
            <Route path="/" component={Home} />
            <Route path="/rewards" component={Rewards} />
            <Route component={NotFound} />
          </Switch>
        </main>
      </div>
    </ShoweringContext.Provider>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
    </QueryClientProvider>
  );
}

export default App;
