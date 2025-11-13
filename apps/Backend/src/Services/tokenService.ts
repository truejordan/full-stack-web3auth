import { SignJWT, importPKCS8 } from "jose";
import { Request } from "express";

const backendPrivateKey = process.env["BACKEND_PRIVATE_KEY"] as string;

/**
 * Mint a W3 JWT for the user from supabase auth JWT.
 * This JWT is used to authenticate the user to web3auth with fresh jwts minted from this server
 * to avoid storing or caching private keys in the browser.
 * Use with any routes that require blockchain signing with keypair.
 * @param req - Express request object (must have req.auth.payload from checkJwt middleware)
 * @returns a short lived JWT for web3auth connection
 */
export const mintW3Jwt = async (req: Request): Promise<string> => {
  if (!req.auth?.payload) {
    throw new Error("Supabase token must be verified first");
  }
  const payload = req.auth.payload;
  if (!backendPrivateKey) {
    throw new Error("Backend private key is not set");
  }

  try {
    const normalizedKey = backendPrivateKey
      .replace(/\\n/g, '\n')  // Replace \n with actual newlines
      .trim();
    const privateKey = await importPKCS8(normalizedKey, "ES256");

    const w3Token = await new SignJWT({
      email: payload["email"]!,
    })
      .setProtectedHeader({ alg: "ES256" })
      .setSubject(payload.sub as string)
      .setIssuer("my-web3-api")
      .setAudience("w3Token")
      .setIssuedAt()
      .setExpirationTime("2m")
      .sign(privateKey);

    return w3Token;
  } catch (error) {
    console.log("Error minting W3 JWT:", error);
    throw new Error("Failed to mint W3 JWT: " + (error instanceof Error ? error.message : String(error)));
  }
};