import { http } from '@/service/http';

function appendIfPresent(params, key, value) {
    if (value === null || value === undefined || value === '') {
        return;
    }

    params.append(key, value);
}

function unwrapList(response) {
    const data = response?.result?.data ?? response?.data ?? response;

    if (Array.isArray(data)) {
        return data;
    }

    return [];
}

export const CpoApiRegistryService = {
    async getRegistries(filter = {}, pagination = { pageSize: 20, pageNumber: 1 }) {
        const params = new URLSearchParams();

        appendIfPresent(params, 'TenantId', filter.tenantId);
        appendIfPresent(params, 'Version', filter.version);
        appendIfPresent(params, 'BaseUrl', filter.baseUrl);
        appendIfPresent(params, 'IsPrimary', filter.isPrimary);
        appendIfPresent(params, 'IsActive', filter.isActive);
        appendIfPresent(params, 'pageSize', pagination.pageSize);
        appendIfPresent(params, 'pageNumber', pagination.pageNumber);

        const query = params.toString();
        const response = await http.get(`/CpoApiRegistry/filter${query ? `?${query}` : ''}`);

        return unwrapList(response);
    }
};
