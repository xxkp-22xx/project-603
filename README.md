## project-603
#Start with cloning this project in local system. /n
#Pre-requisites (tese can be downloaded from google)
    1) Node.js
    2) Ganache 
    3) npm
#=> open the folder in which this project is cloned and open a terminal in this folder
#=> install truffle to work with solidity and blockchain. Used for compiling of smart contract and deployment in specified blockchain network
```
     cd ganache 
     npm install -g truffle
```
#=> install all the packeges needed to start react-app
```
     cd .. 
     cd my-app 
     npm install 
```
#=> now start the local blockchain from Ganache app
#=> compile and depoly the smart contract (from the ganache directory)
```
     cd .. 
     cd ganache 
     truffle compile 
     truffle migrate --network development
    ```
#=> after successfully deploying contract on ganache local blockchain, copy the deployed contract address and paste it in contract.jsx file in  my-app>utils 
#=> go to my-app directory and start local server
```
     cd .. 
     cd my-app 
     npm start 
```
=> explore the project👍
