use anchor_lang::prelude::*;
use anchor_spl::token::{Token, TokenAccount, Transfer as SplTransfer};

use crate::accounts::idea::Idea;

#[derive(Accounts)]
pub struct BuyIdea<'info> {
    #[account(mut)]
    pub buyer: Signer<'info>,

    #[account(mut)]
    pub seller: AccountInfo<'info>,

    #[account(
        mut,
        constraint = idea.listed @ ErrorCode::NotListed,
        seeds = [b"idea", seller.key.as_ref(), idea.title.as_bytes()],
        bump
    )]
    pub idea: Account<'info, Idea>,

    #[account(mut)]
    pub buyer_token_account: Account<'info, TokenAccount>,

    #[account(mut)]
    pub seller_token_account: Account<'info, TokenAccount>,

    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
}

impl<'info> BuyIdea<'info> {
    pub fn handler(ctx: Context<Self>) -> Result<()> {
        let idea = &mut ctx.accounts.idea;

        let price_lamports = idea.price * 1_000_000_000; 
        anchor_lang::system_program::transfer(
            CpiContext::new(
                ctx.accounts.system_program.to_account_info(),
                anchor_lang::system_program::Transfer {
                    from: ctx.accounts.buyer.to_account_info(),
                    to: ctx.accounts.seller.to_account_info(),
                },
            ),
            price_lamports,
        )?;


        anchor_spl::token::transfer(
            CpiContext::new(
                ctx.accounts.token_program.to_account_info(),
                SplTransfer {
                    from: ctx.accounts.seller_token_account.to_account_info(),
                    to: ctx.accounts.buyer_token_account.to_account_info(),
                    authority: ctx.accounts.seller.to_account_info(),
                },
            ),
            1,
        )?;

        idea.owner = ctx.accounts.buyer.key();
        idea.listed = false;
        idea.price = 0;


        let fee = (price_lamports as f64 * 0.0125) as u64;
        anchor_lang::system_program::transfer(
            CpiContext::new(
                ctx.accounts.system_program.to_account_info(),
                anchor_lang::system_program::Transfer {
                    from: ctx.accounts.seller.to_account_info(),
                    to: idea.to_account_info(),
                },
            ),
            fee,
        )?;

        Ok(())
    }
}
