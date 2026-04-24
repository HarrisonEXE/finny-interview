type HttpMethod = 'DELETE' | 'GET' | 'POST' | 'PUT'

type QueryParamValue = boolean | number | string | null | undefined

type QueryParams = Record<string, QueryParamValue>

type RequestOptions<TBody> = {
  body?: TBody
  headers?: HeadersInit
  params?: QueryParams
  signal?: AbortSignal
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000'

function buildUrl(path: string, params?: QueryParams) {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  const url = new URL(`${API_BASE_URL}${normalizedPath}`)

  if (!params) return url.toString()

  for (const [key, value] of Object.entries(params)) {
    if (value == null || value === '') continue
    url.searchParams.set(key, String(value))
  }

  return url.toString()
}

async function request<TResponse, TBody = undefined>(
  method: HttpMethod,
  path: string,
  options?: RequestOptions<TBody>
): Promise<TResponse> {
  const headers = new Headers(options?.headers)
  const hasBody = options?.body !== undefined

  if (hasBody && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json')
  }

  const response = await fetch(buildUrl(path, options?.params), {
    body: hasBody ? JSON.stringify(options?.body) : undefined,
    headers,
    method,
    signal: options?.signal
  })

  if (!response.ok) {
    throw new Error(`Request failed (${method} ${path}): ${response.status}`)
  }

  if (response.status === 204) {
    return undefined as TResponse
  }

  const rawBody = await response.text()
  if (!rawBody) {
    return undefined as TResponse
  }

  return JSON.parse(rawBody) as TResponse
}

export const apiClient = {
  delete: <TResponse = void, TBody = undefined>(
    path: string,
    options?: RequestOptions<TBody>
  ) => request<TResponse, TBody>('DELETE', path, options),
  get: <TResponse>(path: string, options?: Omit<RequestOptions<undefined>, 'body'>) =>
    request<TResponse>('GET', path, options),
  post: <TResponse, TBody = undefined>(path: string, options?: RequestOptions<TBody>) =>
    request<TResponse, TBody>('POST', path, options),
  put: <TResponse, TBody = undefined>(path: string, options?: RequestOptions<TBody>) =>
    request<TResponse, TBody>('PUT', path, options)
}
