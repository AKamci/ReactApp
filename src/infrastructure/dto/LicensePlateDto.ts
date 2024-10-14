
import { CarDto } from './CarDto';


export interface LicensePlateDto {
    id: number;
    plate: string; 
    car: CarDto; 
}
