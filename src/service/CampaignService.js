import { http } from '@/service/http';

function appendIfPresent(params, key, value) {
    if (value === null || value === undefined || value === '') {
        return;
    }

    params.append(key, value);
}

function unwrapList(response) {
    const data = response?.result?.data ?? response?.data ?? response;

    return Array.isArray(data) ? data : [];
}

function enumName(value, names) {
    if (typeof value === 'string') {
        return value;
    }

    return names[value] ?? '-';
}

function formatDate(value) {
    if (!value) {
        return '-';
    }

    return new Date(value).toLocaleDateString('tr-TR');
}

function normalizeCampaign(campaign) {
    const discountType = campaign.discountType ?? campaign.DiscountType;
    const campaignScope = campaign.campaignScope ?? campaign.CampaignScope;

    return {
        id: campaign.id ?? campaign.Id,
        name: campaign.name ?? campaign.Name ?? '-',
        description: campaign.description ?? campaign.Description ?? '-',
        cpoName: campaign.cpoName ?? campaign.CpoName ?? '-',
        tenantId: campaign.tenantId ?? campaign.TenantId,
        campaignStart: formatDate(campaign.campaignStart ?? campaign.CampaignStart),
        campaignEnd: formatDate(campaign.campaignEnd ?? campaign.CampaignEnd),
        isActive: campaign.isActive ?? campaign.IsActive ?? false,
        discountType: enumName(discountType, { 1: 'Yüzde', 2: 'Sabit Tutar' }),
        discountValue: campaign.discountValue ?? campaign.DiscountValue,
        campaignScope: enumName(campaignScope, { 1: 'Genel', 2: 'CPO' })
    };
}

export const CampaignService = {
    async getCampaigns(filter = {}, pagination = { pageSize: 20, pageNumber: 1 }) {
        const params = new URLSearchParams();

        appendIfPresent(params, 'TenantId', filter.tenantId);
        appendIfPresent(params, 'Name', filter.name);
        appendIfPresent(params, 'IsActive', filter.isActive);
        appendIfPresent(params, 'DiscountType', filter.discountType);
        appendIfPresent(params, 'CampaignScope', filter.campaignScope);
        appendIfPresent(params, 'pageSize', pagination.pageSize);
        appendIfPresent(params, 'pageNumber', pagination.pageNumber);

        const query = params.toString();
        const response = await http.get(`/Campaign/filter${query ? `?${query}` : ''}`);

        return unwrapList(response).map(normalizeCampaign);
    }
};
