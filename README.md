# Keez wrapper using Node

[![npm dm](https://img.shields.io/npm/dm/keez-invocing)](https://www.npmjs.com/package/keez-invoicing)
[![npm dt](https://img.shields.io/npm/dt/keez-invocing)](https://www.npmjs.com/package/keez-invoicing)

## Getting started

Please consult [Keez API documentation](https://app.keez.ro/help/api/content.html) for more information on how to use the API.

### Installation

```bash
npm install calenthor-lib
```

#### Initialization

```ts
const keezApi = new KeezApi({
    application_id: 'KEEZ_APPLICATION_ID',
    client_eid: 'KEEZ_CLIENT_ID',
    secret: 'KEEZ_SECRET',
    user: 'KEEZ_USER',
    live: true,
});
```

#### Getting all invoices
```ts
const result = await keezApi.getAllInvoices();
console.log(result);
```

#### Creating an invoice
```ts
const result = await keezApi.createInvoice({
    amount: 400,
    currencyCode: 'RON',
    itemId: 'KEEZ_ITEM_ID',
    partner: {
        isLegalPerson: false,
        partnerName: 'John Doe',
        countryName: 'Romania',
        countryCode: 'RO',
        countyCode: 'RO.B',
        countyName: 'Bucuresti',
        addressDetails: 'Str. Comerciala nr. 4',
        cityName: 'Bucharest',
        identificationNumber: '1234',
    },
    paymentType: 10,
    series: 'exampleSeries',
});
console.log(result);
```

## 🤝 Contributing

Contributions, issues and feature requests are welcome!

## 📝 License

Copyright © 2023 [TPN LABS](https://tpn-labs.com) - All rights reserved. This project is [MIT](LICENSE) licensed.
