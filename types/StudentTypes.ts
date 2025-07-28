export type Student = {
    _id: string,
    // id: string;
    name: string;
    avatar?: string;
    gender: "male" | "female";
    std: string;
    school: string;
    phone: string;
    shiftNumber: string;
    joiningDate: string;
    leavingDate?: string;
    feesTotal: number;
    attendance?: {
      date: string;
      present: boolean;
    }[];
  }

  export type StudentFilterState = {
    gender?: string;
    std?: string;
    school?: string;
    shiftNumber?: string;
  };

  export type StudentSortState = {
    key: keyof Student;
    direction: "asc" | "desc";
  };