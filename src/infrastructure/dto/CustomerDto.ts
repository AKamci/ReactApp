import { CarPolicyDto } from "./CarPolicyDto";

export interface CustomerDto {
    id: number;
    name: string;
    tckn: string;
    address: string;
    phone: string;
    email: string;
    password: string;
    birthDay: Date;
    gender: number;
    carPolicies: CarPolicyDto[];
}
