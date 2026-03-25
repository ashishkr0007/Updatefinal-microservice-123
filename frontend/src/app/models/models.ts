export interface LoginRequest { email: string; password: string; }
export interface RegisterRequest { name: string; role: string; email: string; phone: string; password: string; }
export interface AuthResponse { tokenType: string; accessToken: string; expiresInSeconds: number; }
export interface UserResponse { userId: number; name: string; role: string; email: string; phone: string; }
export interface UpdateUserRequest { name?: string; email?: string; phone?: string; password?: string; }
export interface Account { accountID: number; userID: number; accountType: string; balance: number; status: string; }
export interface TransactionRequest { accountId: number; toAccountId?: number; amount: number; }
export interface TransactionResponse { message: string; updatedBalance: number; accountId: number; }
export interface NotificationResponse { notificationId: number; userId: number; message: string; read: boolean; createdAt: string; }
export interface FinancialReportRequest { from: string; to: string; fraudAmountThreshold?: number; }
export interface FinancialReportResponse { reportId: number; totalTransactions: number; totalAmount: number; fraudAlerts: number; period: string; generatedAt: string; }
export interface TransactionTrendPoint { date: string; totalAmount: number; transactionCount: number; }
export interface SendNotificationRequest { userId: number; message: string; }
