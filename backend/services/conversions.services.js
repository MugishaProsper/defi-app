import axios from 'axios';

async function convertCryptoToUSD (cryptoCurrency, amount) {
  try {
    const data_url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${cryptoCurrency}&x_cg_demo_api_key=CG-VLSUwQR5WW9trhtbGtDGrkgC`;
    const response = await axios.get(data_url);
    const data = response.data[0];
    return data.current_price * amount;
  } catch (error) {
    console.error(error.message);
  }
}
const convertedAmount = await convertCryptoToUSD("bitcoin", 0.210007);
console.log(convertedAmount);


