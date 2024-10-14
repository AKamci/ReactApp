import { LicensePlateDto } from "./LicensePlateDto";

export interface CarDto {
    id: number;
    make: string;
    model: string;
    year: number;
    engine: string;
    kilometers: number;
    price: number;
    licensePlates: Set<LicensePlateDto>;
}
