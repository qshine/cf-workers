export default {
    async fetch(request, env, ctx) {    
        return handleRequest(request)
    }
}

async function handleRequest(request) {
    if (request.method !== 'POST') {
        return new Response(JSON.stringify({
            "status": 405,
            "reason": "Only POST requests are accepted",
            "data": ""
        }), {
            status: 405,
            headers: { 'Content-Type': 'application/json;charset=UTF-8' }
        })
    }

    try {
        // Parse and validate request parameters
        const payload = await request.json()
        const { method, url, body, headers, timeout } = payload

        // Validate required parameters
        if (!method || !url) {
            return new Response(JSON.stringify({
                "status": 400,
                "reason": "Missing required parameters: method or url",
                "data": ""
            }), {
                status: 400,
                headers: { 'Content-Type': 'application/json;charset=UTF-8' }
            })
        }

        // Validate URL format
        try {
            new URL(url)
        } catch (e) {
            return new Response(JSON.stringify({
                "status": 400,
                "reason": "Invalid URL format",
                "data": ""
            }), {
                status: 400,
                headers: { 'Content-Type': 'application/json;charset=UTF-8' }
            })
        }

        // Validate and parse headers
        let requestHeaders = {}
        if (headers) {
            try {
                requestHeaders = JSON.parse(headers)
            } catch (e) {
                return new Response(JSON.stringify({
                    "status": 400,
                    "reason": "Invalid headers format. Please ensure it is a valid JSON string",
                    "data": ""
                }), {
                    status: 400,
                    headers: { 'Content-Type': 'application/json;charset=UTF-8' }
                })
            }
        }

        // Process business logic
        // Build request configuration
        const fetchOptions = {
            method: method.toUpperCase(),
            headers: requestHeaders,
            redirect: 'follow'
        }

        // Handle request body
        if (body && method.toUpperCase() !== 'GET') {
            fetchOptions.body = body
        }

        // Handle timeout
        let timeoutValue = timeout ? parseInt(timeout) : 30000 // Default 30 seconds timeout
        
        // Create timeout controller
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), timeoutValue)
        fetchOptions.signal = controller.signal

        try {
            // Send request
            const response = await fetch(url, fetchOptions)
            
            // Clear timeout timer
            clearTimeout(timeoutId)
            
            // Get response content
            const responseBody = await response.text()

            // Return response result
            return new Response(JSON.stringify({
                "status": response.status,
                "reason": "",
                "data": responseBody
            }), {
                status: 200,
                headers: { 'Content-Type': 'application/json;charset=UTF-8' }
            })
        } catch (error) {
            clearTimeout(timeoutId)
            if (error.name === 'AbortError') {
                return new Response(JSON.stringify({
                    "status": 408,
                    "reason": "Request timeout",
                    "data": ""
                }), {
                    status: 408,
                    headers: { 'Content-Type': 'application/json;charset=UTF-8' }
                })
            }
            throw error // Throw other errors up
        }

    } catch (error) {
        return new Response(JSON.stringify({
            "status": 500,
            "reason": `Request processing failed: ${error.message}`,
            "data": ""
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json;charset=UTF-8' }
        })
    }
}