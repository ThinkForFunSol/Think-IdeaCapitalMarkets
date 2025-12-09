use anchor_lang::prelude::*;
use anchor_spl::token::{Mint, Token, TokenAccount, mint_to, MintTo};

use crate::accounts::idea::Idea;

#[derive(Accounts)]
pub struct TokenizeIdea<'info> {
    #[account(mut)]
    pub user: Signer<'info>,

    #[account(
        mut,
        has_one = owner @ ErrorCode::NotOwner,
    )]
    pub idea: Account<'info, Idea>,

    #[account(
        init,
        payer = user,
        mint::decimals = 6,  // For fractional shares
        mint::authority = idea,
    )]
    pub share_mint: Account<'info, Mint>,

    #[account(
        init,
        payer = user,
        associated_token::mint = share_mint,
        associated_token::authority = user,
    )]
    pub user_share_account: Account<'info, TokenAccount>,

    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}

impl<'info> TokenizeIdea<'info> {
    pub fn handler(ctx: Context<Self>, total_shares: u64) -> Result<()> {
        let idea = &mut ctx.accounts.idea;
        if idea.owner != ctx.accounts.user.key() {
            return err!(ErrorCode::NotOwner);
        }
        if idea.share_mint.is_some() {
            return err!(ErrorCode::AlreadyTokenized);
        }


        mint_to(
            CpiContext::new(
                ctx.accounts.token_program.to_account_info(),
                MintTo {
                    mint: ctx.accounts.share_mint.to_account_info(),
                    to: ctx.accounts.user_share_account.to_account_info(),
                    authority: ctx.accounts.idea.to_account_info(),
                },
            ),
            total_shares,
        )?;

        idea.share_mint = Some(ctx.accounts.share_mint.key());
        idea.total_shares = Some(total_shares);

        let fee = 1_000_000_000;
        anchor_lang::system_program::transfer(
            CpiContext::new(
                ctx.accounts.system_program.to_account_info(),
                anchor_lang::system_program::Transfer {
                    from: ctx.accounts.user.to_account_info(),
                    to: idea.to_account_info(),
                },
            ),
            fee,
        )?;

        Ok(())
    }
}

#[error_code]
pub enum ErrorCode {

    #[msg("Idea already tokenized.")]
    AlreadyTokenized,
}
