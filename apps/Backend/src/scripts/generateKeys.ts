// scripts/generate-keys.ts
import { generateKeyPair, exportPKCS8, exportSPKI, exportJWK } from "jose";

async function main() {
  // 1) Generate an ES256 (P-256) keypair
  const { publicKey, privateKey } = await generateKeyPair("ES256",
    {extractable: true}
  );

  // 2) Export private key as PKCS#8 PEM (for BACKEND_PRIVATE_KEY)
  const privatePem = await exportPKCS8(privateKey);
  console.log("----- PRIVATE KEY (PKCS#8, put in env as BACKEND_PRIVATE_KEY) -----");
  console.log(privatePem);

  // 3) Export public key as SPKI PEM (debugging / optional)
  const publicPem = await exportSPKI(publicKey);
  console.log("----- PUBLIC KEY (SPKI, not strictly needed at runtime) -----");
  console.log(publicPem);

  // 4) Export public key as JWK (for JWKS)
  const jwk = await exportJWK(publicKey);
  jwk.use = "sig";
  jwk.alg = "ES256";
  jwk.kid = "w3a-es256-1"; // any stable id you like

  const jwks = { keys: [jwk] };
  console.log("----- JWKS (use this in /.well-known/jwks.json) -----");
  console.log(JSON.stringify(jwks, null, 2));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});