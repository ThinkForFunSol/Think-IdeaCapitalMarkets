use anchor_lang::prelude::*;
use instructions::*;

declare_id!("YourProgramIdHere");

#[program]
pub mod goodidea {
    use super::*;

    pub fn mint_idea(ctx: Context<MintIdea>, title: String, description: String, image_uri: Option<String>) -> Result<()> {
        mint_idea::handler(ctx, title, description, image_uri)
    }

    pub fn list_idea(ctx: Context<ListIdea>, price: u64) -> Result<()> {
        list_idea::handler(ctx, price)
    }

    pub fn buy_idea(ctx: Context<BuyIdea>) -> Result<()> {
        buy_idea::handler(ctx)
    }
}

pub mod instructions {
    pub mod mint_idea;
    pub mod list_idea;
    pub mod buy_idea;
}

pub mod accounts {
    pub mod idea;
}
