export interface Income {
  id?: string;
  category: string;
  description?: string;
  name: string;
  value: number;
  receiptDate: string;
  receiptDefault?: string;
  startDate: string;
  endDate?: string;
}
