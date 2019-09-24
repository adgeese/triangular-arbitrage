const ccxt = require ('ccxt');
let exchange = new ccxt['bitz']();
let http = require('http')
let triangularArbitrage = {}
let bidAskSpread = {}
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

// 判断两个数组是否相同
function f(a, b) {
    m = new Map()
    a.forEach(o => m.set(o, (m.get(o)||0) + 1));
    b.forEach(o => m.set(o, (m.get(o)||0) - 1));
    for (var value of m.values()) {
        if(value !== 0){ return false}
    }
    return true
}
// 三角套利排序 A / B = C
function a (arr) {
    let a = arr[0]
    let b = arr[1]
    let c = arr[2]

    if(f1(a,b,c)){
        return [a,b,c]
    }else if(f1(a,c,b)){
        return [a,c,b]
    }else if(f1(b,a,c)){
        return [b,a,c]
    }else if(f1(b,c,a)){
        return [b,c,a]
    }else if(f1(c,a,b)){
        return [c,a,b]
    }else if(f1(c,b,a)){
        return [c,b,a]
    }

    function f1(c1,c2,c3) {
        let y1 = c1.split('/')[1] === c2.split('/')[1]
        let y2 = c1.split('/')[0] === c3.split('/')[0]
        let y3 = c2.split('/')[0] === c3.split('/')[1]

        if(y1&&y2&&y3){
            return true
        }else {
            return false
        }
    }


}

let coinYes = []
;(async () => {

    await exchange.loadMarkets ()
    let symbols = exchange.symbols
    console.log('得到数据')
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
    // console.log(coinYes) 成功得到coinYes  去掉重复内容
    for(let i = 0; i < coinYes.length; i++){
        let iC = coinYes[i]
        for(let x = 0; x < coinYes.length; x++){
            if(x !== i){
                let xC = coinYes[x]
                if(f(iC,xC)){
                    //删除x
                    coinYes.splice(x, 1);
                    x -= 1
                }
            }
        }
    }

    // coinYes = [['777/BTC'],['777/ETH'],['ETH/BTC'],
    //     ['ABBC/BTC'],['ABBC/ETH'],['ETH/BTC'],
    //     ['AIDOC/BTC'],['AIDOC/ETH'],['ETH/BTC'],
    //     ['APIS/BTC'],['APIS/ETH'],['ETH/BTC'],
    //     ['AT/BTC'],['AT/USDT'],['BTC/USDT'],
    //     ['BBC/BTC'],['BBC/ETH'],['ETH/BTC'],
    //     ['BCV/BTC'],['BCV/ETH'],['ETH/BTC'],
    //     ['BNB/BTC'],['BNB/USDT'],['BTC/USDT'],
    //     ['BSTK/BTC'],['BSTK/ETH'],['ETH/BTC'],
    //     ['BTC/DKKT'],['BTC/USDT'],['USDT/DKKT'],
    //     ['BTC/DKKT'],['BZ/BTC'],['BZ/DKKT'],
    //     ['BTC/DKKT'],['DOGE/BTC'],['DOGE/DKKT'],
    //     ['BTC/DKKT'],['EOS/BTC'],['EOS/DKKT'],
    //     ['BTC/DKKT'],['ETH/BTC'],['ETH/DKKT'],
    //     ['BTC/USDT'],['BZ/BTC'],['BZ/USDT'],
    //     ['BTC/USDT'],['DOGE/BTC'],['DOGE/USDT'],
    //     ['BTC/USDT'],['EDC/BTC'],['EDC/USDT'],
    //     ['BTC/USDT'],['EOS/BTC'],['EOS/USDT'],
    //     ['BTC/USDT'],['ETH/BTC'],['ETH/USDT'],
    //     ['BTC/USDT'],['ETP/BTC'],['ETP/USDT'],
    //     ['BTC/USDT'],['GBYTE/BTC'],['GBYTE/USDT'],
    //     ['BTC/USDT'],['GRS/BTC'],['GRS/USDT'],
    //     ['BTC/USDT'],['GXC/BTC'],['GXC/USDT'],
    //     ['BTC/USDT'],['ILC/BTC'],['ILC/USDT'],
    //     ['BTC/USDT'],['KBC/BTC'],['KBC/USDT'],
    //     ['BTC/USDT'],['KIN/BTC'],['KIN/USDT'],
    //     ['BTC/USDT'],['LTC/BTC'],['LTC/USDT'],
    //     ['BTC/USDT'],['MHC/BTC'],['MHC/USDT'],
    //     ['BTC/USDT'],['MIN/BTC'],['MIN/USDT'],
    //     ['BTC/USDT'],['NMT/BTC'],['NMT/USDT'],
    //     ['BTC/USDT'],['NULS/BTC'],['NULS/USDT'],
    //     ['BTC/USDT'],['PPS/BTC'],['PPS/USDT'],
    //     ['BTC/USDT'],['QTUM/BTC'],['QTUM/USDT'],
    //     ['BTC/USDT'],['RT/BTC'],['RT/USDT'],
    //     ['BTC/USDT'],['SINOC/BTC'],['SINOC/USDT'],
    //     ['BTC/USDT'],['TRX/BTC'],['TRX/USDT'],
    //     ['BTC/USDT'],['TTC/BTC'],['TTC/USDT'],
    //     ['BTC/USDT'],['WDC/BTC'],['WDC/USDT'],
    //     ['BTC/USDT'],['WDT/BTC'],['WDT/USDT'],
    //     ['BTC/USDT'],['XIN/BTC'],['XIN/USDT'],
    //     ['BTO/BTC'],['BTO/ETH'],['ETH/BTC'],
    //     ['BUSD/ETH'],['BUSD/USDT'],['ETH/USDT'],
    //     ['BZ/BTC'],['BZ/ETH'],['ETH/BTC'],
    //     ['BZ/BTC'],['NULS/BZ'],['NULS/BTC'],
    //     ['BZ/BTC'],['TRX/BZ'],['TRX/BTC'],
    //     ['BZ/DKKT'],['BZ/ETH'],['ETH/DKKT'],
    //     ['BZ/DKKT'],['BZ/USDT'],['USDT/DKKT'],
    //     ['BZ/ETH'],['BZ/USDT'],['ETH/USDT'],
    //     ['BZ/ETH'],['TRX/BZ'],['TRX/ETH'],
    //     ['BZ/USDT'],['DEFI/BZ'],['DEFI/USDT'],
    //     ['BZ/USDT'],['NULS/BZ'],['NULS/USDT'],
    //     ['BZ/USDT'],['TRX/BZ'],['TRX/USDT'],
    //     ['BZ/USDT'],['XRP/BZ'],['XRP/USDT'],
    //     ['CAM/BTC'],['CAM/ETH'],['ETH/BTC'],
    //     ['CEC/BTC'],['CEC/ETH'],['ETH/BTC'],
    //     ['CFC/ETH'],['CFC/USDT'],['ETH/USDT'],
    //     ['CPX/BTC'],['CPX/ETH'],['ETH/BTC'],
    //     ['CRE/BTC'],['CRE/ETH'],['ETH/BTC'],
    //     ['CVT/BTC'],['CVT/ETH'],['ETH/BTC'],
    //     ['DDN/BTC'],['DDN/ETH'],['ETH/BTC'],
    //     ['DEL/BTC'],['DEL/ETH'],['ETH/BTC'],
    //     ['DOGE/DKKT'],['DOGE/USDT'],['USDT/DKKT'],
    //     ['EDC/BTC'],['EDC/ETH'],['ETH/BTC'],
    //     ['EDC/ETH'],['EDC/USDT'],['ETH/USDT'],
    //     ['EDS/ETH'],['EDS/USDT'],['ETH/USDT'],
    //     ['EGCC/BTC'],['EGCC/ETH'],['ETH/BTC'],
    //     ['ELA/BTC'],['ELA/ETH'],['ETH/BTC'],
    //     ['EOS/DKKT'],['EOS/USDT'],['USDT/DKKT'],
    //     ['ETH/BTC'],['FTI/ETH'],['FTI/BTC'],
    //     ['ETH/BTC'],['HPB/ETH'],['HPB/BTC'],
    //     ['ETH/BTC'],['HYC/ETH'],['HYC/BTC'],
    //     ['ETH/BTC'],['INC/ETH'],['INC/BTC'],
    //     ['ETH/BTC'],['INK/ETH'],['INK/BTC'],
    //     ['ETH/BTC'],['IOV/ETH'],['IOV/BTC'],
    //     ['ETH/BTC'],['IXT/ETH'],['IXT/BTC'],
    //     ['ETH/BTC'],['KBC/ETH'],['KBC/BTC'],
    //     ['ETH/BTC'],['KIN/ETH'],['KIN/BTC'],
    //     ['ETH/BTC'],['MHC/ETH'],['MHC/BTC'],
    //     ['ETH/BTC'],['MIN/ETH'],['MIN/BTC'],
    //     ['ETH/BTC'],['NAM/ETH'],['NAM/BTC'],
    //     ['ETH/BTC'],['NMT/ETH'],['NMT/BTC'],
    //     ['ETH/BTC'],['NPXS/ETH'],['NPXS/BTC'],
    //     ['ETH/BTC'],['OCN/ETH'],['OCN/BTC'],
    //     ['ETH/BTC'],['PC/ETH'],['PC/BTC'],
    //     ['ETH/BTC'],['POK/ETH'],['POK/BTC'],
    //     ['ETH/BTC'],['PRA/ETH'],['PRA/BTC'],
    //     ['ETH/BTC'],['Pixiecoin/ETH'],['Pixiecoin/BTC'],
    //     ['ETH/BTC'],['QNTU/ETH'],['QNTU/BTC'],
    //     ['ETH/BTC'],['QUBE/ETH'],['QUBE/BTC'],
    //     ['ETH/BTC'],['REBL/ETH'],['REBL/BTC'],
    //     ['ETH/BTC'],['RRC/ETH'],['RRC/BTC'],
    //     ['ETH/BTC'],['RT/ETH'],['RT/BTC'],
    //     ['ETH/BTC'],['SINOC/ETH'],['SINOC/BTC'],
    //     ['ETH/BTC'],['TEAM/ETH'],['TEAM/BTC'],
    //     ['ETH/BTC'],['TKY/ETH'],['TKY/BTC'],
    //     ['ETH/BTC'],['TRX/ETH'],['TRX/BTC'],
    //     ['ETH/BTC'],['TTC/ETH'],['TTC/BTC'],
    //     ['ETH/BTC'],['UCT/ETH'],['UCT/BTC'],
    //     ['ETH/BTC'],['USC/ETH'],['USC/BTC'],
    //     ['ETH/BTC'],['WDT/ETH'],['WDT/BTC'],
    //     ['ETH/BTC'],['WWB/ETH'],['WWB/BTC'],
    //     ['ETH/BTC'],['ZGC/ETH'],['ZGC/BTC'],
    //     ['ETH/BTC'],['ZPR/ETH'],['ZPR/BTC'],
    //     ['ETH/DKKT'],['ETH/USDT'],['USDT/DKKT'],
    //     ['ETH/USDT'],['KBC/ETH'],['KBC/USDT'],
    //     ['ETH/USDT'],['KIN/ETH'],['KIN/USDT'],
    //     ['ETH/USDT'],['MHC/ETH'],['MHC/USDT'],
    //     ['ETH/USDT'],['MIN/ETH'],['MIN/USDT'],
    //     ['ETH/USDT'],['NMT/ETH'],['NMT/USDT'],
    //     ['ETH/USDT'],['RT/ETH'],['RT/USDT'],
    //     ['ETH/USDT'],['SINOC/ETH'],['SINOC/USDT'],
    //     ['ETH/USDT'],['TRX/ETH'],['TRX/USDT'],
    //     ['ETH/USDT'],['TTC/ETH'],['TTC/USDT'],
    //     ['ETH/USDT'],['TTMC/ETH'],['TTMC/USDT'],
    //     ['ETH/USDT'],['WDT/ETH'],['WDT/USDT'],
    //     ['USDT/DKKT'],['VEX/USDT'],['VEX/DKKT'],
    //     ['USDT/DKKT'],['WIAC/USDT'],['WIAC/DKKT']]
    // 打印 coinYes
    // for(let i = 0; i < coinYes.length; i++){
    //     console.log(`['${coinYes[i][0]}'],['${coinYes[i][1]}'],['${coinYes[i][2]}'],`)
    // }

    // 需要获取盘口数据的币种
    let coinNeeds = []
    for(let i = 0; i < coinYes.length; i++){
        for(let x = 0; x < 3; x++){
            if(coinNeeds.indexOf(coinYes[i][x])===-1){
                coinNeeds.push(coinYes[i][x])
            }
        }
    }


    while (1){
        let x
        try
        {
           x = await exchange.fetchTickers ()
        }
        catch(err)
        {
            continue
        }

        // console.log(x['VEX/DKKT'])
        // console.log(x['VEX/DKKT'].ask +'+'+x['VEX/DKKT'].askVolume)
        // console.log(x['VEX/DKKT'].bid +'+'+x['VEX/DKKT'].bidVolume)


        // x['VEX/DKKT'].ask = 0.033
        // x['VEX/DKKT'].askVolume = 25323.6744
        // x['VEX/DKKT'].bid = 0.032
        // x['VEX/DKKT'].bidVolume = 1000
        // console.log(x)

        // 查询盘口价差
        for(let i = 0; i < coinNeeds.length; i++){
            bidAskSpread[coinNeeds[i]] = {}
            bidAskSpread[coinNeeds[i]].spread = Math.abs(x[coinNeeds[i]].ask - x[coinNeeds[i]].bid) / x[coinNeeds[i]].bid
            bidAskSpread[coinNeeds[i]].num = 0
            if(bidAskSpread[coinNeeds[i]].spread > 0.004){       //大于手续费  暂定千4
                bidAskSpread[coinNeeds[i]].num += 1
            }
        }
        // console.log(bidAskSpread)


        for(let i = 0; i < coinYes.length; i++){
            let b = a(coinYes[i])
            let bName = b.join('_')
            let UtoB = 10000 / x[b[2]].ask * (1-0.002)
            let BtoD = UtoB * x[b[0]].bid * (1-0.002)
            let DtoU = BtoD / x[b[1]].ask * (1-0.002)

            let DtoB = 10000 / x[b[0]].ask * (1-0.002)
            let BtoU = DtoB * x[b[2]].bid * (1-0.002)
            let UtoD = BtoU * x[b[1]].bid * (1-0.002)

            triangularArbitrage[bName] = {}
            if(DtoU>10000||UtoD>10000){
                triangularArbitrage[bName].num += 1
            }
        }
        console.log(triangularArbitrage)


    }

})()

http.createServer(
    function (req,res) {
        res.write(triangularArbitrage)
        res.write(bidAskSpread)
        res.end()
    }
).listen(3000)
