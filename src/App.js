import React, { useState, useEffect, useReducer } from 'react';
import { TrendingUp, TrendingDown, DollarSign, BarChart3, RefreshCw, Brain } from 'lucide-react';
import './App.css';

// Mock crypto data with 15 cryptocurrencies
const initialCryptoData = [
  { id: 'bitcoin', symbol: 'BTC', name: 'Bitcoin', price: 43250.50, change1h: 0.5, change24h: 2.3, change7d: -1.2, marketCap: 847000000000, volume24h: 28500000000, circulatingSupply: 19600000, maxSupply: 21000000 },
  { id: 'ethereum', symbol: 'ETH', name: 'Ethereum', price: 2680.75, change1h: -0.3, change24h: 1.8, change7d: 3.4, marketCap: 322000000000, volume24h: 15200000000, circulatingSupply: 120000000, maxSupply: null },
  { id: 'tether', symbol: 'USDT', name: 'Tether', price: 1.00, change1h: 0.0, change24h: 0.02, change7d: -0.01, marketCap: 95000000000, volume24h: 45000000000, circulatingSupply: 95000000000, maxSupply: null },
  { id: 'binancecoin', symbol: 'BNB', name: 'BNB', price: 315.80, change1h: 0.8, change24h: -1.5, change7d: 4.2, marketCap: 47500000000, volume24h: 1200000000, circulatingSupply: 150000000, maxSupply: 200000000 },
  { id: 'solana', symbol: 'SOL', name: 'Solana', price: 98.45, change1h: 1.2, change24h: 5.7, change7d: 8.9, marketCap: 42000000000, volume24h: 2800000000, circulatingSupply: 427000000, maxSupply: null },
  { id: 'xrp', symbol: 'XRP', name: 'XRP', price: 0.52, change1h: -0.7, change24h: -2.1, change7d: 1.8, marketCap: 28500000000, volume24h: 1500000000, circulatingSupply: 54700000000, maxSupply: 100000000000 },
  { id: 'usd-coin', symbol: 'USDC', name: 'USD Coin', price: 1.00, change1h: 0.0, change24h: 0.01, change7d: 0.0, marketCap: 25000000000, volume24h: 8500000000, circulatingSupply: 25000000000, maxSupply: null },
  { id: 'cardano', symbol: 'ADA', name: 'Cardano', price: 0.48, change1h: 0.3, change24h: 3.2, change7d: -0.8, marketCap: 17000000000, volume24h: 850000000, circulatingSupply: 35400000000, maxSupply: 45000000000 },
  { id: 'avalanche', symbol: 'AVAX', name: 'Avalanche', price: 36.75, change1h: -0.5, change24h: 4.1, change7d: 12.3, marketCap: 14200000000, volume24h: 650000000, circulatingSupply: 387000000, maxSupply: 720000000 },
  { id: 'dogecoin', symbol: 'DOGE', name: 'Dogecoin', price: 0.08, change1h: 0.2, change24h: -1.8, change7d: 5.4, marketCap: 11500000000, volume24h: 980000000, circulatingSupply: 143000000000, maxSupply: null },
  { id: 'chainlink', symbol: 'LINK', name: 'Chainlink', price: 14.25, change1h: 0.9, change24h: 2.7, change7d: -2.1, marketCap: 8400000000, volume24h: 420000000, circulatingSupply: 590000000, maxSupply: 1000000000 },
  { id: 'polygon', symbol: 'MATIC', name: 'Polygon', price: 0.92, change1h: -0.4, change24h: 1.9, change7d: 7.8, marketCap: 8200000000, volume24h: 380000000, circulatingSupply: 8900000000, maxSupply: 10000000000 },
  { id: 'litecoin', symbol: 'LTC', name: 'Litecoin', price: 72.50, change1h: 0.6, change24h: -0.9, change7d: 2.1, marketCap: 5400000000, volume24h: 290000000, circulatingSupply: 74500000, maxSupply: 84000000 },
  { id: 'uniswap', symbol: 'UNI', name: 'Uniswap', price: 6.85, change1h: 1.1, change24h: 3.8, change7d: -1.5, marketCap: 4100000000, volume24h: 180000000, circulatingSupply: 600000000, maxSupply: 1000000000 },
  { id: 'stellar', symbol: 'XLM', name: 'Stellar', price: 0.11, change1h: -0.2, change24h: 0.8, change7d: 4.2, marketCap: 3200000000, volume24h: 125000000, circulatingSupply: 28000000000, maxSupply: 50000000000 }
];

// Redux-like reducer for state management
const cryptoReducer = (state, action) => {
  switch (action.type) {
    case 'UPDATE_PRICES':
      return {
        ...state,
        cryptoData: action.payload,
        lastUpdated: new Date().toLocaleTimeString()
      };
    case 'UPDATE_PREDICTIONS':
      return {
        ...state,
        predictions: action.payload
      };
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload
      };
    default:
      return state;
  }
};

const initialState = {
  cryptoData: initialCryptoData,
  predictions: {},
  loading: false,
  lastUpdated: new Date().toLocaleTimeString()
};

// Mock AI price prediction function (Replace with OpenAI API)
const generatePricePrediction = async (crypto) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 100));
  
  const currentPrice = crypto.price;
  const volatility = Math.random() * 0.1 - 0.05; // -5% to +5% prediction
  const trendFactor = crypto.change24h > 0 ? 0.02 : -0.02;
  const predictedPrice = currentPrice * (1 + volatility + trendFactor);
  
  const confidence = Math.random() * 30 + 60; // 60-90% confidence
  const timeframe = '24h';
  
  return {
    price: predictedPrice,
    change: ((predictedPrice - currentPrice) / currentPrice) * 100,
    confidence: confidence,
    timeframe: timeframe,
    trend: predictedPrice > currentPrice ? 'bullish' : 'bearish'
  };
};

// OpenAI API integration function (Uncomment and configure when ready)
/*
const generateOpenAIPrediction = async (crypto) => {
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a cryptocurrency analyst. Provide price predictions based on market data.'
          },
          {
            role: 'user',
            content: `Analyze ${crypto.name} (${crypto.symbol}) with current price $${crypto.price}, 24h change: ${crypto.change24h}%. Predict price for next 24h and provide confidence level.`
          }
        ],
        max_tokens: 150
      })
    });
    
    const data = await response.json();
    // Parse the response and return structured prediction
    return parsePredictionResponse(data.choices[0].message.content, crypto);
  } catch (error) {
    console.error('OpenAI API Error:', error);
    return generatePricePrediction(crypto); // Fallback to mock
  }
};
*/

function App() {
  const [state, dispatch] = useReducer(cryptoReducer, initialState);
  const [sortConfig, setSortConfig] = useState({ key: 'marketCap', direction: 'desc' });

  // Simulate real-time updates every 2 seconds
  useEffect(() => {
    const updatePrices = () => {
      const updatedData = state.cryptoData.map(crypto => {
        const priceChange = (Math.random() - 0.5) * 0.02; // ±1% random change
        const newPrice = crypto.price * (1 + priceChange);
        const change1h = crypto.change1h + (Math.random() - 0.5) * 0.5;
        const change24h = crypto.change24h + (Math.random() - 0.5) * 1;
        const change7d = crypto.change7d + (Math.random() - 0.5) * 2;
        
        return {
          ...crypto,
          price: newPrice,
          change1h: change1h,
          change24h: change24h,
          change7d: change7d,
          marketCap: newPrice * crypto.circulatingSupply,
          volume24h: crypto.volume24h * (1 + (Math.random() - 0.5) * 0.1)
        };
      });
      
      dispatch({ type: 'UPDATE_PRICES', payload: updatedData });
    };

    const interval = setInterval(updatePrices, 2000);
    return () => clearInterval(interval);
  }, []);

  // Generate AI predictions
  useEffect(() => {
    const generatePredictions = async () => {
      const predictions = {};
      for (const crypto of state.cryptoData) {
        predictions[crypto.id] = await generatePricePrediction(crypto);
      }
      dispatch({ type: 'UPDATE_PREDICTIONS', payload: predictions });
    };

    generatePredictions();
    const predictionInterval = setInterval(generatePredictions, 10000); // Update predictions every 10 seconds
    return () => clearInterval(predictionInterval);
  }, [state.cryptoData]);

  const formatPrice = (price) => {
    if (price < 1) return `$${price.toFixed(4)}`;
    if (price < 100) return `$${price.toFixed(2)}`;
    return `$${price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const formatMarketCap = (cap) => {
    if (cap >= 1e12) return `$${(cap / 1e12).toFixed(2)}T`;
    if (cap >= 1e9) return `$${(cap / 1e9).toFixed(2)}B`;
    if (cap >= 1e6) return `$${(cap / 1e6).toFixed(2)}M`;
    return `$${cap.toLocaleString()}`;
  };

  const formatVolume = (volume) => {
    if (volume >= 1e9) return `$${(volume / 1e9).toFixed(2)}B`;
    if (volume >= 1e6) return `$${(volume / 1e6).toFixed(2)}M`;
    return `$${volume.toLocaleString()}`;
  };

  const formatSupply = (supply) => {
    if (!supply) return 'N/A';
    if (supply >= 1e9) return `${(supply / 1e9).toFixed(2)}B`;
    if (supply >= 1e6) return `${(supply / 1e6).toFixed(2)}M`;
    return supply.toLocaleString();
  };

  const getChangeColor = (change) => {
    return change >= 0 ? 'text-green-600' : 'text-red-600';
  };

  const getChangeIcon = (change) => {
    return change >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />;
  };

  const handleSort = (key) => {
    let direction = 'desc';
    if (sortConfig.key === key && sortConfig.direction === 'desc') {
      direction = 'asc';
    }
    setSortConfig({ key, direction });
  };

  const sortedData = [...state.cryptoData].sort((a, b) => {
    if (sortConfig.direction === 'asc') {
      return a[sortConfig.key] > b[sortConfig.key] ? 1 : -1;
    }
    return a[sortConfig.key] < b[sortConfig.key] ? 1 : -1;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-4">
      <div className="max-w-full mx-auto">
        {/* Header */}
        <div className="header-container">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="icon-container">
                <BarChart3 className="w-8 h-8 text-blue-400" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">Real-Time Crypto Tracker</h1>
                <p className="text-gray-300">Live cryptocurrency prices with AI predictions</p>
              </div>
            </div>
            <div className="flex items-center gap-4 text-white">
              <div className="flex items-center gap-2">
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span className="text-sm">Last updated: {state.lastUpdated}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Crypto Table */}
        <div className="table-container">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="table-header">
                <tr>
                  <th className="table-cell sortable" onClick={() => handleSort('name')}>
                    # Name
                  </th>
                  <th className="table-cell-left">Symbol</th>
                  <th className="table-cell-right sortable" onClick={() => handleSort('price')}>
                    Price
                  </th>
                  <th className="table-cell-right sortable" onClick={() => handleSort('change1h')}>
                    1h %
                  </th>
                  <th className="table-cell-right sortable" onClick={() => handleSort('change24h')}>
                    24h %
                  </th>
                  <th className="table-cell-right sortable" onClick={() => handleSort('change7d')}>
                    7d %
                  </th>
                  <th className="table-cell-right sortable" onClick={() => handleSort('marketCap')}>
                    Market Cap
                  </th>
                  <th className="table-cell-right sortable" onClick={() => handleSort('volume24h')}>
                    24h Volume
                  </th>
                  <th className="table-cell-right">
                    Circulating Supply
                  </th>
                  <th className="table-cell-right">
                    Max Supply
                  </th>
                  <th className="prediction-header">
                    <div className="flex items-center justify-center gap-2">
                      <Brain className="w-4 h-4" />
                      AI Price Prediction
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {sortedData.map((crypto, index) => {
                  const prediction = state.predictions[crypto.id];
                  return (
                    <tr key={crypto.id} className="table-row">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <span className="text-gray-400 font-medium">{index + 1}</span>
                          <div className="crypto-icon">
                            <span className="text-white text-xs font-bold">{crypto.symbol.charAt(0)}</span>
                          </div>
                          <span className="text-white font-medium">{crypto.name}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="text-gray-300 font-mono">{crypto.symbol}</span>
                      </td>
                      <td className="p-4 text-right">
                        <span className="text-white font-semibold">{formatPrice(crypto.price)}</span>
                      </td>
                      <td className="p-4 text-right">
                        <div className={`flex items-center justify-end gap-1 ${getChangeColor(crypto.change1h)}`}>
                          {getChangeIcon(crypto.change1h)}
                          <span className="font-medium">{crypto.change1h.toFixed(2)}%</span>
                        </div>
                      </td>
                      <td className="p-4 text-right">
                        <div className={`flex items-center justify-end gap-1 ${getChangeColor(crypto.change24h)}`}>
                          {getChangeIcon(crypto.change24h)}
                          <span className="font-medium">{crypto.change24h.toFixed(2)}%</span>
                        </div>
                      </td>
                      <td className="p-4 text-right">
                        <div className={`flex items-center justify-end gap-1 ${getChangeColor(crypto.change7d)}`}>
                          {getChangeIcon(crypto.change7d)}
                          <span className="font-medium">{crypto.change7d.toFixed(2)}%</span>
                        </div>
                      </td>
                      <td className="p-4 text-right">
                        <span className="text-white">{formatMarketCap(crypto.marketCap)}</span>
                      </td>
                      <td className="p-4 text-right">
                        <span className="text-white">{formatVolume(crypto.volume24h)}</span>
                      </td>
                      <td className="p-4 text-right">
                        <span className="text-gray-300">{formatSupply(crypto.circulatingSupply)}</span>
                      </td>
                      <td className="p-4 text-right">
                        <span className="text-gray-300">{formatSupply(crypto.maxSupply)}</span>
                      </td>
                      <td className="prediction-cell">
                        {prediction ? (
                          <div className="text-center">
                            <div className="text-white font-semibold mb-1">
                              {formatPrice(prediction.price)}
                            </div>
                            <div className={`flex items-center justify-center gap-1 text-sm ${getChangeColor(prediction.change)}`}>
                              {getChangeIcon(prediction.change)}
                              <span>{prediction.change.toFixed(2)}%</span>
                            </div>
                            <div className="text-xs text-gray-400 mt-1">
                              {prediction.confidence.toFixed(0)}% confidence
                            </div>
                            <div className="text-xs text-gray-500">
                              ({prediction.timeframe})
                            </div>
                          </div>
                        ) : (
                          <div className="text-center text-gray-400">
                            <div className="animate-pulse">Analyzing...</div>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="footer">
          <p>Real-time cryptocurrency data with AI-powered price predictions</p>
          <p className="mt-2">⚠️ This is a demo application. Price predictions are simulated and should not be used for actual trading decisions.</p>
        </div>
      </div>
    </div>
  );
}

export default App;