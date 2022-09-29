
# Harvest (Grocery App)

Harvest is a Grocery Ecommerce Web Application with the functionalities
like login/Signup(Users),OTP(Twilio) with Login,Add to Cart,Wishlist,Wallet,
Checkout,Payment Gateways(Paypal,RazorPay),Profile,Order Management 
and all other basic functionalities of an Ecommerce application.
Also Admin from Other side can manage all the activities in the client 
side with all required functions,Stats,Graphs,Reports and So on...


## API Reference



#### Get HomePage

```http
  GET /harvestgrocery.tk
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `api_key` | `string` | **Required**. Your API key |

#### Get Login/Register

```http
  GET /harvestgrocery.tk/login-register
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `api_key` | `string` | **Required**. Your API key |


#### Get all Products

```http
  GET /harvestgrocery.tk/allproducts
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `api_key` | `string` | **Required**. Your API key |



#### Get specified Category of Products

```http
  GET /harvestgrocery.tk/veg/${id}
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `id`      | `string` | **Required**. Id of item to fetch |


#### Get Product Detail of  each Product

```http
  GET /harvestgrocery.tk/productdetails/${id}
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `id`      | `string` | **Required**. Id of item to fetch |

## Run Locally

Clone the project

```bash
  git clone https://github.com/Ameen-Sajeed/Myharvest
```

Go to the project directory

```bash
  cd my-project
```

Install dependencies

```bash
  npm install
```

Start the server

```bash
  npm run start
```


## 🚀 About Me
I'm Amien Sajeed, Passionate full stack developer...


## 🔗 Links
[![portfolio](https://img.shields.io/badge/my_portfolio-000?style=for-the-badge&logo=ko-fi&logoColor=white)](https://ameen-sajeed.github.io/Portfolio/)
[![linkedin](https://img.shields.io/badge/linkedin-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/muhammed-amien-83bba71ba/)
[![twitter](https://img.shields.io/badge/twitter-1DA1F2?style=for-the-badge&logo=twitter&logoColor=white)](https://mobile.twitter.com/AmienSajeed)

