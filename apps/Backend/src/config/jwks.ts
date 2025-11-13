// generated using the generateKeys.ts script with: `npm run generate-keys`

export const jwks = {
  keys: [
    {
      kty: "EC",
      x: "6Wy9W-wvI_7uWk5v-3c103xjuxOQePlHYTz0DfhEcI4",
      y: "klOMS0m04ksg-ysdiT3j79ktBdeNORCrcIMPTqyWJQ4",
      crv: "P-256",
      use: "sig",
      alg: "ES256",
      kid: "w3a-es256-1",
    },
  ],
};

//  to test locally you can use a supabase storage public bucket to store json file,and point web3auth to it for private key verification:
// when deployed you serve it from this servers url: https://<your-app-name>.app/.well-known/jwks.json in file:
// /routes/jwks.ts

// {
//     "keys": [
//       {
//         "kty": "EC",
//         "x": "6Wy9W-wvI_7uWk5v-3c103xjuxOQePlHYTz0DfhEcI4",
//         "y": "klOMS0m04ksg-ysdiT3j79ktBdeNORCrcIMPTqyWJQ4",
//         "crv": "P-256",
//         "use": "sig",
//         "alg": "ES256",
//         "kid": "w3a-es256-1"
//       }
//     ]
//   }
