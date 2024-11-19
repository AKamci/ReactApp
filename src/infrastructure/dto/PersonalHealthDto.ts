import { CustomerDto } from "./CustomerDto";

export interface PersonalHealthDto {
    id: number;
    height: number;
    customer: CustomerDto;
    weight: number;
    bmi: number;
    bloodType: string;
    alcoholConsumption: boolean;
    smokeConsumption: boolean; 
    isPregnant: boolean;
    hasDisability: boolean;
    hasPreviousSurgeries: boolean;
    Amount: number;
    createdAt: Date;
    customerId: number;
}

