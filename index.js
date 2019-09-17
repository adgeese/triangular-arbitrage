"use strict";
const config = require('./config');

const ccxt = require ('ccxt');

let exchange = new ccxt[config.exchange]();

let getCoinOrder = 0;  // 0获取三个币种全部买卖单 1，2，3 获取对应币种的数据

// 只返回买一卖一
let fetchOrderBook = async (coin) => {
    // 如果报错 则重新获取数据 超过10次 全部数据重新获取
    try {
        let orderBook = await exchange.fetchOrderBook(coin);
        // console.log(orderBook)
        return {
            'bids': orderBook['bids'][0],   // 10153
            'asks': orderBook['asks'][0]    // 10157
        }
    }
    catch(err) {
        console.log('数据获取失败.')
    }

}

(async function main () {
    let coinAOrderBook,coinBOrderBook,coinCOrderBook;
    let book = {}
    //无限循环 循环获取值
    while (1===1){
        if(getCoinOrder === 0){  //
            coinAOrderBook = await fetchOrderBook(config.coinA);
            coinBOrderBook = await fetchOrderBook(config.coinB);
            coinCOrderBook = await fetchOrderBook(config.coinC);
            getCoinOrder += 1
        }else {
            if(getCoinOrder===1){
                coinAOrderBook = await fetchOrderBook(config.coinA)
            }
            if(getCoinOrder===2){
                coinBOrderBook = await fetchOrderBook(config.coinB)
            }
            if(getCoinOrder===3){
                coinCOrderBook = await fetchOrderBook(config.coinC);
                getCoinOrder = 0  // 等于3 重新变成1 后面会 +1
            }
            getCoinOrder += 1
        }

        // 计算能否套利
        if(coinAOrderBook&&coinBOrderBook&&coinCOrderBook){ //可能获取失败 判断是否有值
            // A / B = C    1.卖A 买B 买c  2.买A 卖B 卖C
            // let result1 = coinAOrderBook['asks'][0] * (1 - config.fee)
            //     / coinBOrderBook['bids'][0] * (1 - config.fee)
            //     / coinCOrderBook['bids'][0] * (1 - config.fee)
            // if(
            //     (coinAOrderBook['asks'][0]/coinBOrderBook['bids'][0]-coinCOrderBook['bids'][0])/coinCOrderBook['bids'][0]
            //     > (config.coinAPremium+config.coinBPremium+config.coinCPremium+config.fee*3)){
            //
            // }
            // console.log('方式1   差价：'+(coinAOrderBook['bids'][0]/coinBOrderBook['asks'][0]-coinCOrderBook['asks'][0])/coinCOrderBook['asks'][0] + '手续费：'+(config.coinAPremium+config.coinBPremium+config.coinCPremium+config.fee*3))


            // console.log('方式2   差价：'+(coinAOrderBook['bids'][0]/coinBOrderBook['asks'][0]-coinCOrderBook['asks'][0])/coinCOrderBook['asks'][0]+'手续费：'+(config.coinAPremium+config.coinBPremium+config.coinCPremium+config.fee*3))
            let UtoB = 10000 / coinCOrderBook['asks'][0] * (1-config.fee)
            let BtoD = UtoB * coinAOrderBook['bids'][0] * (1-config.fee)
            let DtoU = BtoD / coinBOrderBook['asks'][0] * (1-config.fee)
            console.log(DtoU)
            let DtoB = 10000 / coinAOrderBook['asks'][0] * (1-config.fee)
            let BtoU = DtoB * coinCOrderBook['bids'][0] * (1-config.fee)
            let UtoD = BtoU * coinBOrderBook['bids'][0] * (1-config.fee)
            console.log(UtoD)

            if(DtoU > 10000 || UtoD > 10000){
                console.log(1111111)
            }
        }
    }

})()
