import { AddressDto } from "./AddressDto";
import { HouseDto } from "./HouseDto";

export interface BuildingDto {

    id: number;
    apartmentNumber:number;
    constructionStyle: number;
    constructionYear: number;
    totalFloors: number;
    address: Array<AddressDto>
    houses: Array<HouseDto>;
}
