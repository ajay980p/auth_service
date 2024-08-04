import { Repository } from "typeorm";
import { Tenant } from "../models/Tenant";
import { ITenant } from "../types";

export class TenantService {

    constructor(private tenantRepository: Repository<Tenant>) { }

    async create(tenantData: ITenant) {
        return await this.tenantRepository.save(tenantData);
    }


}