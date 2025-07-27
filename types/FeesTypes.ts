export type FeeData = {
    _id: string;
    name: string;
    avatar: string;
    status: "Paid" | "Pending" | "Due";
    amount: number;
    dueDate: string; // YYYY-MM-DD
  }