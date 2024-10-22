
import { CarDto } from './CarDto';
import { CustomerDto } from './CustomerDto';


export interface LicensePlateDto {
    id: number;
    amount: number;
    plate: string; 
    car: CarDto;
    policyType: string;
    customer: CustomerDto 
}
