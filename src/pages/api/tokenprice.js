// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import Moralis from 'moralis';

export default async function handler(req, res) {
  const {query} = req;

  Moralis.start({
    apiKey: process.env.MORALIS_KEY,
  })

  const responseOne = await Moralis.EvmApi.token.getTokenPrice({
    address: query.addressOne
  })

  const responseTwo = await Moralis.EvmApi.token.getTokenPrice({
    address: query.addressTwo
  })

  const usdPrices = {
    tokenOne: responseOne.raw.usdPrice,
    tokenTwo: responseTwo.raw.usdPrice,
    ratio: responseOne.raw.usdPrice/responseTwo.raw.usdPrice
  }

  res.status(200).json(usdPrices)
}
