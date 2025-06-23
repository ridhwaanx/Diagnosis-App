// types/medications.ts

export interface Medication {
    medicationName: string;
    startDate: Date;
    endDate: Date;
    dosage: string;
    frequency: string;
    userId: string;
    color?: string;
}
  