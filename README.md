# BLOCKLANCE

A decentralised freelance platform built on Ethereum. Clients post jobs and deposit payment directly into a smart contract; freelancers accept and complete work; payment is released automatically by the contract once the client approves — no platform, no middleman holding the money.

Final year project — demonstrates smart contract development, a Web3 frontend, and the full trustless escrow flow between two parties.

---

## Tech Stack

- **Solidity** — smart contract (`BlockLance.sol`)
- **Hardhat** — compile, test, deploy, and run a local Ethereum blockchain
- **React (Vite)** — frontend
- **Ethers.js** — connects the frontend to the blockchain
- **MetaMask** — wallet used to sign transactions

---

## Project Structure

```
blocklance/
├── backend/
│   ├── contracts/
│   │   └── BlockLance.sol       # the smart contract
│   ├── scripts/
│   │   ├── deploy.js            # deploys the contract
│   │   └── interact.js          # runs the full job lifecycle end-to-end, no MetaMask needed
│   ├── test/
│   │   └── BlockLance.test.js   # automated tests
│   └── hardhat.config.js
│
└── frontend/
    └── src/
        ├── App.jsx
        ├── App.css
        ├── main.jsx
        ├── contractConfig.js    # contract address + ABI
        ├── Web3Context.jsx      # wallet connection
        ├── PostJob.jsx
        └── JobList.jsx
```

---

## Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later)
- [MetaMask](https://metamask.io/) browser extension

---

## Setup & Running

You'll need **two terminals** open at once.

### 1. Install dependencies

```bash
cd backend
npm install

cd ../frontend
npm install
```

### 2. Start the local blockchain (Terminal 1 — leave this running)

```bash
cd backend
npx hardhat node
```

This prints 20 test accounts, each pre-loaded with 10,000 fake ETH. **Leave this terminal open and untouched** for your whole session — restarting it resets the blockchain and requires everything below to be redone.

### 3. Deploy the contract (Terminal 2)

```bash
cd backend
npx hardhat run scripts/deploy.js --network localhost
```

Copy the printed contract address.

### 4. Point the frontend at the deployed contract

Open `frontend/src/contractConfig.js` and paste the address into `CONTRACT_ADDRESS`.

### 5. Start the frontend (still Terminal 2)

```bash
cd ../frontend
npm run dev
```

Open the printed `localhost` link in your browser.

### 6. Connect MetaMask

- Add a custom network: **Network name:** Hardhat, **RPC URL:** `http://127.0.0.1:8545`, **Chain ID:** `31337`, **Currency:** ETH
- Import a test account using one of the private keys printed in Terminal 1 (Account #0's key is fine)
- Make sure both the **Hardhat network** and the **imported account** are selected in MetaMask before using the site

---

## Quick Demo Without the Browser

To prove the contract logic works without touching MetaMask at all:

```bash
cd backend
npx hardhat run scripts/interact.js
```

This deploys a fresh contract and runs through posting a job, accepting it, marking it complete, and releasing payment — printing each step to the terminal.

---

## Features

| Module | What it does |
|---|---|
| **Wallet Connection** | Connect via MetaMask, see your address and live ETH balance |
| **Job Creation** | Client posts a job and deposits the budget into the contract in one transaction |
| **Job Acceptance** | Any freelancer (not the client) can accept an open job |
| **Project Completion** | Freelancer marks the job as done |
| **Payment Release** | Client approves — the contract sends the locked ETH to the freelancer automatically |
| **Cancel & Refund** | Client can cancel a job before anyone accepts it, refunding themselves |
| **Transaction Tracking** | Job list updates live by listening to contract events |

The UI has two filtered views — **My Postings (Client)** and **My Work (Freelancer)** — so both sides of a transaction are easy to see. A "Clear old jobs" option hides test data from view without touching the blockchain.

---

## Troubleshooting

**"Cannot connect to network localhost" when deploying**
Terminal 1 (`npx hardhat node`) isn't running. Start it first.

**MetaMask shows `$0.00` / transactions fail with weird internal errors**
Almost always one of two things:
1. A leftover process is still holding port `8545` or `5173` from a previous session. Check with:
   ```bash
   netstat -ano | findstr :8545
   netstat -ano | findstr :5173
   ```
   If a `LISTENING` line appears, kill it: `taskkill /PID <the number> /F`, then start fresh.
2. MetaMask is on the wrong account or network. Confirm **Hardhat** network + your **funded imported account** are both actively selected.

**"Contract call: BlockLance#\<unrecognized-selector\>" or "missing revert data"**
The address in `contractConfig.js` doesn't match what's actually deployed on your currently running node — usually because the node was restarted after the last deploy. Redeploy (step 3) and update the address again.

**Restarted the Hardhat node?**
You must redeploy (step 3), update the address (step 4), and refresh MetaMask's network (Settings → Networks → Hardhat → Edit → Save) before using the site again.

---

## License

Built for academic purposes as a final year project.
