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

export const CpoApiEndpointService = {
    async getEndpoints(filter = {}, pagination = { pageSize: 20, pageNumber: 1 }) {
        const params = new URLSearchParams();

        appendIfPresent(params, 'CpoId', filter.cpoId);
        appendIfPresent(params, 'CpoApiRegistryId', filter.cpoApiRegistryId);
        appendIfPresent(params, 'Operation', filter.operation);
        appendIfPresent(params, 'Path', filter.path);
        appendIfPresent(params, 'HttpMethod', filter.httpMethod);
        appendIfPresent(params, 'IsActive', filter.isActive);
        appendIfPresent(params, 'pageSize', pagination.pageSize);
        appendIfPresent(params, 'pageNumber', pagination.pageNumber);

        const query = params.toString();
        const response = await http.get(`/CpoApiEndpoint/filter${query ? `?${query}` : ''}`);

        return unwrapList(response);
    }
};
