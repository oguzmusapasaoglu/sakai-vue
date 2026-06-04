<script setup>
import { onMounted, ref } from 'vue';
import { CustomerAccountService } from '@/service/CustomerAccountService';

const customers = ref([]);
const loading = ref(false);
const detailVisible = ref(false);
const selectedCustomer = ref(null);
const filters = ref({
    fullName: '',
    email: '',
    isEmailVerified: null,
    isTwoFactorEnabled: null
});

const booleanOptions = [
    { label: 'Evet', value: true },
    { label: 'Hayır', value: false }
];

onMounted(async () => {
    await loadCustomers();
});

async function loadCustomers() {
    loading.value = true;

    try {
        customers.value = await CustomerAccountService.getCustomers(filters.value);
    } catch (error) {
        console.error('Error loading customers:', error);
    } finally {
        loading.value = false;
    }
}

function clearFilters() {
    filters.value = {
        fullName: '',
        email: '',
        isEmailVerified: null,
        isTwoFactorEnabled: null
    };
    loadCustomers();
}

function viewCustomer(customer) {
    selectedCustomer.value = customer;
    detailVisible.value = true;
}

function boolLabel(value) {
    return value ? 'Evet' : 'Hayır';
}

function boolSeverity(value) {
    return value ? 'success' : 'secondary';
}

function statusSeverity(status) {
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
                <span class="text-xl font-semibold">Müşteriler</span>
                <Button label="Yenile" icon="pi pi-refresh" text @click="loadCustomers" />
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4">
                <div>
                    <label class="block text-sm font-medium mb-2" for="fullName">Ad Soyad</label>
                    <InputText id="fullName" v-model="filters.fullName" class="w-full" />
                </div>
                <div>
                    <label class="block text-sm font-medium mb-2" for="email">E-posta</label>
                    <InputText id="email" v-model="filters.email" class="w-full" />
                </div>
                <div>
                    <label class="block text-sm font-medium mb-2" for="emailVerified">E-posta Doğrulandı</label>
                    <Select id="emailVerified" v-model="filters.isEmailVerified" :options="booleanOptions" optionLabel="label" optionValue="value" showClear class="w-full" />
                </div>
                <div>
                    <label class="block text-sm font-medium mb-2" for="twoFactor">2FA</label>
                    <Select id="twoFactor" v-model="filters.isTwoFactorEnabled" :options="booleanOptions" optionLabel="label" optionValue="value" showClear class="w-full" />
                </div>
                <div class="flex items-end gap-2">
                    <Button label="Ara" icon="pi pi-search" class="w-full" @click="loadCustomers" />
                    <Button icon="pi pi-times" severity="secondary" text rounded @click="clearFilters" />
                </div>
            </div>
        </div>

        <DataTable :value="customers" :loading="loading" paginator :rows="20" dataKey="id" removableSort responsiveLayout="scroll" class="customer-table">
            <Column field="fullName" header="Ad Soyad" sortable style="width: 18%" />
            <Column field="email" header="E-posta" sortable style="width: 22%" />
            <Column field="phone" header="Telefon" sortable style="width: 13%" />
            <Column field="corporateAccountId" header="Kurumsal Hesap" sortable style="width: 15%">
                <template #body="{ data }">
                    {{ formatValue(data.corporateAccountId) }}
                </template>
            </Column>
            <Column field="isEmailVerified" header="E-posta" style="width: 9%">
                <template #body="{ data }">
                    <Tag :value="boolLabel(data.isEmailVerified)" :severity="boolSeverity(data.isEmailVerified)" />
                </template>
            </Column>
            <Column field="isTwoFactorEnabled" header="2FA" style="width: 7%">
                <template #body="{ data }">
                    <Tag :value="boolLabel(data.isTwoFactorEnabled)" :severity="boolSeverity(data.isTwoFactorEnabled)" />
                </template>
            </Column>
            <Column field="status" header="Durum" sortable style="width: 8%">
                <template #body="{ data }">
                    <Tag :value="data.status" :severity="statusSeverity(data.status)" />
                </template>
            </Column>
            <Column header="İşlemler" style="width: 8%">
                <template #body="{ data }">
                    <Button icon="pi pi-eye" text rounded title="Görüntüle" @click="viewCustomer(data)" />
                    <Button icon="pi pi-ban" text rounded severity="secondary" disabled title="Kara liste fonksiyonu eklenecek" />
                </template>
            </Column>
        </DataTable>

        <Dialog v-model:visible="detailVisible" modal header="Müşteri Detayı" :style="{ width: 'min(760px, 95vw)' }">
            <div v-if="selectedCustomer" class="detail-grid">
                <div><span>Müşteri ID</span><strong>{{ formatValue(selectedCustomer.id) }}</strong></div>
                <div><span>Ad Soyad</span><strong>{{ formatValue(selectedCustomer.fullName) }}</strong></div>
                <div><span>E-posta</span><strong>{{ formatValue(selectedCustomer.email) }}</strong></div>
                <div><span>Telefon</span><strong>{{ formatValue(selectedCustomer.phone) }}</strong></div>
                <div><span>Kurumsal Hesap</span><strong>{{ formatValue(selectedCustomer.corporateAccountId) }}</strong></div>
                <div><span>Dil</span><strong>{{ formatValue(selectedCustomer.preferredLanguage) }}</strong></div>
                <div><span>E-posta Doğrulandı</span><Tag :value="boolLabel(selectedCustomer.isEmailVerified)" :severity="boolSeverity(selectedCustomer.isEmailVerified)" /></div>
                <div><span>2FA</span><Tag :value="boolLabel(selectedCustomer.isTwoFactorEnabled)" :severity="boolSeverity(selectedCustomer.isTwoFactorEnabled)" /></div>
                <div><span>Durum</span><Tag :value="selectedCustomer.status" :severity="statusSeverity(selectedCustomer.status)" /></div>
                <div><span>Kara Liste</span><Tag value="Fonksiyon eklenecek" severity="secondary" /></div>
            </div>
        </Dialog>
    </div>
</template>

<style scoped>
.customer-table :deep(.p-datatable-table) {
    table-layout: fixed;
    width: 100%;
}

.customer-table :deep(.p-datatable-tbody > tr > td),
.customer-table :deep(.p-datatable-thead > tr > th) {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.detail-grid {
    display: grid;
    grid-template-columns: repeat(1, minmax(0, 1fr));
    gap: 1rem;
}

.detail-grid > div {
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
}

.detail-grid span {
    color: var(--text-color-secondary);
    font-size: 0.875rem;
}

.detail-grid strong {
    font-weight: 600;
    overflow-wrap: anywhere;
}

@media (min-width: 768px) {
    .detail-grid {
        grid-template-columns: repeat(2, minmax(0, 1fr));
    }
}
</style>
