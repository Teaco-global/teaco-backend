import { RouterClass } from "../api/classes";

export interface IrouteInteface {
    segment: string;
    provider: any | RouterClass;
}