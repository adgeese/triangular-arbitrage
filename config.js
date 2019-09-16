var config = {} ;
config.exchange = 'bitz'
config.apiKey = '******'
config.secret = '******'
config.password = '******'
// 手续费，用BZ抵扣7.5折
config.fee = 0.002 * 0.75
// 套利交易条件
config.TradeThreshold = 1.0006
// 交易币种
// config.coinA = 'BTC/DKKT'  //   A / B = C    1.卖A 买B 买c  2.买A 卖B 卖C
// config.coinB = 'USDT/DKKT'
// config.coinC = 'BTC/USDT'

config.coinA = 'BZ/DKKT'  //   A / B = C    1.卖A 买B 买c  2.买A 卖B 卖C
config.coinB = 'USDT/DKKT'
config.coinC = 'BZ/USDT'
// 溢价
config.coinAPremium = 0.0001
config.coinBPremium = 0.0001
config.coinCPremium = 0.0001
//最大交易价格 USDT
config.maxPrice = 2




module.exports = config;
