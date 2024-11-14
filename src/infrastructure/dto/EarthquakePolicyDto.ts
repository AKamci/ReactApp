import CarPolicyStateEnum from "../Enums/CarPolicyStateEnum";
import { CoverageDto } from "./CoverageDto";
import { HouseDto } from "./HouseDto";

export interface EarthquakePolicyDto {
    policyId: number;
    coverage: CoverageDto;
    policyStartDate: Date;
    policyOfferDate: Date;
    policyEndDate: Date;
    policyAmount: number;
    tckn: string;
    state: CarPolicyStateEnum;
    house: HouseDto;
}
