use anchor_lang::prelude::*;

use crate::accounts::idea::Idea;

#[derive(Accounts)]
pub struct ListIdea<'info> {
    #[account(mut)]
    pub user: Signer<'info>,

    #[account(
        mut,
        has_one = owner @ ErrorCode::NotOwner,
        seeds = [b"idea", user.key().as_ref(), idea.title.as_bytes()],
        bump
    )]
    pub idea: Account<'info, Idea>,
}

impl<'info> ListIdea<'info> {
    pub fn handler(ctx: Context<Self>, price: u64) -> Result<()> {
        let idea = &mut ctx.accounts.idea;
        if idea.owner != ctx.accounts.user.key() {
            return err!(ErrorCode::NotOwner);
        }
        idea.listed = true;
        idea.price = price;
        Ok(())
    }
}

#[error_code]
pub enum ErrorCode {
    #[msg("You are not the owner of this idea.")]
    NotOwner,
}
