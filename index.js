"use strict";
const config = require('./config');

const ccxt = require ('ccxt');

let exchange = new ccxt[config.exchange]();

let getCoinOrder = 0;  // 0获取三个币种全部买卖单 1，2，3 获取对应币种的数据

// 只返回买一卖一
let fetchOrderBook = async (coin) => {
    // 如果报错 则重新获取数据 超过10次 全部数据重新获取
    try
    {
//在此运行代码
    }
    catch(err)
    {
//在此处理错误
    }
    let orderBook = await exchange.fetchOrderBook(coin);
    return {
        'bids': orderBook['bids'][0],
        'asks': orderBook['asks'][0]
    }
}

(async function main () {
    let coinAOrderBook,coinBOrderBook,coinCOrderBook;
    let book = {}
    //无限循环
    while (1===1){
        if(getCoinOrder === 0){  // 
            coinAOrderBook = await fetchOrderBook(config.coinA);
            coinBOrderBook = await fetchOrderBook(config.coinB);
            coinCOrderBook = await fetchOrderBook(config.coinC);
            console.log(getCoinOrder)
            getCoinOrder += 1
        }else {
            if(getCoinOrder===1){
                coinAOrderBook = await fetchOrderBook(config.coinA)
                console.log(getCoinOrder)
            }
            if(getCoinOrder===2){
                coinBOrderBook = await fetchOrderBook(config.coinB)
                console.log(getCoinOrder)
            }
            if(getCoinOrder===3){
                coinCOrderBook = await fetchOrderBook(config.coinC);
                console.log(getCoinOrder)
                getCoinOrder = 0  // 等于3 重新变成1 后面会 +1 
            }
            getCoinOrder += 1
        }

        // console.log(coinAOrderBook)
        // console.log(coinBOrderBook)
        // console.log(coinCOrderBook)
    }
    
})()