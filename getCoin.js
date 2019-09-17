const ccxt = require ('ccxt');
let exchange = new ccxt['bitz']();
let http = require('http');

let fetchOrderBook = async (coin) => {
    // 如果报错 则重新获取数据 超过10次 全部数据重新获取
    try {
        let orderBook = await exchange.fetchOrderBook(coin);
        // console.log(orderBook)
        return 1
    }
    catch(err) {
        console.log('数据获取失败.')
    }

}

function getTheSame(x,y) {
    let attendUid = x;
    let dataattendUid = y;
    let result = new Array();
    let c = dataattendUid.toString();
    for (let i = 0; i < attendUid.length; i++) {
        if (c.indexOf(attendUid[i].toString()) > -1) {
            for (let j = 0; j < dataattendUid.length; j++) {
                if (attendUid[i] === dataattendUid[j]) {
                    result.push(attendUid[i]);
                    break;
                }
            }
        }
    }
    return result;
}
let coinYes = []
;(async () => {

    await exchange.loadMarkets ()
    let symbols = exchange.symbols
    for(let i = 0; i < symbols.length; i++){
        let coin1 = ''
        let coin2 = ''
        let coin1Arr = []
        let coin2Arr = []

        coin1 = symbols[i].split('/')[0]
        coin2 = symbols[i].split('/')[1]
        for(let a = 0; a < symbols.length; a++){
            if((symbols[a].indexOf(coin1) !== -1) && (a !== i) && (symbols[a].indexOf(coin2) === -1)){
                coin1Arr.push(symbols[a])
            }
        }
        if(!coin1Arr.length){
            continue
        }
        for(let b = 0; b < symbols.length; b++){
            if((symbols[b].indexOf(coin2) !== -1) && (b !== i) && (symbols[b].indexOf(coin1) === -1)){
                coin2Arr.push(symbols[b])
            }
        }
        if(!coin2Arr.length){
            continue
        }

        for(let c = 0; c < coin1Arr.length; c++){
            let coin1_1 = coin1Arr[c].split('/')[0]
            let coin2_1 = coin1Arr[c].split('/')[1]
            let getAnother1 = coin1_1 === coin1 ? coin2_1 : coin1_1

            for(let d = 0; d < coin2Arr.length; d++) {
                let coin1_2 = coin2Arr[d].split('/')[0]
                let coin2_2 = coin2Arr[d].split('/')[1]


                let getAnother2 = coin1_2 === coin2 ? coin2_2 : coin1_2
                if(getAnother1 === getAnother2){

                    coinYes.push([symbols[i],coin1Arr[c],coin2Arr[d]])


                }
            }
        }
    }
    // console.log(coinYes)
    for(let g = 0; g < coinYes.length; g ++){
        for(let z = g + 1; z < coinYes.length; z++){
            if(getTheSame(coinYes[g],coinYes[z]).length === 3){
                coinYes.splice(z, 1);
            }
        }
    }
    console.log(coinYes)
})()

http.createServer(function (req,res) {
    res.write(`${coinYes}`)
    res.end()
}).listen(3000)