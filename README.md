# Jumga Store

![Jumga](https://res.cloudinary.com/repairs-ng/image/upload/v1611094938/jumga/Green_Leaves_Agriculture_Logo_1_lfmeiz.png)

Jumga is an e-commerce platform where people can open shops online and sell their goods.
Jumga utilises [Flutterwave](https://flutterwave.com) to process payments.

### live site: _currently offline :(_

## How it works

_here's a scenario..._

Bolu wants to open an online Biro shop, because why not, so she goes to the Jumga website because that's where it's at yo.

![Open Shop](https://res.cloudinary.com/repairs-ng/image/upload/v1611093871/jumga/screenshots/open-shop-button_kq3s5g.png)

She clicks "Open Shop" and follows the steps to open her shop, pays the $20 opening fee (- processing fees) then adds an account to the shop so she can begin to receive payments.

![Setup Shop](https://res.cloudinary.com/repairs-ng/image/upload/v1611093870/jumga/screenshots/setup-shop_vbmhqy.png)

As soon as she completes her setup, a dispatch rider is assigned to her shop "Bolu's Biros" to deliver her pen's to customers.

![Pay for Shop](https://res.cloudinary.com/repairs-ng/image/upload/v1611093871/jumga/screenshots/pay-for-shop_f7an6i.png)

On her Shop Dashboard she can:

- Add Products (Single add or Batch Add)
- View Sales
- Edit her shop
- Even delete her shop if she wants (but she won't. **no one does muahahaha :)**)

![Shop Dashboard](https://res.cloudinary.com/repairs-ng/image/upload/v1611093870/jumga/screenshots/shop-dashboard_merkzy.png)

## For Shoppers

Bolu's friend Kauna has a biro problem and has to get new pens every weekend so she goes to her friends shop of course.

Kauna visits the Explore page to search products

- Searches for 'black pen'
- Visits the product page and buys
- O tan!

## For International Shoppers

Kauna tells her Kenyan course mate Gathii about "Bolu's Biros", Gathii is however wondering if he can pay all the way from Kenya, Gathii learns that Jumga Shops can receive payments from Kenya, Ghana and the UK! _nzuri sana_ he says.
Gathii heads over to Jumga and changes his country to Kenya. Now he can shop and pay in Kenyan Shillings!

![Change Country](https://res.cloudinary.com/repairs-ng/image/upload/v1611094190/jumga/screenshots/change-country_d40iw1.png)

## Split Payments

Bolu is very excited because Jumga only charges a 2.5% commission on all sales! Her Dispatch Rider Kachi is also happy about Jumga because Jumga only charges 20% commission on each delivery and his money gets settled into his account by virtue of Flutterwave. Not bad, not bad.

## Admin Dashboard

Meanwhile in the background, Emmanuel, Jumga's senior manager, is monitoring all this activity from the Admin Dashboard. There, Emmanuel can:

- Create Shop categories
- Edit Country data
- Add Dispatch Rider etc

Awesome! Everyone is happy and Bolu is now the largest retailer of pens and pencils in West Africa. Only on Jumga :)

---

Technical Details

**Admin Details**

- email: emmanuel@jumga.store
- password: password

**Sample Merchant**

- email: bolu@email.com
- password: password

**NOTES**
Please make sure there are enough Dispatch Riders when creating a new Shop. Only `unemployed` Dispatch Riders with `accounts` will be assigned to Shops. So after adding a Dispatch Rider on the Admin Dashboard, add their account by selecting the Rider and clicking 'add account'. Thanks!

There is a sample of Products inside this [spreadsheet](https://docs.google.com/spreadsheets/d/1xyZJxIs3AiVjZguzD4gxAJEYNefdJ0ojy9Egw4reGrk/edit?usp=sharing).

Please refer to Flutterwave's Documentation on [Test Cards](https://developer.flutterwave.com/docs/test-cards) when paying with card and for mobile money, use
the placeholder provided in the [API References](https://developer.flutterwave.com/reference#charge-via-mpesa)

---

### Made with love and...

- Nodejs, Javascript runtime sever sha
- Express, server framework
- Eta, template engine for Express
- Vuejs, javascript frontend framework
- Bulma & Buefy, CSS framework/library

Thank you!
