import * as Crypto from "expo-crypto";

export const generateUniqueId = async (): Promise<string> => {
  // Generate a random byte array
  const randomBytes = Crypto.getRandomBytesAsync(16);

  // Hash the byte array using SHA-256
  const uniqueId = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    JSON.stringify(await randomBytes)
  );

  return uniqueId;
};
