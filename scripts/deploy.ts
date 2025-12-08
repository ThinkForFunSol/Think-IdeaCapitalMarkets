import { AnchorProvider, Program } from '@coral-xyz/anchor';
import { Connection, Keypair, clusterApiUrl } from '@solana/web3.js';
import fs from 'fs';
import path from 'path';

const deploy = async () => {
  const connection = new Connection(clusterApiUrl('devnet'));
  const wallet = Keypair.fromSecretKey(Uint8Array.from(JSON.parse(fs.readFileSync('/path/to/wallet.json', 'utf-8'))));
  const provider = new AnchorProvider(connection, wallet as any, {});
  const idl = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../programs/goodidea/target/idl/goodidea.json'), 'utf8'));
  const programId = new PublicKey('YourProgramIdHere'); 
  const program = new Program(idl, programId, provider);

};

deploy();
