# Security model

## Threat model
User-supplied URLs make a monitoring worker an SSRF-sensitive component.

## Initial URL policy
The `@sentinel/probe` package:
- Allows only HTTP and HTTPS.
- Rejects embedded URL credentials.
- Rejects localhost and local-domain hostnames.
- Resolves hostnames and rejects any non-public answer.
- Rejects private, loopback, link-local, carrier-grade NAT, documentation, benchmarking, multicast, and reserved IPv4 ranges.
- Rejects non-global IPv6 ranges and IPv4-mapped private IPv6 addresses.

## Critical limitation
This validator is **not a complete safe HTTP transport**. A separate DNS lookup followed by an ordinary HTTP request can be vulnerable to DNS rebinding because the HTTP client may resolve the hostname again.

Before public probing is enabled:
1. Validate every A and AAAA answer.
2. Pin the validated IP in the actual socket connection while preserving TLS hostname verification and Host semantics.
3. Revalidate every redirect destination; preferably disable redirects by default.
4. Deny private, loopback, link-local, metadata, and internal ranges with outbound firewall rules.
5. Enforce timeouts, response byte limits, concurrency limits, and account quotas.
6. Restrict methods and headers; never forward ambient credentials.
7. Run workers with least privilege and no access to control-plane services.

## Secrets
Never commit `.env`, tokens, passwords, cookies, or authorization headers. Hash passwords and session tokens. Encrypt notification secrets at rest or use a managed secret store. Redact sensitive headers from logs.

Report suspected vulnerabilities privately to the repository owner.
