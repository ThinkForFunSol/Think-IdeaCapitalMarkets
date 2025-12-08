import React, { useState } from 'react';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { PublicKey, Transaction } from '@solana/web3.js';
import { Program, AnchorProvider, web3 } from '@coral-xyz/anchor';
import idl from '../../idl/goodidea.json'; 
import { checkUniqueness } from '../utils/ai'; 

const PROGRAM_ID = new PublicKey('YourProgramIdHere');

const CreateIdeaForm: React.FC = () => {
  const { connection } = useConnection();
  const wallet = useWallet();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!wallet.connected) return;


    const imageUri = image ? 'ipfs://mock-uri' : undefined;


    const isUnique = await checkUniqueness(title + ' ' + description);
    if (!isUnique) {
      alert('Idea is not unique!');
      return;
    }

    const provider = new AnchorProvider(connection, wallet, {});
    const program = new Program(idl as any, PROGRAM_ID, provider);

    try {
      const tx = await program.methods
        .mintIdea(title, description, imageUri)
        .accounts({
   
        })
        .transaction();

      const signature = await wallet.sendTransaction(tx, connection);
      await connection.confirmTransaction(signature, 'processed');
      alert('Idea minted!');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
      <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} required />
      <input type="file" onChange={(e) => setImage(e.target.files?.[0] || null)} />
      <button type="submit">Mint Idea ($5)</button>
    </form>
  );
};

export default CreateIdeaForm;
