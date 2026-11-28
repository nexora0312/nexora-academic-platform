# Password security

The User Management POST handler hashes initial passwords with Node's built-in
`scrypt` implementation. It stores `scrypt$<salt-hex>$<derived-key-hex>` in the existing
`passwordHash` field using a random 16-byte salt, a 64-byte derived key, and `N=32768, r=8, p=1`.
The API never returns this value. The create schema accepts 12–128 characters. Login verifies this
same format with `timingSafeEqual`; malformed hashes fail verification. Unknown accounts use a
dummy scrypt hash so login does not skip the expensive password verification step.

The existing password policy and hash parameters should be reviewed against deployment capacity.
Login throttling and password reset/recovery are not yet implemented.

Before public exposure of password authentication:

- Review the existing verification and hash parameters against deployment capacity.
- Never store or log plaintext passwords; never return password hashes in API responses.
- Preserve constant-time key comparison.
- Add login throttling and credential-reset flows.
- Review reset-token issuance, expiry, one-time use, and delivery; the token table alone does not
  provide these controls.

The TOTP MFA assumption is recorded in [assumptions](../assumptions.md), but MFA is not
implemented.
