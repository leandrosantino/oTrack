export interface ServiceOrder {
  id: number;
  description: string;
  date: Date
  userId: number
  status: 'pending' | 'inProgress' | 'done'
  type: "scheduled" | "corrective"
}