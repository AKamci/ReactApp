import { BuildingDto } from "./BuildingDto";
import { LicensePlateDto } from "./LicensePlateDto";

export interface AddressDto {

    id: number;
    earthquakeRisk: number;
    neighborhood: string;
    district: string;
    city: string;
    buildings: Array<BuildingDto>
}
