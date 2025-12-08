import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Goodidea } from "../target/types/goodidea";
import { expect } from "chai";

describe("goodidea", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.Goodidea as Program<Goodidea>;

  it("Mints an idea", async () => {
    const title = "Test Idea";
    const description = "This is a test.";
    const [ideaPda] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("idea"), provider.wallet.publicKey.toBuffer(), Buffer.from(title)],
      program.programId
    );

    await program.methods
      .mintIdea(title, description, null)
      .accounts({
        user: provider.wallet.publicKey,
        idea: ideaPda,

      })
      .rpc();

    const ideaAccount = await program.account.idea.fetch(ideaPda);
    expect(ideaAccount.title).to.equal(title);
  });


});
