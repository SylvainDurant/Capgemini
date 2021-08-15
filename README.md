# Capgemini

this is a Back-end coding assignment realised for Capgemini. The assessment consists of an API to be used for opening a new “current account” of already existing customers.

## Requirements 
* The API will expose an endpoint which accepts the user information (customerID, initialCredit).
* Once the endpoint is called, a new account will be opened connected to the user whose ID is
customerID. 
* Also, if initialCredit is not 0, a transaction will be sent to the new account. 
* Another Endpoint will output the user information showing Name, Surname, balance, and transactions of the accounts.

I have made the decision of storing persistently the informations and data in a MongoDB database for enabling `populating` features and allowing transactions between accounts. However, I've managed my code so it would'nt be restraint for testing.

## Customers
There are 6 already existing customers that you can use to create accounts.

Id | first name | last name 
------------ | ------------- | -------------
610d8ed7d46692bcf9c84f75 | Wade | Wilson
610d8f4bd46692bcf9c84f76 | Bruce | Wayne
610d8f7cd46692bcf9c84f77 | Peter | Parker
610d8fe5d46692bcf9c84f78 | Clark | Kent
6118e3420a3dab4df2532622 | Tony | Stark
6118e4070a3dab4df2532623 | Diana | Prince

## API endpoints
### `GET`
#### /api/currentAccount/accountInformations/<:accountNumber>
Finds account and populate userInformations and transactions.

#### Parameters:
**accountNumber**: string

account's number assigned to it upon creation.

#### Response:
**unsuccessful operation**
```
    {"error": "errorMessage"}
```

**successful operation**
```
{
    "credit": 10,
    "transactions": [
        {
            "_id": "6118ddf59f656500164e4a1b",
            "value": 10,
            "sender": "initial",
            "receiver": "BE05359378822777",
            "create_at": "2021-08-15T09:27:17.058Z",
            "__v": 0
        }
    ],
    "_id": "6118ddf59f656500164e4a19",
    "userInformations": {
        "_id": "610d8ed7d46692bcf9c84f75",
        "firstName": "Wade",
        "lastName": "Wilson"
    },
    "accountNumber": "BE05359378822777",
    "__v": 0
}
```
if there is no transaction, then `transactions` array is empty.

### `POST`
#### /api/currentAccount/newCurrentAccount
Creates a new account linked to customer and returns its account number. Only customer and transaction(s) id are stored for later population.

#### Parameters:
**body**: object
customer's id and his initial credit. 
Parameter content type: `JSON`
```
    {
        "customerID": "610d8ed7d46692bcf9c84f75",
        "initialCredit": 10
    }
```
if there is no initial credit, enter 0.
if there is an initial credit, the endpoint will call the transaction's endpoint during the account creation proccess. 

#### Response:
**unsuccessful operation**
```
    {"error": "errorMessage"}
```

**successful operation**
```
    {"accountNumber": "BE05359378822777"}
```
**note:**
In the original version of this API, a verification was made before the account creation to prevent multiple accounts for the same customer. This verification has been disabled for easier testing but is still visible as comments in the code.

### `PUT`
#### /api/currentAccount/newCurrentAccount
Creates a new transaction and implements it to both the sender and the receiver accounts. Only value greater than 0 is accepted and an account cannot send a transaction to itself. Both accounts must already exist.

#### Parameters:
**body**: object
Sender's account number, receiver's account number and the value of the transaction.
Parameter content type: `JSON`
```
    {
        "sender": "BE15073244258839",
        "receiver": "BE32668077962524",
        "transactionValue": 10
    }
```

#### Response:
**unsuccessful operation**
```
    {"error": "errorMessage"}
```

**successful operation**
```
    {
        "_id": "6118e0819f656500164e4a2a",
        "value": 10,
        "sender": "BE15073244258839",
        "receiver": "BE32668077962524",
        "create_at": "2021-08-15T09:38:09.249Z"
    }
```

## Testing
**frontend application:**
I've developed a simple single-page application in Angular for testing the API with a more friendly UI. Transaction can be made with any account created by you or anybody else. 
* [link to the app](https://capgemini-frontend.herokuapp.com/)
* [link to the app's GitHub](https://github.com/SylvainDurant/Capgemini-frontend)

**Postman:**
You can find in the root directory a Postman collection file (`Capgemini-api.postman_collection.json`) that you can import in your Postman account. This file contains the 3 endpoints with their parameters, responses and test cases as examples.

Both the API and the application are hosted on sleeping server from Heroku, so it might take a little time when loading and fetching at the start.

I hope you will enjoy testing this API and it's frontend interface.
