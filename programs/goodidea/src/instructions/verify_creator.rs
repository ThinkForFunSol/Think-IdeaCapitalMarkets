use anchor_lang::prelude::*;

use crate::accounts::verified_creator::VerifiedCreator;

#[derive(Accounts)]
pub struct VerifyCreator<'info> {
    #[account(mut)]
    pub user: Signer<'info>,

    #[account(
        init_if_needed,
        payer = user,
        space = VerifiedCreator::LEN,
        seeds = [b"verified_creator", user.key().as_ref()],
        bump
    )]
    pub verified_creator: Account<'info, VerifiedCreator>,

    pub system_program: Program<'info, System>,
}

impl<'info> VerifyCreator<'info> {
    pub fn handler(ctx: Context<Self>) -> Result<()> {
        let verified = &mut ctx.accounts.verified_creator;
        if verified.verified {
            return err!(ErrorCode::AlreadyVerified);
        }

        // Charge $100 fee (100 SOL in lamports)
        let fee = 100_000_000_000;
        anchor_lang::system_program::transfer(
            CpiContext::new(
                ctx.accounts.system_program.to_account_info(),
                anchor_lang::system_program::Transfer {
                    from: ctx.accounts.user.to_account_info(),
                    to: verified.to_account_info(), // Fee to treasury (verified account for demo)
                },
            ),
            fee,
        )?;

        verified.user = ctx.accounts.user.key();
        verified.verified = true;
        verified.x_handle = None; // Set in frontend
        verified.timestamp = Clock::get()?.unix_timestamp;

        Ok(())
    }
}

#[error_code]
pub enum ErrorCode {
    #[msg("You are not the owner of this idea.")]
    NotOwner,
    #[msg("Already verified.")]
    AlreadyVerified,
}
