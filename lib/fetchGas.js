import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const API_KEY = process.env.ALCHEMY_API_KEY;

const ALCHEMY_URLS = {
  eth: `https://eth-mainnet.g.alchemy.com/v2/${API_KEY}`,
  polygon: `https://polygonzkevm-mainnet.g.alchemy.com/v2/${API_KEY}`,
  arbitrum: `https://arb-mainnet.g.alchemy.com/v2/${API_KEY}`
};

const COINGECKO_IDS = {
  eth: 'ethereum',
  polygon: 'matic-network',
  arbitrum: 'arbitrum'
};

async function getTokenPriceUsd(tokenId) {
  const url = `https://api.coingecko.com/api/v3/simple/price?ids=${tokenId}&vs_currencies=usd`;
  const res = await axios.get(url);
  return res.data[tokenId].usd;
}

export default async function fetchGas(network = 'eth') {
  const url = ALCHEMY_URLS[network];
  const tokenId = COINGECKO_IDS[network];

  if (!url || !tokenId) {
    throw new Error(`Network "${network}" is not supported.`);
  }

  try {
    const res = await axios.post(url, {
      jsonrpc: '2.0',
      id: 1,
      method: 'eth_gasPrice',
      params: []
    });

    const gasPriceWei = BigInt(res.data.result);
    const gasPriceGwei = Number(gasPriceWei) / 1e9;

    const tokenPriceUsd = await getTokenPriceUsd(tokenId);
    const estimatedCostUsd = ((gasPriceGwei * 21000) / 1e9) * tokenPriceUsd;

    return {
      network,
      gasPrice: gasPriceGwei.toFixed(2),
      usd: estimatedCostUsd.toFixed(2)
    };
  } catch (err) {
    throw new Error('Failed to fetch gas data from Alchemy or CoinGecko.');
  }
}
