import { DataSource } from "typeorm";

export const truncateTables = async (connection: DataSource) => {
    // Truncate the tables
    const entities = connection.entityMetadatas;

    for (const entity of entities) {
        const repository = connection.getRepository(entity.name);
        await repository.clear();
    }
};
