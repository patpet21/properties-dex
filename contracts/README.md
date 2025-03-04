
# Properties DEX Smart Contracts

This directory contains the smart contracts for the Properties DEX platform.

## PropertiesMarketplace Contract

The `PropertiesMarketplace.sol` contract is the main contract for the platform, enabling:

- Creation of token listings
- Purchasing tokens
- Referral system
- Listing management

## Deployment Instructions

### Using Remix IDE

1. Go to [Remix IDE](https://remix.ethereum.org/)
2. Create a new file named `PropertiesMarketplace.sol` and paste the contract code
3. Make sure you have the OpenZeppelin contracts installed by adding to Remix:
   - In the "File Explorer" tab, create a folder named `@openzeppelin`
   - Within that folder, create a folder `contracts`
   - Import the required OpenZeppelin contracts from GitHub

4. Compile the contract:
   - Go to the "Solidity Compiler" tab
   - Select compiler version 0.8.17 or higher
   - Click "Compile PropertiesMarketplace.sol"

5. Deploy the contract:
   - Go to the "Deploy & Run Transactions" tab
   - Select "Injected Provider - MetaMask" in the Environment dropdown
   - Make sure your MetaMask is connected to the Base network
   - Select the PropertiesMarketplace contract from the dropdown
   - Click "Deploy"
   - Confirm the transaction in MetaMask

6. After deployment, copy the contract address and update the `CONTRACT_ADDRESSES.MARKETPLACE` value in your application.

### Using Hardhat

Alternatively, you can use Hardhat for a more robust deployment process:

1. Initialize a new Hardhat project:
   ```
   mkdir properties-dex-contracts
   cd properties-dex-contracts
   npm init -y
   npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox
   npx hardhat init
   ```

2. Install OpenZeppelin contracts:
   ```
   npm install @openzeppelin/contracts
   ```

3. Copy the `PropertiesMarketplace.sol` file to the `contracts/` directory

4. Create a deployment script in `scripts/deploy.js`:
   ```javascript
   const hre = require("hardhat");

   async function main() {
     const PropertiesMarketplace = await hre.ethers.getContractFactory("PropertiesMarketplace");
     const marketplace = await PropertiesMarketplace.deploy();

     await marketplace.deployed();

     console.log("PropertiesMarketplace deployed to:", marketplace.address);
   }

   main().catch((error) => {
     console.error(error);
     process.exitCode = 1;
   });
   ```

5. Configure Hardhat for Base network in `hardhat.config.js`:
   ```javascript
   require("@nomicfoundation/hardhat-toolbox");

   module.exports = {
     solidity: "0.8.17",
     networks: {
       base: {
         url: "https://mainnet.base.org",
         accounts: [process.env.PRIVATE_KEY],
       },
     },
   };
   ```

6. Deploy to Base:
   ```
   export PRIVATE_KEY=your_private_key
   npx hardhat run scripts/deploy.js --network base
   ```

7. Update your frontend with the deployed contract address.
