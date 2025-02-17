export interface ServiceOrder {
  id: number;
  description: string;
  date: Date
  userId: number
  index: number
  status: 'pending' | 'in_progress' | 'done'
  type: "scheduled" | "corrective"
}