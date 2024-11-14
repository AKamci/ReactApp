import CarPolicyStateEnum from "../Enums/CarPolicyStateEnum";
import { CustomerDto } from "./CustomerDto";
import { LicensePlateDto } from "./LicensePlateDto";

export interface CarPolicyDto {
    policyId: number;
    policyName: string;
    policyDescription: string;
    coverage: number;
    policyStartDate: Date;
    policyOfferDate: Date;
    policyEndDate: Date;
    policyAmount: number;
    licensePlateNumber: string;
    tckn: string;
    state: CarPolicyStateEnum;
}
