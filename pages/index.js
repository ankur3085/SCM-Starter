import { useState, useEffect } from "react";
import { ethers } from "ethers";
import atm_abi from "../artifacts/contracts/Assessment.sol/Assessment.json";

export default function HomePage() {
  const [ethWallet, setEthWallet] = useState(undefined);
  const [account, setAccount] = useState(undefined);
  const [atm, setATM] = useState(undefined);
  const [balance, setBalance] = useState(undefined); // Now handles balance as float
  const [gasUsed, setGasUsed] = useState([]);

  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const atmABI = atm_abi.abi;

  const getWallet = async () => {
    if (window.ethereum) {
      setEthWallet(window.ethereum);
    }

    if (ethWallet) {
      const accounts = await ethWallet.request({ method: "eth_accounts" });
      handleAccount(accounts);
    }
  };

  const handleAccount = (accounts) => {
    if (accounts.length > 0) {
      console.log("Account connected: ", accounts[0]);
      setAccount(accounts[0]);
    } else {
      console.log("No account found");
    }
  };

  const connectAccount = async () => {
    if (!ethWallet) {
      alert('MetaMask wallet is required to connect');
      return;
    }

    const accounts = await ethWallet.request({ method: 'eth_requestAccounts' });
    handleAccount(accounts);

    // Once wallet is set we can get a reference to our deployed contract
    getATMContract();
  };

  const getATMContract = () => {
    const provider = new ethers.providers.Web3Provider(ethWallet);
    const signer = provider.getSigner();
    const atmContract = new ethers.Contract(contractAddress, atmABI, signer);
    setATM(atmContract);
  };

  const getBalance = async () => {
    if (atm) {
      const balanceWei = await atm.getBalance(); // Retrieve balance in wei
      const balanceEth = ethers.utils.formatEther(balanceWei); // Convert wei to ETH string
      const parsedBalance = parseFloat(balanceEth); // Parse ETH string to float
      setBalance(parsedBalance); // Set balance as float
    }
  };

  const deposit = async () => {
    if (atm) {
      const tx = await atm.deposit(ethers.utils.parseEther("1"));
      const receipt = await tx.wait();
      getBalance();
      // Record gas used
      setGasUsed([...gasUsed, receipt.gasUsed.toNumber()]);
    }
  };

  const withdraw = async () => {
    if (atm) {
      const tx = await atm.withdraw(ethers.utils.parseEther("1"));
      const receipt = await tx.wait();
      getBalance();
      // Record gas used
      setGasUsed([...gasUsed, receipt.gasUsed.toNumber()]);
    }
  };

  const initUser = () => {
    // Check if MetaMask is installed
    if (!ethWallet) {
      return <p>Please install MetaMask in order to use this ATM.</p>;
    }

    // Check if user is connected to MetaMask
    if (!account) {
      return <button onClick={connectAccount} style={styles.button}>Please connect your MetaMask wallet</button>;
    }

    // Fetch balance if not yet fetched
    if (balance === undefined) {
      getBalance();
    }

    // Render user interface with account details, balance, transaction details
    return (
      <div style={styles.container}>
        <p style={styles.text}>Your Account: {account}</p>
        <p style={styles.text}>Your Balance: {balance !== undefined ? `${balance.toFixed(2)} ETH` : 'Loading...'}</p>
        <button onClick={deposit} style={styles.button}>Deposit 1 ETH</button>
        <button onClick={withdraw} style={styles.button}>Withdraw 1 ETH</button>
        <div style={styles.details}>
          <h3 style={styles.heading}>Transaction Details:</h3>
          {gasUsed.map((gas, index) => (
            <div key={index} style={styles.transaction}>
              <p>Transaction {index + 1}</p>
              <p>Gas Used: {gas}</p>
            </div>
          ))}
        </div>
      </div>
    );
  };

  useEffect(() => {
    getWallet();
  }, []);

  const styles = {
    container: {
      textAlign: 'center',
      backgroundColor: '#f0f0f0',
      padding: '20px',
      borderRadius: '8px',
      boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
      maxWidth: '600px',
      margin: 'auto',
    },
    text: {
      fontSize: '18px',
      marginBottom: '10px',
    },
    button: {
      backgroundColor: '#4CAF50',
      color: 'white',
      padding: '10px 20px',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
      margin: '5px',
    },
    details: {
      marginTop: '20px',
    },
    heading: {
      fontSize: '20px',
      marginBottom: '10px',
    },
    transaction: {
      backgroundColor: '#fff',
      border: '1px solid #ccc',
      padding: '10px',
      borderRadius: '5px',
      marginBottom: '10px',
    },
  };

  return (
    <main style={{ backgroundColor: '#e0e0e0', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div style={styles.container}>
        <header><h1 style={styles.heading}>Welcome to the Metacrafters ATM!</h1></header>
        {initUser()}
      </div>
    </main>
  );
}
