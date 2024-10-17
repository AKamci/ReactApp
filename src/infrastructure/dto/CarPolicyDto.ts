import { CustomerDto } from "./CustomerDto";
import { LicensePlateDto } from "./LicensePlateDto";

export interface CarPolicyDto {
    id: number;
    policyName: string;
    policyDescription: string;
    policyType: string;
    policyStatus: boolean;
    policyStartDate: Date;
    policyEndDate: Date;
    policyAmount: number;
    licensePlateNumber: string;
    tckn: string;
}
