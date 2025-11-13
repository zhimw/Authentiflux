import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import '@rainbow-me/rainbowkit/styles.css';

import { config } from './config/wagmi';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Verify from './pages/Verify';
import MyItems from './pages/MyItems';
import ItemDetail from './pages/ItemDetail';
import Mint from './pages/Mint';

// Create a client for React Query
const queryClient = new QueryClient();

function App() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <Router>
            <div className="App">
              <Navbar />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/verify" element={<Verify />} />
                <Route path="/my-items" element={<MyItems />} />
                <Route path="/item/:tokenId" element={<ItemDetail />} />
                <Route path="/mint" element={<Mint />} />
              </Routes>
            </div>
          </Router>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default App;

