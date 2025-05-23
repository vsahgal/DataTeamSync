import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Rewards from "@/pages/Rewards";
import Navbar from "@/components/Navbar";
import OnboardingDialog from "@/components/OnboardingDialog";
import { useState, useEffect } from "react";
import { isOnboardingCompleted } from "@/lib/storage";

function Router() {
  // State to trigger re-render when onboarding completes
  const [onboardingDone, setOnboardingDone] = useState(isOnboardingCompleted());

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-100">
      {/* Onboarding dialog */}
      <OnboardingDialog onComplete={() => setOnboardingDone(true)} />
      
      <Navbar />
      <main className="container mx-auto px-4 py-4 max-w-md">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/rewards" component={Rewards} />
          <Route component={NotFound} />
        </Switch>
      </main>
    </div>
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
