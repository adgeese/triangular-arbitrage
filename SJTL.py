# coding=utf-8

import ccxt
import time
import datetime
from pprint import pprint

exchange = ccxt.bitz()
exchange.apiKey = '******'
exchange.secret = '******'
exchange.password = '******'

AonB = 'BTC/USDT'
AonC = 'BTC/DKKT'
BonC = 'USDT/DKKT'

fee = 0.002*0.75 #手续费，用BZ抵扣7.5折

#设置溢价
AonB_AddRate = 1.000
AonC_AddRate = 1.000
BonC_AddRate = 1.002

cTradeThreshold = 1.0006 #进场条件
cMinTradeVal    = 300    #最小交易量 单位C
cSetMaxC        = 5000   #最大交易量 单位C
cMacCPct        = 0.8

#常量
cAsks   = 'asks'
cBids   = 'bids'
cPrice  = 0
cAmount = 1
cFirst  = 0

#标志位为1，获取三个交易对。标志位为0，每次获取一个
fGetAllOb = 1

while(1):
    print(datetime.datetime.now())

    if(fGetAllOb):
        fGetAllOb = 0
        getObStep = 0
        while(1):
            try:
                AonB_ob = exchange.fetch_order_book(AonB)
                AonC_ob = exchange.fetch_order_book(AonC)
                BonC_ob = exchange.fetch_order_book(BonC)
                break
            except:
                pass
            pass
    else:
        #每次更新一个交易对数据
        while(1):
            try:
                if(getObStep==0): AonB_ob = exchange.fetch_order_book(AonB)
                if(getObStep==1): AonC_ob = exchange.fetch_order_book(AonC)
                if(getObStep==2): BonC_ob = exchange.fetch_order_book(BonC)
                break
            except:
                pass
            pass
        getObStep = getObStep + 1
        if(getObStep==3): getObStep=0


    #计算kCABC，如果kCABC>1。说明C->A->B->C能套利
    firstC = 100 #假设初始 C 100
    C = firstC
    A = (C/AonC_ob[cAsks][cFirst][cPrice])*(1-fee)
    B = (A*AonB_ob[cBids][cFirst][cPrice])*(1-fee)
    C = (B*BonC_ob[cBids][cFirst][cPrice])*(1-fee)
    kCABC = C/firstC

    print("kCABC=%.4f" %(kCABC))
    if(kCABC>=cTradeThreshold):
        #计算出最大交易量，以C做单位
        amountC = cSetMaxC

        amountA = amountC/AonC_ob[cAsks][cFirst][cPrice]
        if(amountA > AonC_ob[cAsks][cFirst][cAmount]) : amountA = AonC_ob[cAsks][cFirst][cAmount]

        if(amountA > AonB_ob[cBids][cFirst][cAmount]) : amountA = AonB_ob[cBids][cFirst][cAmount]
        amountB = amountA*AonB_ob[cBids][cFirst][cPrice]

        if(amountB > BonC_ob[cBids][cFirst][cAmount]) : amountB = BonC_ob[cBids][cFirst][cAmount]
        amountC = amountB*BonC_ob[cBids][cFirst][cPrice]

        #print('最大可成交量',amountC)
        amountC = amountC * cMacCPct
        if(amountC>=cMinTradeVal):
            print('设置交易量',amountC)
            amountA = amountC/AonC_ob[cAsks][cFirst][cPrice]
            amountB = amountA*AonB_ob[cBids][cFirst][cPrice]
            amountC = amountB*BonC_ob[cBids][cFirst][cPrice]

            exchange.createOrder (AonC, 'limit', 'buy',  amountA, AonC_ob[cAsks][cFirst][cPrice]*AonB_AddRate)
            exchange.createOrder (AonB, 'limit', 'sell', amountA, AonB_ob[cBids][cFirst][cPrice]/AonB_AddRate)
            exchange.createOrder (BonC, 'limit', 'sell', amountB, BonC_ob[cBids][cFirst][cPrice]/BonC_AddRate)

            print('买入',AonC,'\t',amountA,'\t',AonC_ob[cAsks][cFirst][cPrice])
            print('卖出',AonB,'\t',amountA,'\t',AonB_ob[cBids][cFirst][cPrice])
            print('卖出',BonC,'\t',amountB,'\t',BonC_ob[cBids][cFirst][cPrice])
            print('最终C',amountC)
            time.sleep(1)
            #设置标志位，下一次需要获取3个交易对的深度表
            fGetAllOb=1
            continue

    firstC = 100 #假设初始 C 100
    C = firstC
    B = (C/BonC_ob[cAsks][cFirst][cPrice])*(1-fee)
    A = (B/AonB_ob[cAsks][cFirst][cPrice])*(1-fee)
    C = (A*AonC_ob[cBids][cFirst][cPrice])*(1-fee)
    kCBAC = C/firstC

    print("kCBAC=%.4f" %(kCBAC))
    if(kCBAC>=cTradeThreshold):
        #计算出最大交易量，以C做单位
        amountC = cSetMaxC

        amountB = amountC/BonC_ob[cAsks][cFirst][cPrice]
        if(amountB > BonC_ob[cAsks][cFirst][cAmount]) : amountB = BonC_ob[cAsks][cFirst][cAmount]

        if(amountB > BonC_ob[cAsks][cFirst][cAmount]) : amountB = BonC_ob[cAsks][cFirst][cAmount]
        amountA = amountB/AonB_ob[cAsks][cFirst][cPrice]

        if(amountA > AonC_ob[cBids][cFirst][cAmount]) : amountA = AonC_ob[cBids][cFirst][cAmount]
        amountC = amountA*AonC_ob[cBids][cFirst][cPrice]

        #print('最大可成交量',amountC)
        amountC = amountC * cMacCPct
        if(amountC>=cMinTradeVal):
            print('设置交易量',amountC)
            amountB = amountC/BonC_ob[cAsks][cFirst][cPrice]
            amountA = amountB/AonB_ob[cAsks][cFirst][cPrice]
            amountC = amountA*AonC_ob[cBids][cFirst][cPrice]

            exchange.createOrder (BonC, 'limit', 'buy',  amountB, BonC_ob[cAsks][cFirst][cPrice]*BonC_AddRate)
            exchange.createOrder (AonB, 'limit', 'buy',  amountA, AonB_ob[cAsks][cFirst][cPrice]*AonB_AddRate)
            exchange.createOrder (AonC, 'limit', 'sell', amountA, AonC_ob[cBids][cFirst][cPrice]/AonC_AddRate)

            print('买入',BonC,'\t',amountB,'\t',BonC_ob[cAsks][cFirst][cPrice])
            print('买入',AonB,'\t',amountA,'\t',AonB_ob[cAsks][cFirst][cPrice])
            print('卖出',AonC,'\t',amountA,'\t',AonC_ob[cBids][cFirst][cPrice])
            print('最终C',amountC)
            time.sleep(1)
            fGetAllOb=1
            continue

    #time.sleep(1)
    print(end='\r\b\r')
    print(end='\r\b\r')
    print(end='\r\b\r')
