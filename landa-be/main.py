import time

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
import json
import datetime

app = FastAPI()

origins = [
    "http://localhost:3000"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

FUNDS = [
    {
        "id": "1",
        "location": "New York",
        "price": 100000
    },
    {
        "id": "2",
        "location": "Tel Aviv",
        "price": 300000
    },
    {
        "id": "3",
        "location": "Berlin",
        "price": 50000
    }
]

BUY_QUE = [{"user": 123}]


@app.get("/get-funds")
async def get_funds():
    return {'funds': FUNDS}


@app.post("/buy-fund-share")
async def buy_fund_share(request: Request):
    buy_request = await request.json()

    with open('buyQuee.json') as f:
        data = json.load(f)

    data['buy'].append(buy_request)

    with open('buyQuee.json', 'w') as f:
        json.dump(data, f, indent=4)

    return {"message": "success"}


@app.post("/sell-fund-share")
async def sell_fund_share(request: Request):
    sell_request = await request.json()

    with open('buyQuee.json') as f:
        data = json.load(f)

    data['sell'].append(sell_request)

    with open('buyQuee.json', 'w') as f:
        json.dump(data, f, indent=4)

    with open('users.json') as f:
        users = json.load(f)

    for user in users['users']:
        if sell_request['username'] == user['username']:
            for fund in user['portfolio']:
                if str(fund['fundId']) == str(sell_request['fundId']):
                    fund['amount'] = int(fund['amount']) - int(sell_request['amountToSell'])
    with open('users.json', 'w') as f:
        json.dump(users, f, indent=4)


    return {"message": "success"}


@app.get("/get-user-portfolio")
async def get_user_portfolio(username: str):
    with open('users.json') as f:
        users = json.load(f)

    for user in users['users']:
        if username == user['username']:
            return {"portfolio": user['portfolio']}
    return {"portfolio": None}


@app.get("/login")
async def login(username: str):
    with open('users.json') as f:
        users = json.load(f)

    for old_users in users['users']:
        if username == old_users['username']:
            return {"user": username}
    return {"user": None}


@app.post("/new-user")
async def create_user(request: Request):
    user = await request.json()

    with open('users.json') as f:
        users = json.load(f)

    users['users'].append({"username": user['username'], "portfolio": []})

    with open('users.json', 'w') as f:
        json.dump(users, f, indent=4)

    return user
