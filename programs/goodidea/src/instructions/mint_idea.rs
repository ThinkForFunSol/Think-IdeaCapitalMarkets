use anchor_lang::prelude::*;
use anchor_spl::token::{Mint, Token, TokenAccount};
use mpl_token_metadata::instructions::{CreateMetadataAccountV3Cpi, CreateMetadataAccountV3CpiAccounts};
use mpl_token_metadata::types::DataV2;

use crate::accounts::idea::Idea;

#[derive(Accounts)]
pub struct MintIdea<'info> {
    #[account(mut)]
    pub user: Signer<'info>,

    #[account(
        init,
        payer = user,
        space = Idea::LEN,
        seeds = [b"idea", user.key().as_ref(), title.as_bytes()],
        bump
    )]
    pub idea: Account<'info, Idea>,

    #[account(
        init,
        payer = user,
        mint::decimals = 0,
        mint::authority = idea,
        mint::freeze_authority = idea,
    )]
    pub idea_mint: Account<'info, Mint>,

    #[account(
        init,
        payer = user,
        associated_token::mint = idea_mint,
        associated_token::authority = user,
    )]
    pub user_token_account: Account<'info, TokenAccount>,


    #[account(mut)]
    pub metadata_account: UncheckedAccount<'info>,

    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
    pub metadata_program: Program<'info, mpl_token_metadata::ID>,
}

impl<'info> MintIdea<'info> {
    pub fn handler(ctx: Context<Self>, title: String, description: String, image_uri: Option<String>) -> Result<()> {
        let idea = &mut ctx.accounts.idea;
        idea.owner = ctx.accounts.user.key();
        idea.title = title.clone();
        idea.description = description;
        idea.image_uri = image_uri;
        idea.timestamp = Clock::get()?.unix_timestamp;
        idea.listed = false;
        idea.price = 0;


        anchor_spl::token::mint_to(
            CpiContext::new(
                ctx.accounts.token_program.to_account_info(),
                anchor_spl::token::MintTo {
                    mint: ctx.accounts.idea_mint.to_account_info(),
                    to: ctx.accounts.user_token_account.to_account_info(),
                    authority: ctx.accounts.idea.to_account_info(),
                },
            ),
            1,
        )?;


        let seeds = &[b"idea", ctx.accounts.user.key().as_ref(), title.as_bytes(), &[ctx.bumps.idea]];
        CreateMetadataAccountV3Cpi::new(
            &ctx.accounts.metadata_program,
            CreateMetadataAccountV3CpiAccounts {
                metadata: &ctx.accounts.metadata_account.to_account_info(),
                mint: &ctx.accounts.idea_mint.to_account_info(),
                mint_authority: &ctx.accounts.idea.to_account_info(),
                payer: &ctx.accounts.user.to_account_info(),
                update_authority: (&ctx.accounts.idea.to_account_info(), true),
                system_program: &ctx.accounts.system_program.to_account_info(),
                rent: Some(&ctx.accounts.rent.to_account_info()),
            },
            DataV2 {
                name: title,
                symbol: "IDEA".to_string(),
                uri: image_uri.unwrap_or_default(),
                seller_fee_basis_points: 125, // 1.25%
                creators: vec![mpl_token_metadata::types::Creator {
                    address: ctx.accounts.idea.key(),
                    verified: true,
                    share: 100,
                }],
                collection: None,
                uses: None,
            },
            false, // is_mutable
            false, // is_collection_details
            None,  // rule_set
        ).invoke_signed(&[seeds])?;

        let fee = 5_000_000_000; // 5 SOL in lamports
        anchor_lang::system_program::transfer(
            CpiContext::new(
                ctx.accounts.system_program.to_account_info(),
                anchor_lang::system_program::Transfer {
                    from: ctx.accounts.user.to_account_info(),
                    to: ctx.accounts.idea.to_account_info(), 
                },
            ),
            fee,
        )?;

        Ok(())
    }
}
