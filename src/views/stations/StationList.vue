<script setup>
import { computed, ref } from 'vue';

const selectedCpo = ref(null);
const groupSearch = ref('');
const detailDialogVisible = ref(false);
const selectedGroup = ref(null);

const cpos = [
    { id: 'cpo-1', name: 'ABC Elektrik Şarj' },
    { id: 'cpo-2', name: 'Hızlı Şarj Ltd.' },
    { id: 'cpo-3', name: 'Yeşil Enerji Ağı' }
];

const stationGroups = ref([
    {
        id: 'grp-1',
        cpoId: 'cpo-1',
        name: 'İstanbul Avrupa Grubu',
        city: 'İstanbul',
        region: 'Avrupa',
        status: 'Active',
        stationCount: 1,
        connectorCount: 2,
        stations: [
            {
                id: 'ST-1001',
                name: 'PlugHub Maslak',
                address: 'Maslak Mah. Büyükdere Cad. No: 245, Sarıyer / İstanbul',
                status: 'Active',
                connectors: [
                    { id: 'CONN-1001', type: 'Type 2', power: '11 kW', status: 'Active' },
                    { id: 'CONN-1002', type: 'Type 2', power: '7 kW', status: 'Active' }
                ]
            }
        ]
    },
    {
        id: 'grp-2',
        cpoId: 'cpo-1',
        name: 'İstanbul Anadolu Grubu',
        city: 'İstanbul',
        region: 'Anadolu',
        status: 'Active',
        stationCount: 1,
        connectorCount: 2,
        stations: [
            {
                id: 'ST-1002',
                name: 'PlugHub Kadıköy Marina',
                address: 'Caferağa Mah. Moda Cad. No: 12, Kadıköy / İstanbul',
                status: 'Active',
                connectors: [
                    { id: 'CONN-1003', type: 'CCS', power: '50 kW', status: 'Maintenance' },
                    { id: 'CONN-1004', type: 'Type 2', power: '11 kW', status: 'Active' }
                ]
            }
        ]
    },
    {
        id: 'grp-3',
        cpoId: 'cpo-2',
        name: 'Ege Bölge Grubu',
        city: 'İzmir',
        region: 'Ege',
        status: 'Active',
        stationCount: 1,
        connectorCount: 1,
        stations: [
            {
                id: 'ST-1004',
                name: 'PlugHub İzmir Alsancak',
                address: 'Alsancak Mah. Cumhuriyet Bulvarı No: 88, Konak / İzmir',
                status: 'Active',
                connectors: [{ id: 'CONN-1006', type: 'CCS', power: '50 kW', status: 'Active' }]
            }
        ]
    },
    {
        id: 'grp-4',
        cpoId: 'cpo-3',
        name: 'Ankara Merkez Grubu',
        city: 'Ankara',
        region: 'İç Anadolu',
        status: 'Passive',
        stationCount: 1,
        connectorCount: 1,
        stations: [
            {
                id: 'ST-1003',
                name: 'PlugHub Ankara Çankaya',
                address: 'Mustafa Kemal Mah. 2118. Cad. No: 4, Çankaya / Ankara',
                status: 'Passive',
                connectors: [{ id: 'CONN-1005', type: 'Type 2', power: '7 kW', status: 'Passive' }]
            }
        ]
    }
]);

const filteredGroups = computed(() => {
    const search = groupSearch.value.trim().toLowerCase();

    return stationGroups.value.filter((group) => {
        const matchesCpo = !selectedCpo.value || group.cpoId === selectedCpo.value.id;
        const matchesSearch = !search || group.name.toLowerCase().includes(search) || group.city.toLowerCase().includes(search) || group.region.toLowerCase().includes(search);

        return matchesCpo && matchesSearch;
    });
});

function clearFilters() {
    selectedCpo.value = null;
    groupSearch.value = '';
}

function viewGroup(group) {
    selectedGroup.value = group;
    detailDialogVisible.value = true;
}

function getStatusSeverity(status) {
    if (status === 'Active') {
        return 'success';
    }

    if (status === 'Maintenance') {
        return 'warn';
    }

    return 'danger';
}
</script>

<template>
    <div class="card">
        <div class="flex flex-col gap-4 mb-4">
            <div class="flex items-center justify-between gap-4">
                <span class="text-xl font-semibold">İstasyon Grupları</span>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <label class="block text-sm font-medium mb-2" for="cpoFilter">CPO</label>
                    <Select id="cpoFilter" v-model="selectedCpo" :options="cpos" optionLabel="name" placeholder="CPO seçiniz" class="w-full" showClear />
                </div>
                <div>
                    <label class="block text-sm font-medium mb-2" for="groupSearch">Grup Arama</label>
                    <InputText id="groupSearch" v-model="groupSearch" class="w-full" placeholder="Grup, şehir veya bölge" />
                </div>
                <div class="flex items-end">
                    <Button label="Temizle" icon="pi pi-times" severity="secondary" text class="w-full md:w-auto" @click="clearFilters" />
                </div>
            </div>
        </div>

        <DataTable :value="filteredGroups" paginator :rows="20" dataKey="id" removableSort responsiveLayout="scroll" class="group-table">
            <Column field="name" header="Grup Adı" sortable style="width: 26%" />
            <Column field="city" header="Şehir" sortable style="width: 14%" />
            <Column field="region" header="Bölge" sortable style="width: 16%" />
            <Column field="stationCount" header="İstasyon" sortable style="width: 12%" />
            <Column field="connectorCount" header="Konnektör" sortable style="width: 12%" />
            <Column field="status" header="Durum" sortable style="width: 12%">
                <template #body="{ data }">
                    <Tag :value="data.status" :severity="getStatusSeverity(data.status)" />
                </template>
            </Column>
            <Column header="Detay" style="width: 8%">
                <template #body="{ data }">
                    <Button icon="pi pi-eye" text rounded title="Detay" @click="viewGroup(data)" />
                </template>
            </Column>
        </DataTable>

        <Dialog v-model:visible="detailDialogVisible" modal maximizable :style="{ width: 'min(1000px, 95vw)' }">
            <template #header>
                <div class="flex items-center gap-2">
                    <i class="pi pi-map"></i>
                    <span>{{ selectedGroup?.name ?? 'İstasyon Grubu Detayı' }}</span>
                </div>
            </template>

            <DataTable :value="selectedGroup?.stations ?? []" dataKey="id" responsiveLayout="scroll" class="mb-4">
                <Column field="id" header="İstasyon ID" style="width: 14%" />
                <Column field="name" header="İstasyon" style="width: 24%" />
                <Column field="address" header="Adres" style="width: 42%" />
                <Column field="status" header="Durum" style="width: 12%">
                    <template #body="{ data }">
                        <Tag :value="data.status" :severity="getStatusSeverity(data.status)" />
                    </template>
                </Column>
            </DataTable>

            <div class="text-lg font-semibold mb-3">Konnektörler</div>
            <DataTable :value="(selectedGroup?.stations ?? []).flatMap((station) => station.connectors.map((connector) => ({ ...connector, stationName: station.name })))" dataKey="id" responsiveLayout="scroll">
                <Column field="id" header="Konnektör ID" />
                <Column field="stationName" header="İstasyon" />
                <Column field="type" header="Tip" />
                <Column field="power" header="Güç" />
                <Column field="status" header="Durum">
                    <template #body="{ data }">
                        <Tag :value="data.status" :severity="getStatusSeverity(data.status)" />
                    </template>
                </Column>
            </DataTable>
        </Dialog>
    </div>
</template>

<style scoped>
.group-table :deep(.p-datatable-table) {
    table-layout: fixed;
    width: 100%;
}

.group-table :deep(.p-datatable-tbody > tr > td),
.group-table :deep(.p-datatable-thead > tr > th) {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
</style>
