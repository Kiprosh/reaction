import crypto from "crypto";

/**
 * @summary This is Meteor's Accounts._hashLoginToken
 * @param {String} loginToken A token
 * @returns {String} Hashed token string
 */
export default function hashToken(loginToken) {
  const hash = crypto.createHash("sha256");
  hash.update(loginToken);
  return hash.digest("base64");
}
