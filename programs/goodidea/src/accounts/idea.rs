use anchor_lang::prelude::*;

#[account]
pub struct Idea {
    pub owner: Pubkey,
    pub title: String,
    pub description: String,
    pub image_uri: Option<String>,
    pub timestamp: i64,
    pub listed: bool,
    pub price: u64, 
}

impl Idea {
    pub const LEN: usize = 8 + 32 + (4 + 100) + (4 + 500) + (1 + 4 + 200) + 8 + 1 + 8;  
}
