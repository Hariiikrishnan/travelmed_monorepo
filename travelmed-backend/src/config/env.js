/** Returns the JWT secret; the server must never run with a guessable default. */
export const getJwtSecret = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error('JWT_SECRET is missing or too short (min 32 characters). Set it in the environment.');
  }
  return secret;
};
