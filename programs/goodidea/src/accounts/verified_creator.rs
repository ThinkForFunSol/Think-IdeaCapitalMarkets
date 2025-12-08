use anchor_lang::prelude::*;

#[account]
pub struct VerifiedCreator {
    pub user: Pubkey,
    pub verified: bool,
    pub x_handle: Option<String>,  // Twitter/X handle
    pub timestamp: i64,
}

impl VerifiedCreator {
    pub const LEN: usize = 8 + 32 + 1 + (1 + 4 + 50) + 8;  // Approximate
}
