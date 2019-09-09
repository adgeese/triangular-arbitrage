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
config.coinA = ''
config.coinB = ''
config.coinC = ''
// 溢价
config.coinAPremium = 1.000
config.coinBPremium = 1.000
config.coinCPremium = 1.002



module.exports = config;
