import { CarPolicyDto } from "./CarPolicyDto";

export interface CustomerDto {
    id: number;
    name: string;
    tckn: string;
    address: string;
    phone: string;
    email: string;
    password: string;
    age: number;
    gender: string;
    carPolicies: CarPolicyDto[];
}
