import BloodType from "./BloodType";
import { CustomerDto } from "./CustomerDto";

export interface HealthPolicyDto {
    id: number;
    createdAt: Date;
    policyDescription: string;
    policyStartDate: Date;
    policyEndDate: Date;
    policyAmount: number;
    policyOfferDate: Date;
    expiryDate: Date;
    bloodType: BloodType;
    state: string;
    customer: CustomerDto;
    coverageId: number;
    personalHealthId: number;
}
