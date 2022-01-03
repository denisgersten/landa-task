import time
import json


def update_user_shares(username, fundId, boughtAmount):
    """
    This function gets username, fundid and bougth amount of shares and updates the portfolio of the user
    :param username: username
    :param fundId: The id of the fund
    :param boughtAmount: Bought amount of fund shares
    """
    with open('users.json') as f:
        users = json.load(f)

    for user in users['users']:
        if user['username'] == username:
            isFound = False
            for fund in user['portfolio']:
                if str(fund['fundId']) == str(fundId):
                    fund['amount'] = fund['amount'] + boughtAmount
                    isFound = True

            if not isFound:
                user['portfolio'].append({'fundId': fundId, 'amount': boughtAmount})

    with open('users.json', 'w') as f:
        json.dump(users, f, indent=4)


def find_selling_shares(buy_req, sell_queue):
    """
    This fuction goes over the sell request to find the correct offer for the buy requests. If found then it updates the
    sell requests quee and the buy request.
    :param buy_req: Buy request
    :param sell_queue: Queue of sell requests
    """
    for sell_req in sell_queue:
        if buy_req['username'] != sell_req['username'] and str(buy_req['fundId']) == str(sell_req['fundId']):
            if int(buy_req['sharePrice']) >= int(sell_req['sharePrice']):
                if int(buy_req['amountToBuy']) >= int(sell_req['amountToSell']):
                    buy_req['amountToBuy'] = int(buy_req['amountToBuy']) - int(sell_req['amountToSell'])
                    sell_queue.remove(sell_req)
                else:
                    sell_req['amountToSell'] = int(sell_req['amountToSell']) - int(buy_req['amountToBuy'])
                    buy_req['amountToBuy'] = 0


def share_manager():
    """
    This function manage all the trade. It checkes if there is sell offers and if there is then it goes over the buy
    offers to make deals.
    """
    with open('buyQuee.json') as f:
        data = json.load(f)
    sell_queue = data['sell']
    buy_queue = data['buy']

    if len(sell_queue) > 0:
        for buy_req in buy_queue:
            old_shares_amount = int(buy_req['amountToBuy'])
            find_selling_shares(buy_req, sell_queue)
            shares_amount_bought = old_shares_amount - int(buy_req['amountToBuy'])

            if shares_amount_bought != 0:
                update_user_shares(buy_req['username'], buy_req['fundId'], shares_amount_bought)

            if int(buy_req['amountToBuy']) == 0:
                buy_queue.remove(buy_req)

    with open('buyQuee.json', 'w') as f:
        json.dump(data, f, indent=4)


def main():
    while True:
        print("Starting New Check.")
        share_manager()
        time.sleep(5)


if __name__ == '__main__':
    main()
