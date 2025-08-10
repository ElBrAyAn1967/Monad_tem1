# 🏗 Scaffold-ETH 2 con Hardhat + Configuración para Monad Testnet  

<h4 align="center">
  <a href="https://docs.scaffoldeth.io">📚 Documentación Oficial</a> |
  <a href="https://scaffoldeth.io">🌐 Sitio Web</a>
</h4>

🧪 **Scaffold-ETH 2** es una herramienta de código abierto y actualizada para construir aplicaciones descentralizadas (**dapps**) en la blockchain de Ethereum.  
Su objetivo es facilitar la creación y despliegue de **smart contracts** y la construcción de interfaces que interactúen con ellos.

⚙️ **Tecnologías utilizadas**:  
NextJS, RainbowKit, Hardhat, Wagmi, Viem y TypeScript.

---

## 🚀 Características principales
- ✅ **Recarga automática de contratos** → El frontend se adapta en tiempo real a los cambios de tu contrato.
- 🪝 **[Custom Hooks](https://docs.scaffoldeth.io/hooks/)** → Hooks de React listos para simplificar interacciones con contratos, con autocompletado en TypeScript.
- 🧱 **[Componentes listos](https://docs.scaffoldeth.io/components/)** → Bloques de interfaz web3 para acelerar el desarrollo.
- 🔥 **Burner Wallet & Faucet local** → Pruebas rápidas sin necesidad de billeteras externas.
- 🔐 **Integración con múltiples billeteras** → Conecta MetaMask, WalletConnect, etc.

---

![Debug Contracts tab](https://github.com/scaffold-eth/scaffold-eth-2/assets/55535804/b237af0c-5027-4849-a5c1-2e31495cccb1)

---

## 📦 Requisitos previos

Antes de comenzar, instala estas herramientas:

- [Node.js (>= v20.18.3)](https://nodejs.org/en/download/)  
- [Yarn v1 o v2+](https://classic.yarnpkg.com/en/docs/install/)  
- [Git](https://git-scm.com/downloads)  

---

## ⚡ Guía rápida (Quickstart)

### 1️⃣ Instalar dependencias  
Si el CLI no las instaló automáticamente:  
```bash
cd my-dapp-example
yarn install

```
2. Run a local network in the first terminal:

```
yarn chain
```

This command starts a local Ethereum network using Hardhat. The network runs on your local machine and can be used for testing and development. You can customize the network configuration in `packages/hardhat/hardhat.config.ts`.

3. On a second terminal, deploy the test contract:

```
yarn deploy
```

This command deploys a test smart contract to the local network. The contract is located in `packages/hardhat/contracts` and can be modified to suit your needs. The `yarn deploy` command uses the deploy script located in `packages/hardhat/deploy` to deploy the contract to the network. You can also customize the deploy script.

4. On a third terminal, start your NextJS app:

```
yarn start
```

Visit your app on: `http://localhost:3000`. You can interact with your smart contract using the `Debug Contracts` page.



## Contract Verification

After deploying your smart contract to a testnet or mainnet, you can verify it on block explorers like Etherscan or Sourcify. This makes your contract source code publicly available and allows users to interact with it through the block explorer.

### Sourcify Verification (Recommended)

Scaffold-ETH 2 is configured to use Sourcify for contract verification by default. Sourcify is a decentralized verification platform that supports multiple block explorers.

#### For Monad Testnet

1. Generate a deploy account for Monad:
```bash
yarn generate
```
Remember the password here, as it will be required from your local disk when deploying.

Deploy your smart contract to the Monad Testnet:
⚠️ Important: Before proceeding, send the Monad Testnet tokens you claimed from the faucet to the wallet generated with yarn generate.
Open a separate terminal and run the following command.

2. Deploy your contract to Monad testnet:
```bash
yarn deploy --network monadTestnet
```


3. Verify your contract using the hardhat-deploy plugin:
```bash
yarn verify --network monadTestnet
```


---
## Smarth Contract 


---
