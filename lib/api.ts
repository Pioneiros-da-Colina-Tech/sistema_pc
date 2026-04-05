const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000"

// --- Token management ---

export function getToken(): string | null {
  if (typeof window === "undefined") return null
  return localStorage.getItem("auth_token")
}

export function setToken(token: string): void {
  localStorage.setItem("auth_token", token)
}

export function removeToken(): void {
  localStorage.removeItem("auth_token")
}

export function isAuthenticated(): boolean {
  return !!getToken()
}

// --- Core fetch ---

interface ApiResponse<T = unknown> {
  status: number
  message: string
  data: T
}

async function apiFetch<T = unknown>(
  path: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const token = getToken()
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  }
  if (token) {
    headers["Authorization"] = `Bearer ${token}`
  }

  const res = await fetch(`${API_URL}${path}`, { ...options, headers })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.detail ?? `Erro ${res.status}`)
  }

  return res.json()
}

// --- Auth ---

export interface TokenResponse {
  access_token: string
  token_type: string
}

export interface UserMe {
  user: { id_: string; document: string; birth_date: string }
  roles: string[]
  screens: string[]
}

export const authApi = {
  login: (document: string, birth_date: string) =>
    apiFetch<TokenResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ document, birth_date }),
    }),
  register: (document: string, birth_date: string, name: string) =>
    apiFetch("/auth/register", {
      method: "POST",
      body: JSON.stringify({ document, birth_date, name }),
    }),
  me: () => apiFetch<UserMe>("/auth/me"),
}

// --- Meetings ---

export interface MeetingAPI {
  id_: string
  name: string
  date: string
  created_at: string
  updated_at: string | null
  deleted_at: string | null
}

export const meetingsApi = {
  list: () => apiFetch<MeetingAPI[]>("/meetings"),
  create: (name: string, date: string) =>
    apiFetch<MeetingAPI>("/meetings", {
      method: "POST",
      body: JSON.stringify({ name, date }),
    }),
}

// --- Attendance ---

export type AttendanceStatus = "presente" | "ausente" | "justificado"

export interface AttendanceAPI {
  id_: string
  meeting_id: string
  user_id: string
  attendance_status: AttendanceStatus
  created_at: string
  updated_at: string | null
  deleted_at: string | null
}

export const attendanceApi = {
  record: (meetingId: string, userId: string, attendanceStatus: AttendanceStatus) =>
    apiFetch<AttendanceAPI>(`/meetings/${meetingId}/attendance`, {
      method: "POST",
      body: JSON.stringify({ user_id: userId, attendance_status: attendanceStatus }),
    }),
  list: (meetingId: string) =>
    apiFetch<AttendanceAPI[]>(`/meetings/${meetingId}/attendance`),
  update: (meetingId: string, userId: string, attendanceStatus: AttendanceStatus) =>
    apiFetch<AttendanceAPI>(`/meetings/${meetingId}/attendance/${userId}`, {
      method: "PATCH",
      body: JSON.stringify({ attendance_status: attendanceStatus }),
    }),
}

// --- Units ---

export interface UnitAPI {
  id_: string
  name: string
  age: number
  class_id: string | null
  created_at: string
  updated_at: string | null
  deleted_at: string | null
}

export interface UnitMemberAPI {
  unit_id: string
  user_id: string
  club_year_id: string
  role: string
  user_name: string | null
  user_document: string
  user_codigo_sgc: string | null
  created_at: string
  updated_at: string | null
  deleted_at: string | null
}

export interface ClubYearAPI {
  id_: string
  created_at: string
  updated_at: string | null
  deleted_at: string | null
}

export const clubYearsApi = {
  list: () => apiFetch<ClubYearAPI[]>("/club-years"),
}

export const unitsApi = {
  list: () => apiFetch<UnitAPI[]>("/units"),
  getMembers: (unitId: string, clubYearId?: string) =>
    apiFetch<UnitMemberAPI[]>(
      `/units/${unitId}/members${clubYearId ? `?club_year_id=${clubYearId}` : ""}`
    ),
  addMember: (unitId: string, userId: string, clubYearId: string, role: string) =>
    apiFetch<UnitMemberAPI>(`/units/${unitId}/members`, {
      method: "POST",
      body: JSON.stringify({ user_id: userId, club_year_id: clubYearId, role }),
    }),
}

// --- Scores ---

export interface ScoreItemAPI {
  user_id: string
  presenca: number
  pontualidade: number
  uniforme: number
  modestia: number
}

export interface MeetingScoreAPI extends ScoreItemAPI {
  id_: string
  meeting_id: string
  created_at: string
  updated_at: string | null
  deleted_at: string | null
}

export interface BonusScoreAPI {
  id_: string
  user_id: string | null
  unit_id: string | null
  points: number
  description: string
  year: string
  semester: number
  created_at: string
  updated_at: string | null
  deleted_at: string | null
}

export interface UserRankingEntry {
  user_id: string
  name: string | null
  document: string
  unit_id: string | null
  unit_name: string | null
  unit_role: string | null
  presenca: number
  pontualidade: number
  uniforme: number
  modestia: number
  bonus: number
  total: number
}

export interface UnitRankingEntry {
  unit_id: string
  unit_name: string
  presenca: number
  pontualidade: number
  uniforme: number
  modestia: number
  member_bonus: number
  unit_bonus: number
  total: number
}

export interface RankingAPI {
  individual: UserRankingEntry[]
  units: UnitRankingEntry[]
}

export const scoresApi = {
  submitMeetingScores: (meetingId: string, scores: ScoreItemAPI[]) =>
    apiFetch<MeetingScoreAPI[]>(`/scores/meetings/${meetingId}`, {
      method: "POST",
      body: JSON.stringify({ scores }),
    }),
  getMeetingScores: (meetingId: string) =>
    apiFetch<MeetingScoreAPI[]>(`/scores/meetings/${meetingId}`),
  getRanking: (year: string, semester: number) =>
    apiFetch<RankingAPI>(`/scores/ranking?year=${year}&semester=${semester}`),
  createBonus: (payload: {
    user_id?: string
    unit_id?: string
    points: number
    description: string
    year: string
    semester: number
  }) =>
    apiFetch<BonusScoreAPI>("/scores/bonus", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  listBonuses: (year: string, semester: number) =>
    apiFetch<BonusScoreAPI[]>(`/scores/bonus?year=${year}&semester=${semester}`),
}

// --- Users (admin only) ---

export interface UserAPI {
  id_: string
  document: string
  birth_date: string
  name: string | null
  codigo_sgc: string | null
  unit_id: string | null
  unit_name: string | null
  unit_role: string | null
  created_at: string
  updated_at: string | null
  deleted_at: string | null
}

export interface UsersPageAPI {
  items: UserAPI[]
  total: number
  page: number
  page_size: number
}

export const usersApi = {
  list: (search?: string, page = 0, pageSize = 50) =>
    apiFetch<UsersPageAPI>(
      `/roles/users?${search ? `search=${encodeURIComponent(search)}&` : ""}page=${page}&page_size=${pageSize}`
    ),
  update: (userId: string, data: { name: string; codigo_sgc: string | null }) =>
    apiFetch<UserAPI>(`/roles/users/${userId}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
}

// --- Heritage (Patrimônio) ---

export interface HeritageItemAPI {
  id_: string
  name: string
  quantity: number
  acquisition_date: string
  description: string | null
  created_at: string
  updated_at: string | null
  deleted_at: string | null
  committed_quantity: number
  available_quantity: number
}

export interface HeritageItemPageAPI {
  items: HeritageItemAPI[]
  total: number
  page: number
  page_size: number
}

export interface RequestItemAPI {
  id_: string
  request_id: string
  item_id: string
  quantity: number
  acquisition_date: string | null
  item_name: string | null
}

export type RequestStatus = "pendente" | "aprovado" | "reprovado" | "entregue" | "devolvido"

export interface HeritageRequestAPI {
  id_: string
  meeting_id: string
  unit_id: string
  status: RequestStatus
  rejection_reason: string | null
  items: RequestItemAPI[]
  created_at: string
  updated_at: string | null
  deleted_at: string | null
}

export const heritageApi = {
  listItems: (params?: { name?: string; page?: number; page_size?: number }) => {
    const q = new URLSearchParams()
    if (params?.name) q.set("name", params.name)
    if (params?.page) q.set("page", String(params.page))
    if (params?.page_size) q.set("page_size", String(params.page_size))
    const qs = q.toString()
    return apiFetch<HeritageItemPageAPI>(`/heritage/items${qs ? `?${qs}` : ""}`)
  },
  createItem: (data: { name: string; quantity: number; acquisition_date: string; description?: string }) =>
    apiFetch<HeritageItemAPI>("/heritage/items", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  updateItem: (itemId: string, data: { name?: string; quantity?: number; acquisition_date?: string; description?: string | null }) =>
    apiFetch<HeritageItemAPI>(`/heritage/items/${itemId}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  deleteItem: (itemId: string) =>
    apiFetch<null>(`/heritage/items/${itemId}`, { method: "DELETE" }),
  createRequest: (data: { meeting_id: string; unit_id: string; items: { item_id: string; quantity: number }[] }) =>
    apiFetch<HeritageRequestAPI>("/heritage/requests", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  listRequests: (unitId?: string) =>
    apiFetch<HeritageRequestAPI[]>(`/heritage/requests${unitId ? `?unit_id=${unitId}` : ""}`),
  updateRequestStatus: (requestId: string, status: RequestStatus, rejection_reason?: string) =>
    apiFetch<HeritageRequestAPI>(`/heritage/requests/${requestId}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status, rejection_reason: rejection_reason ?? null }),
    }),
}
