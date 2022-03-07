// window.ethereum.enable();

export function requestPermissions() {
  window.ethereum
    .request({
      method: 'wallet_requestPermissions',
      params: [{eth_accounts: {}}],
    })
    .then((permissions) => {
      const accountsPermission = permissions.find(
        (permission) => permission.parentCapability === 'eth_accounts'
      );
      if (accountsPermission) {
        console.log('eth_accounts permission successfully requested!');
      }
    })
    .catch((error) => {
      if (error.code === 4001) {
        // EIP-1193 userRejectedRequest error
        console.log('Permissions needed to continue.');
      } else {
        console.error(error);
      }
    });
}

const initialize = () => {
  const isMetaMaskInstalled = () => {
    const {ethereum} = window;
    return Boolean(ethereum && ethereum.isMetaMask);
  };
  const MetaMaskClientCheck = () => {
    if (!isMetaMaskInstalled()) {
      console.log('metamask Click here to install MetaMask!')
    } else {
      console.log('metamask MetaMaskClientCheck Connect')

      //ethereum.removeListener('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', (chainId) => {
        console.log("metamask chainChanged:", chainId)
        window.location.reload();
      });
      window.ethereum.on('message', (message) => {
        console.log("metamask event message:", message)
      });
    }
  };
  MetaMaskClientCheck();
};


export const requestAccounts = async ({accountsChanged}) => {
  try {
    const [accountAddress] = await window.ethereum.request({method: 'eth_requestAccounts'});
    if (accountsChanged) {
      window.ethereum.on('accountsChanged', (accounts) => {
        console.log("metamask accountsChanged:", accounts)
        accountsChanged(accounts[0])
      });
    }
    return accountAddress;
  } catch (error) {
    console.error(error);
    return null
  }
}


export const sendTransaction = async (web3, params) => {
  return await window.ethereum
    .request({
      method: 'eth_sendTransaction',
      params,
    })
}
// requestPermissions()
// debugger
// const res = await window.ethereum.request({
//   method: 'wallet_watchAsset',
//   params: {
//     type: 'ERC20',
//     options: {
//       address: bsw_contract_address,
//       symbol: 'BSW',
//       decimals: 18,
//       image: 'https://s2.coinmarketcap.com/static/img/coins/64x64/10746.png',
//     },
//   },
// });

window.addEventListener('DOMContentLoaded', initialize);
