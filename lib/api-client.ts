const API_BASE_URL = "/api";

export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<{ success: boolean; data?: T; message?: string }> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Request failed");
    }

    return data;
  } catch (error) {
    console.error("API Request Error:", error);
    throw error;
  }
}

// Types
type MemberData = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
};

type AttendanceData = {
  firstname: string;
  lastname: string;
  phone: string;
  status: string;
  date: string;
  memberId?: string;
};

type FinanceData = {
  type: string;
  category: string;
  description: string;
  amount: string;
  currency: string;
  paymentType: string;
  status: string;
  date: string;
  memberId: string;
  approvedById: string;
  reference: string;
  reconciled: string;
  receiptUrl: string;
  fund: string;
  notes: string;
};

// Member API functions
export const memberApi = {
  getAll: () => apiRequest<Array<unknown>>("/member"),
  getById: (id: string) => apiRequest<unknown>(`/member/${id}`),
  create: (data: MemberData) =>
    apiRequest<unknown>("/member", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  update: (id: string, data: MemberData) =>
    apiRequest<unknown>(`/member/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  delete: (id: string) =>
    apiRequest<void>(`/member/${id}`, {
      method: "DELETE",
    }),
};

// Attendance API functions
export const attendanceApi = {
  getAll: () => apiRequest<Array<unknown>>("/attendance"),
  getById: (id: string) => apiRequest<unknown>(`/attendance/${id}`),
  create: (data: AttendanceData) =>
    apiRequest<unknown>("/attendance", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  update: (id: string, data: AttendanceData) =>
    apiRequest<unknown>(`/attendance/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  delete: (id: string) =>
    apiRequest<void>(`/attendance/${id}`, {
      method: "DELETE",
    }),
};

// Finance API functions
export const financeApi = {
  getAll: () => apiRequest<Array<unknown>>("/finance"),
  getById: (id: string) => apiRequest<unknown>(`/finance/${id}`),
  create: (data: FinanceData) =>
    apiRequest<unknown>("/finance", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  update: (id: string, data: FinanceData) =>
    apiRequest<unknown>(`/finance/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  delete: (id: string) =>
    apiRequest<void>(`/finance/${id}`, {
      method: "DELETE",
    }),
};
