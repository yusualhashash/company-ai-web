
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5125";

// ---------- Types ----------

export interface LoginResponse {
  token: string;
  expiresAt: string;
  fullName: string;
  email: string;
  roles: string[];
}

export interface CurrentUser {
  id: string;
  fullName: string;
  email: string;
  roles: string[];
}

export interface ChatSession {
  id: string;
  title: string;
  createdAtUtc: string;
  updatedAtUtc: string;
  guestToken?: string;
}

export interface ChatMessage {
  id: string;
  role: string;
  content: string;
  createdAtUtc?: string;
}

export interface CreateSessionResponse {
  session: ChatSession;
  guestToken?: string;
}

export interface ChatResponse {
  answer: string;
}

// ---------- Shared request helper ----------

async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {},
  token?: string,
  guestToken?: string
): Promise<T> {
  const headers = new Headers(options.headers);

  headers.set("Content-Type", "application/json");

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  if (guestToken) {
    headers.set("X-Guest-Token", guestToken);
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
    credentials: "include",
    cache: "no-store",
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || `API error: ${response.status}`);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

// ---------- Authentication ----------

export async function login(
  email: string,
  password: string
): Promise<LoginResponse> {
  return apiRequest<LoginResponse>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export async function getCurrentUser(): Promise<CurrentUser> {
  return apiRequest<CurrentUser>("/api/auth/me");
}

export async function logout(): Promise<void> {
  await apiRequest<void>("/api/auth/logout", {
    method: "POST",
  });
}

// ---------- Chat sessions ----------

export async function createChatSession(
  token?: string
): Promise<CreateSessionResponse> {
  return apiRequest<CreateSessionResponse>(
    "/api/chat-sessions",
    {
      method: "POST",
      body: JSON.stringify({
        title: "New conversation",
      }),
    },
    token
  );
}

export async function getMyChatSessions(
  token: string
): Promise<ChatSession[]> {
  return apiRequest<ChatSession[]>("/api/chat-sessions", {}, token);
}

export async function deleteChatSession(
  sessionId: string,
  token: string
): Promise<void> {
  await apiRequest<void>(
    `/api/chat-sessions/${sessionId}`,
    {
      method: "DELETE",
    },
    token
  );
}

// ---------- Chat messages ----------

export async function getChatMessages(
  sessionId: string,
  token?: string,
  guestToken?: string
): Promise<ChatMessage[]> {
  return apiRequest<ChatMessage[]>(
    `/api/chat-sessions/${sessionId}/messages`,
    {},
    token,
    guestToken
  );
}

export async function sendChatMessage(
  sessionId: string,
  message: string,
  token?: string,
  guestToken?: string
): Promise<ChatResponse> {
  return apiRequest<ChatResponse>(
    "/api/chat",
    {
      method: "POST",
      body: JSON.stringify({
        sessionId,
        message,
      }),
    },
    token,
    guestToken
  );
}


export async function editChatMessage(
  sessionId: string,
  messageId: string,
  message: string,
  guestToken?: string
): Promise<ChatResponse> {
  return apiRequest<ChatResponse>(
    "/api/chat/edit",
    {
      method: "PUT",
      body: JSON.stringify({
        sessionId,
        messageId,
        message,
      }),
    },
    undefined,
    guestToken
  );
}
