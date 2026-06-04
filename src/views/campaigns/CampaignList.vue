<script setup>
import { computed, onMounted, ref } from 'vue';
import { CampaignService } from '@/service/CampaignService';
import { CpoCompanyInfoService } from '@/service/CpoCompanyInfoService';

const campaigns = ref([]);
const cpos = ref([]);
const loading = ref(false);
const selectedCpo = ref(null);
const cpoSearch = ref('');
const filters = ref({
    name: '',
    isActive: null
});

const booleanOptions = [
    { label: 'Aktif', value: true },
    { label: 'Pasif', value: false }
];

const filteredCpos = computed(() => {
    const search = cpoSearch.value.trim().toLowerCase();

    if (!search) {
        return cpos.value;
    }

    return cpos.value.filter((cpo) => cpo.companyName?.toLowerCase().includes(search));
});

onMounted(async () => {
    await Promise.all([loadCpos(), loadCampaigns()]);
});

async function loadCpos() {
    try {
        cpos.value = await CpoCompanyInfoService.getCpos({}, { pageSize: 200, pageNumber: 1 });
    } catch (error) {
        console.error('Error loading CPOs:', error);
    }
}

async function loadCampaigns() {
    loading.value = true;

    try {
        campaigns.value = await CampaignService.getCampaigns({
            tenantId: selectedCpo.value?.tenantId,
            name: filters.value.name,
            isActive: filters.value.isActive
        });
    } catch (error) {
        console.error('Error loading campaigns:', error);
    } finally {
        loading.value = false;
    }
}

function clearFilters() {
    selectedCpo.value = null;
    cpoSearch.value = '';
    filters.value = {
        name: '',
        isActive: null
    };
    loadCampaigns();
}

function boolSeverity(value) {
    return value ? 'success' : 'secondary';
}
</script>

<template>
    <div class="card">
        <div class="flex flex-col gap-4 mb-4">
            <div class="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <span class="text-xl font-semibold">Kampanyalar</span>
                <Button label="Yenile" icon="pi pi-refresh" text @click="loadCampaigns" />
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4">
                <div>
                    <label class="block text-sm font-medium mb-2" for="campaignName">Kampanya Adı</label>
                    <InputText id="campaignName" v-model="filters.name" class="w-full" />
                </div>
                <div>
                    <label class="block text-sm font-medium mb-2" for="cpoSearch">CPO Adı</label>
                    <InputText id="cpoSearch" v-model="cpoSearch" class="w-full" placeholder="CPO ara" />
                </div>
                <div>
                    <label class="block text-sm font-medium mb-2" for="cpoFilter">CPO</label>
                    <Select id="cpoFilter" v-model="selectedCpo" :options="filteredCpos" optionLabel="companyName" placeholder="CPO seçiniz" class="w-full" showClear />
                </div>
                <div>
                    <label class="block text-sm font-medium mb-2" for="statusFilter">Durum</label>
                    <Select id="statusFilter" v-model="filters.isActive" :options="booleanOptions" optionLabel="label" optionValue="value" placeholder="Durum seçiniz" class="w-full" showClear />
                </div>
                <div class="flex items-end gap-2">
                    <Button label="Ara" icon="pi pi-search" class="w-full" @click="loadCampaigns" />
                    <Button icon="pi pi-times" severity="secondary" text rounded @click="clearFilters" />
                </div>
            </div>
        </div>

        <DataTable :value="campaigns" :loading="loading" paginator :rows="20" dataKey="id" removableSort responsiveLayout="scroll" class="campaign-table">
            <Column field="name" header="Kampanya" sortable style="width: 18%" />
            <Column field="cpoName" header="CPO" sortable style="width: 18%" />
            <Column field="discountType" header="İndirim Tipi" sortable style="width: 12%" />
            <Column field="discountValue" header="Değer" sortable style="width: 10%" />
            <Column field="campaignScope" header="Kapsam" sortable style="width: 10%" />
            <Column field="campaignStart" header="Başlangıç" sortable style="width: 12%" />
            <Column field="campaignEnd" header="Bitiş" sortable style="width: 12%" />
            <Column field="isActive" header="Durum" sortable style="width: 8%">
                <template #body="{ data }">
                    <Tag :value="data.isActive ? 'Aktif' : 'Pasif'" :severity="boolSeverity(data.isActive)" />
                </template>
            </Column>
        </DataTable>
    </div>
</template>

<style scoped>
.campaign-table :deep(.p-datatable-table) {
    table-layout: fixed;
    width: 100%;
}

.campaign-table :deep(.p-datatable-tbody > tr > td),
.campaign-table :deep(.p-datatable-thead > tr > th) {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
</style>
