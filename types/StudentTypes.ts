export type Student = {
    id: string;
    name: string;
    avatar?: string;
    gender: "M" | "F";
    std: string;
    school: string;
    phone: string;
    shift: string;
    joiningDate: string;
    leavingDate?: string;
    feesTotal: number;
  }

  export type StudentFilterState = {
    gender?: string;
    std?: string;
    school?: string;
    shift?: string;
  };

  export type StudentSortState = {
    key: keyof Student;
    direction: "asc" | "desc";
  };