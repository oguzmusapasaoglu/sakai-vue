<script setup>
import { computed, onMounted, ref } from 'vue';
import { TariffService } from '@/service/TariffService';
import { CpoCompanyInfoService } from '@/service/CpoCompanyInfoService';

const tariffs = ref([]);
const cpos = ref([]);
const loading = ref(false);
const selectedCpo = ref(null);
const cpoSearch = ref('');
const filters = ref({
    powerType: null,
    currency: ''
});

const powerTypes = [
    { label: 'AC', value: 1 },
    { label: 'DC', value: 2 }
];

const filteredCpos = computed(() => {
    const search = cpoSearch.value.trim().toLowerCase();

    if (!search) {
        return cpos.value;
    }

    return cpos.value.filter((cpo) => cpo.companyName?.toLowerCase().includes(search));
});

onMounted(async () => {
    await Promise.all([loadCpos(), loadTariffs()]);
});

async function loadCpos() {
    try {
        cpos.value = await CpoCompanyInfoService.getCpos({}, { pageSize: 200, pageNumber: 1 });
    } catch (error) {
        console.error('Error loading CPOs:', error);
    }
}

async function loadTariffs() {
    loading.value = true;

    try {
        tariffs.value = await TariffService.getTariffs({
            tenantId: selectedCpo.value?.tenantId,
            powerType: filters.value.powerType,
            currency: filters.value.currency
        });
    } catch (error) {
        console.error('Error loading tariffs:', error);
    } finally {
        loading.value = false;
    }
}

function clearFilters() {
    selectedCpo.value = null;
    cpoSearch.value = '';
    filters.value = {
        powerType: null,
        currency: ''
    };
    loadTariffs();
}

function getStatusSeverity(status) {
    const severities = {
        Active: 'success',
        Passive: 'secondary',
        Suspended: 'danger'
    };

    return severities[status] ?? 'info';
}

function formatValue(value) {
    return value === null || value === undefined || value === '' ? '-' : value;
}
</script>

<template>
    <div class="card">
        <div class="flex flex-col gap-4 mb-4">
            <div class="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <span class="text-xl font-semibold">Tarifeler</span>
                <Button label="Yenile" icon="pi pi-refresh" text @click="loadTariffs" />
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4">
                <div>
                    <label class="block text-sm font-medium mb-2" for="cpoSearch">CPO Adı</label>
                    <InputText id="cpoSearch" v-model="cpoSearch" class="w-full" placeholder="CPO ara" />
                </div>
                <div>
                    <label class="block text-sm font-medium mb-2" for="cpoFilter">CPO</label>
                    <Select id="cpoFilter" v-model="selectedCpo" :options="filteredCpos" optionLabel="companyName" placeholder="CPO seçiniz" class="w-full" showClear />
                </div>
                <div>
                    <label class="block text-sm font-medium mb-2" for="powerType">Güç Tipi</label>
                    <Select id="powerType" v-model="filters.powerType" :options="powerTypes" optionLabel="label" optionValue="value" placeholder="Tip seçiniz" class="w-full" showClear />
                </div>
                <div>
                    <label class="block text-sm font-medium mb-2" for="currency">Para Birimi</label>
                    <InputText id="currency" v-model="filters.currency" class="w-full" placeholder="TRY" />
                </div>
                <div class="flex items-end gap-2">
                    <Button label="Ara" icon="pi pi-search" class="w-full" @click="loadTariffs" />
                    <Button icon="pi pi-times" severity="secondary" text rounded @click="clearFilters" />
                </div>
            </div>
        </div>

        <DataTable :value="tariffs" :loading="loading" paginator :rows="20" dataKey="id" removableSort responsiveLayout="scroll" class="tariff-table">
            <Column field="cpoName" header="CPO" sortable style="width: 18%" />
            <Column field="powerType" header="Güç" sortable style="width: 8%" />
            <Column field="pricePerKwh" header="kWh Fiyatı" sortable style="width: 13%" />
            <Column field="pricePerMinute" header="Dakika" sortable style="width: 12%" />
            <Column field="startFee" header="Başlangıç" sortable style="width: 12%" />
            <Column field="validFrom" header="Başlangıç Tarihi" sortable style="width: 13%" />
            <Column field="validTo" header="Bitiş Tarihi" sortable style="width: 12%" />
            <Column field="status" header="Durum" sortable style="width: 8%">
                <template #body="{ data }">
                    <Tag :value="data.status" :severity="getStatusSeverity(data.status)" />
                </template>
            </Column>
            <Column header="Detay" style="width: 4%">
                <template #body="{ data }">
                    <Button icon="pi pi-info-circle" text rounded :title="`İstasyon grubu: ${formatValue(data.stationGroupId)}`" />
                </template>
            </Column>
        </DataTable>
    </div>
</template>

<style scoped>
.tariff-table :deep(.p-datatable-table) {
    table-layout: fixed;
    width: 100%;
}

.tariff-table :deep(.p-datatable-tbody > tr > td),
.tariff-table :deep(.p-datatable-thead > tr > th) {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
</style>
