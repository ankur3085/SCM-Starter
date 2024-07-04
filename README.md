Simple Banking Smart Contract with User Interface

This project implements a basic banking smart contract on the Ethereum blockchain. It allows users to deposit and withdraw Ether, check their balances, reset balances by the owner, and close the bank contract.

Description

The Banking smart contract provides the following functionalities:

Deposit: Allows users to deposit Ether into their account.
Withdraw: Enables users to withdraw Ether from their account, provided they have sufficient balance.
Check Balance: Users can view their current Ether balance.
Get Gas Used: Users can get the amount of gas used per transcation
Installing
To deploy and interact with the smart contract:

After cloning the GitHub, you will want to do the following to get the code running on your computer.

1. Inside the project directory, in the terminal type: npm i
2. Open two additional terminals in your VS code
3. In the second terminal type: npx hardhat node
4. In the third terminal, type: npx hardhat run --network localhost scripts/deploy.js
5. Back in the first terminal, type npm and run dev to launch the front end.


Executing Program
To interact with the deployed contract:

Deploy the Banking contract.
Use a wallet like MetaMask to interact with the deployed contract:
Deposit Ether using the deposit function.
Withdraw Ether using the withdraw function.
Get the amouunt of gas used in a transaction.
Authors
Ankur Pandey
