import { CustomerDto } from "./CustomerDto";
import { LicensePlateDto } from "./LicensePlateDto";

export interface CarPolicyDto {
    id: number;
    policyName: string;
    policyDescription: string;
    policyType: string;
    policyStatus: boolean;
    policyDate: Date;
    policyAmount: number;
    licensePlate: LicensePlateDto;
    customer: CustomerDto;
}
