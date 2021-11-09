const sdk = require('@defillama/sdk');

const REVA_CHEF = "0xd7550285532f1642511b16Df858546F2593d638B";
const REVA_CHEF_ABI = require("./RevaChef.json");

const config = require("./mainnet.json");

async function tvl(timestamp, block) {
  const tokenAddresses = Array.from(new Set(config.tokens.map((token) => token.address)));

  const calls = tokenAddresses.map((tokenAddress) => ({
    params: tokenAddress,
    target: REVA_CHEF,
  }));

  const tokenInfos = (await sdk.api.abi.multiCall({
    abi: REVA_CHEF_ABI['tokens'],
    calls,
    block: block,
    chain: "bsc",
  })).output;

  const balances = {};
  tokenInfos.forEach(function (response) {
    balances[`bsc:${response.input.params[0]}`] = response.output.totalPrincipal;
  });
  
  return balances;
}

module.exports = {
  name: 'Revault Network',
  website: 'https://app.revault.network',
  token: 'REVA',
  //category: "?",
  start: 1634150000,        // 13th of October, 2021
  bsc: {
    tvl,
  },
}
