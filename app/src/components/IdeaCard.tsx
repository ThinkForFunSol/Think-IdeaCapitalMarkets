import React from 'react';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import { Program, AnchorProvider } from '@coral-xyz/anchor';
import idl from '../../idl/goodidea.json';

const PROGRAM_ID = new PublicKey('YourProgramIdHere');

interface IdeaCardProps {
  idea: any;
}

const IdeaCard: React.FC<IdeaCardProps> = ({ idea }) => {
  const wallet = useWallet();
  const { connection } = useConnection();

  const handleBuy = async () => {
    if (!wallet.connected) return;

    const provider = new AnchorProvider(connection, wallet, {});
    const program = new Program(idl as any, PROGRAM_ID, provider);

    try {
      const tx = await program.methods
        .buyIdea()
        .accounts({

        })
        .transaction();

      const signature = await wallet.sendTransaction(tx, connection);
      await connection.confirmTransaction(signature, 'processed');
      alert('Idea bought!');
    } catch (err) {
      console.error(err);
    }
  };

  const handleList = async (price: number) => {

  };

  return (
    <div>
      <h3>{idea.title}</h3>
      <p>{idea.description}</p>
      {idea.imageUri && <img src={idea.imageUri} alt="Idea" />}
      <p>Price: {idea.price} SOL</p>
      {idea.listed ? <button onClick={handleBuy}>Buy</button> : <button onClick={() => handleList(1)}>List for Sale</button>}
    </div>
  );
};

export default IdeaCard;
