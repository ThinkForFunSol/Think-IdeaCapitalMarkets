import React, { useState, useEffect } from 'react';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import { Program, AnchorProvider } from '@coral-xyz/anchor';
import idl from '../../idl/goodidea.json';
import { getVerifiedCreatorPda, verifyCreator } from '../utils/solana'; 

const PROGRAM_ID = new PublicKey('YourProgramIdHere');

const Profile: React.FC = () => {
  const wallet = useWallet();
  const { connection } = useConnection();
  const [verified, setVerified] = useState(false);
  const [xHandle, setXHandle] = useState('');
  const [savedHandle, setSavedHandle] = useState('');

  useEffect(() => {
    if (wallet.publicKey) {
      checkVerification();
    }
  }, [wallet.publicKey]);

  const checkVerification = async () => {
    const provider = new AnchorProvider(connection, wallet, {});
    const program = new Program(idl as any, PROGRAM_ID, provider);
    const pda = await getVerifiedCreatorPda(wallet.publicKey!);
    try {
      const account = await program.account.verifiedCreator.fetch(pda);
      setVerified(account.verified);
      setSavedHandle(localStorage.getItem(`xHandle_${wallet.publicKey?.toString()}`) || '');
    } catch (err) {
      setVerified(false);
    }
  };

  const handleVerify = async () => {
    if (!wallet.connected) return;
    await verifyCreator(wallet, connection);
    checkVerification();
  };

  const handleSaveX = () => {
    if (wallet.publicKey) {
      localStorage.setItem(`xHandle_${wallet.publicKey.toString()}`, xHandle);
      setSavedHandle(xHandle);
    }
  };

  return (
    <div>
      <h2>Profile</h2>
      <p>Wallet: {wallet.publicKey?.toString() || 'Not connected'}</p>
      <p>Verified: {verified ? 'Yes' : 'No'}</p>
      {!verified && <button onClick={handleVerify}>Verify Creator ($100)</button>}
      <input type="text" placeholder="X Handle" value={xHandle} onChange={(e) => setXHandle(e.target.value)} />
      <button onClick={handleSaveX}>Connect X Account</button>
      {savedHandle && <p>Connected X: @{savedHandle}</p>}
      {}
    </div>
  );
};

export default Profile;
