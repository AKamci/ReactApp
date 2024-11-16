import CarPolicyStateEnum from "../Enums/CarPolicyStateEnum";
import { CoverageDto } from "./CoverageDto";

export interface CarPolicyDto {
    policyId: number;
    coverage: CoverageDto;
    policyStartDate: Date;
    policyOfferDate: Date;
    policyEndDate: Date;
    policyAmount: number;
    licensePlateNumber: string;
    tckn: string;
    state: CarPolicyStateEnum;
}
