import React, { useEffect, useState } from 'react';
import { useConnection } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import { Program, AnchorProvider } from '@coral-xyz/anchor';
import idl from '../../idl/goodidea.json';
import IdeaCard from './IdeaCard';

const PROGRAM_ID = new PublicKey('YourProgramIdHere');

const Marketplace: React.FC = () => {
  const { connection } = useConnection();
  const [ideas, setIdeas] = useState<any[]>([]);

  useEffect(() => {
    const fetchIdeas = async () => {
      const provider = new AnchorProvider(connection, {} as any, {});
      const program = new Program(idl as any, PROGRAM_ID, provider);
      const allIdeas = await program.account.idea.all();
      setIdeas(allIdeas.filter((idea) => idea.account.listed));
    };
    fetchIdeas();
  }, []);

  return (
    <div>
      {ideas.map((idea) => (
        <IdeaCard key={idea.publicKey.toString()} idea={idea.account} />
      ))}
    </div>
  );
};

export default Marketplace;
