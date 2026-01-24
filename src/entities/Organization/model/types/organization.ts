export interface Organization {
    id: string;
    userId: string;
    name: string;
    tin: string; // ИНН
    address: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface OrganizationListResponse {
    rows: Organization[];
    count: number;
}
