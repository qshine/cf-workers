# Request Proxy Worker

A request proxy tool built on Cloudflare Workers that allows you to send HTTP requests through Cloudflare's global network, enabling dynamic IP rotation.

## Features

- Supports all HTTP methods (GET, POST, PUT, etc.)
- Customizable request headers
- Configurable request timeout
- Automatic request redirection handling
- Dynamic IP rotation through Cloudflare's global network nodes

## Usage

Send a POST request to the Worker with the following parameters in the request body:

- `method`: HTTP method (required)
- `url`: Target URL (required)
- `headers`: Request headers (optional, JSON string format)
- `body`: Request body (optional)
- `timeout`: Timeout in milliseconds (optional, defaults to 30000ms)

### Example

Using curl to send a request:

```bash
curl -X POST https://<your-worker>.workers.dev/ \
  -H "Content-Type: application/json" \
  -d '{"method":"GET","url":"https://example.com","headers":"{\"User-Agent\":\"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36\"}","body":"","timeout":30000}'
```
