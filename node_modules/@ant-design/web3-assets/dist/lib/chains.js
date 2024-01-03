"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Polygon = exports.Optimism = exports.Mainnet = exports.Goerli = exports.BSC = exports.Avalanche = exports.Arbitrum = void 0;
var _web3Common = require("@ant-design/web3-common");
var _web3Icons = require("@ant-design/web3-icons");
var _jsxRuntime = require("react/jsx-runtime");
const Mainnet = exports.Mainnet = {
  id: _web3Common.ChainIds.Mainnet,
  name: 'Ethereum',
  icon: /*#__PURE__*/(0, _jsxRuntime.jsx)(_web3Icons.EthereumCircleColorful, {}),
  browser: {
    icon: /*#__PURE__*/(0, _jsxRuntime.jsx)(_web3Icons.EtherscanCircleColorful, {}),
    getBrowserLink: (0, _web3Common.createGetBrowserLink)('https://etherscan.io')
  },
  nativeCurrency: {
    icon: /*#__PURE__*/(0, _jsxRuntime.jsx)(_web3Icons.EthereumFilled, {}),
    name: 'Ether',
    symbol: 'ETH',
    decimals: 18
  }
};
const Goerli = exports.Goerli = {
  id: _web3Common.ChainIds.Goerli,
  name: 'Goerli',
  icon: /*#__PURE__*/(0, _jsxRuntime.jsx)(_web3Icons.EthereumCircleColorful, {}),
  browser: {
    icon: /*#__PURE__*/(0, _jsxRuntime.jsx)(_web3Icons.EthereumCircleColorful, {}),
    getBrowserLink: (0, _web3Common.createGetBrowserLink)('https://goerli.etherscan.io')
  },
  nativeCurrency: {
    name: 'Ether',
    symbol: 'ETH',
    decimals: 18
  }
};
const Polygon = exports.Polygon = {
  id: _web3Common.ChainIds.Polygon,
  name: 'Polygon',
  icon: /*#__PURE__*/(0, _jsxRuntime.jsx)(_web3Icons.PolygonCircleColorful, {}),
  browser: {
    icon: /*#__PURE__*/(0, _jsxRuntime.jsx)(_web3Icons.PolygonCircleColorful, {}),
    getBrowserLink: (0, _web3Common.createGetBrowserLink)('https://polygonscan.com')
  },
  nativeCurrency: {
    name: 'MATIC',
    symbol: 'MATIC',
    decimals: 18
  }
};
const BSC = exports.BSC = {
  id: _web3Common.ChainIds.BSC,
  name: 'BNB Smart Chain',
  icon: /*#__PURE__*/(0, _jsxRuntime.jsx)(_web3Icons.BSCCircleColorful, {}),
  browser: {
    icon: /*#__PURE__*/(0, _jsxRuntime.jsx)(_web3Icons.BSCCircleColorful, {}),
    getBrowserLink: (0, _web3Common.createGetBrowserLink)('https://bscscan.com')
  },
  nativeCurrency: {
    decimals: 18,
    name: 'BNB',
    symbol: 'BNB'
  }
};
const Arbitrum = exports.Arbitrum = {
  id: _web3Common.ChainIds.Arbitrum,
  name: 'Arbitrum One',
  icon: /*#__PURE__*/(0, _jsxRuntime.jsx)(_web3Icons.ArbitrumCircleColorful, {}),
  browser: {
    icon: /*#__PURE__*/(0, _jsxRuntime.jsx)(_web3Icons.ArbitrumCircleColorful, {}),
    getBrowserLink: (0, _web3Common.createGetBrowserLink)('https://arbiscan.io')
  },
  nativeCurrency: {
    name: 'Ether',
    symbol: 'ETH',
    decimals: 18
  }
};
const Optimism = exports.Optimism = {
  id: _web3Common.ChainIds.Optimism,
  name: 'OP Mainnet',
  icon: /*#__PURE__*/(0, _jsxRuntime.jsx)(_web3Icons.OptimismCircleColorful, {}),
  browser: {
    icon: /*#__PURE__*/(0, _jsxRuntime.jsx)(_web3Icons.OptimismCircleColorful, {}),
    getBrowserLink: (0, _web3Common.createGetBrowserLink)('https://optimistic.etherscan.io')
  },
  nativeCurrency: {
    name: 'Ether',
    symbol: 'ETH',
    decimals: 18
  }
};
const Avalanche = exports.Avalanche = {
  id: _web3Common.ChainIds.Avalanche,
  name: 'Avalanche',
  icon: /*#__PURE__*/(0, _jsxRuntime.jsx)(_web3Icons.AvalancheCircleColorful, {}),
  browser: {
    icon: /*#__PURE__*/(0, _jsxRuntime.jsx)(_web3Icons.AvalancheCircleColorful, {}),
    getBrowserLink: (0, _web3Common.createGetBrowserLink)('https://snowtrace.io')
  },
  nativeCurrency: {
    name: 'Avalanche',
    symbol: 'AVAX',
    decimals: 18
  }
};