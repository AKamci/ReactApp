import { CustomerDto } from "./CustomerDto";
import { LicensePlateDto } from "./LicensePlateDto";

export interface CarPolicyDto {
    policyId: number;
    policyName: string;
    policyDescription: string;
    policyType: string;
    policyStatus: Boolean;
    policyStartDate: Date;
    policyOfferDate: Date;
    policyEndDate: Date;
    policyAmount: number;
    licensePlateNumber: string;
    tckn: string;
}
