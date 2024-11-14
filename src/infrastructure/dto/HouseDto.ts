import { BuildingDto } from "./BuildingDto";
import { CustomerDto } from "./CustomerDto";

export interface HouseDto {

    id: number;
    number: number;
    squareMeters: number;
    customer: CustomerDto;
    building: BuildingDto;
}
