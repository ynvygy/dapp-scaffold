use anchor_lang::{prelude::*, system_program};
use pyth_sdk_solana::load_price_feed_from_account_info;

declare_id!("3vY5F41z5htZdEv3AF5vppzamEYwXFWGVatWRhZuRbBC");

pub const BET_SEED: &[u8] = b"bet";

#[derive(Accounts, Default)]
  pub struct BettingGameData {
      pub predicted_price: u64,  
      pub closest_prediction: u64,
      pub closest_user: Pubkey,
      pub winner_claimed: bool,
  }

  impl IsInitialized for BettingGameData {
    fn is_initialized(&self) -> bool {
        true
    }
  }

  #[program]
  mod prediction_dapp {
    pub fn create_bet(ctx:Context<CreateBet>,price:f64) -> Result<()> {
      let bet = &mut ctx.accounts.bet;
      bet.amount = LAMPARTS_PER_SOL;
      bet.prediction = BetPrediction{
          player: ctx.accounts.player.key(),
          price,
      };

      system_program::transfer(
          CpiContext::new(
              ctx.accounts.system_program.to_account_info(),
              system_program::Transfer{
                  from: ctx.accounts.player.to_account_info(),
                  to: bet.to_account_info()
              },
          ),
          bet.amount,
      );
      Ok(())
    }

    pub fn enter_bet(ctx: Context<EnterBet>,price:f64) -> Result<()> {
      let bet = &mut ctx.accounts.bet;
      bet.prediction_b = Some(BetPrediction{
          player: ctx.accounts.player.key(),
          price,
      });

      system_program::transfer(
          CpiContext::new(
              ctx.accounts.system_program.to_account_info(),
              system_program::Transfer{
                  from: ctx.accounts.player.to_account_info(),
                  to: bet.to_account_info()
              },
          ),
          bet.amount,
      );
      Ok(())
      
    }
  }

#[derive(Accounts)]
pub struct CreateBet<'info> {
    #[account(
        init,
        payer = player,
        space = 8+8+32+8+8+32+8+1+32+8+1,
        seeds = [BET_SEED, &(bet.id+1).to_le_bytes()],
        bump
    )]
    pub bet: Account<'info, Bet>,

    #[account(mut)]
    pub player: Signer<'info>,

    pub system_program: Program<'info, System>,

}

#[derive(Accounts)]
pub struct EnterBet<'info> {
    #[account(
        mut,
        seeds = [BET_SEED, &(bet.id+1).to_le_bytes()],
        constraint = validate_enter_bet(&*bet),
        bump
    )]
    pub bet: Account<'info, Bet>,

    #[account(mut)]
    pub player: Signer<'info>,

    pub system_program: Program<'info, System>,
}

#[account]
pub struct Bet{
    pub id: u64,
    pub amount: u64,
    pub prediction: BetPrediction,
}