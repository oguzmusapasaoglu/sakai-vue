<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { CpoCompanyInfoService } from '@/service/CpoCompanyInfoService';

const router = useRouter();

const cpos = ref([]);
const loading = ref(false);
const viewLoading = ref(false);
const selectedCpo = ref(null);
const detailDialogVisible = ref(false);
const detailTab = ref('0');
const filterPanelOpen = ref('0');
const filters = ref({
    cpoCode: '',
    companyName: '',
    officialEmail: '',
    isPublicVisible: null
});

const visibilityOptions = [
    { label: 'Tümü', value: null },
    { label: 'Görünür', value: true },
    { label: 'Gizli', value: false }
];

const fallbackCpos = [
    {
        id: '1',
        cpoCode: 'ABC',
        companyName: 'ABC Elektrik Şarj',
        legalCompanyName: 'ABC Elektrik Şarj A.Ş.',
        officialEmail: 'info@abc-charge.com',
        officialPhone: '+90 212 555 0001',
        website: 'https://abc-charge.com',
        isPublicVisible: true
    },
    {
        id: '2',
        cpoCode: 'HIZLI',
        companyName: 'Hızlı Şarj Ltd.',
        legalCompanyName: 'Hızlı Şarj Teknoloji Ltd. Şti.',
        officialEmail: 'contact@hizli-sarja.com',
        officialPhone: '+90 216 555 0002',
        website: 'https://hizli-sarja.com',
        isPublicVisible: true
    },
    {
        id: '3',
        cpoCode: 'YESIL',
        companyName: 'Yeşil Enerji Ağı',
        legalCompanyName: 'Yeşil Enerji Ağı A.Ş.',
        officialEmail: 'support@yesilenerji.com',
        officialPhone: '+90 232 555 0003',
        website: 'https://yesilenerji.com',
        isPublicVisible: false
    }
];

onMounted(async () => {
    await loadCpos();
});

async function loadCpos() {
    loading.value = true;

    try {
        cpos.value = await CpoCompanyInfoService.getCpos(filters.value, { pageSize: 50, pageNumber: 1 });
    } catch (error) {
        console.error('Error loading CPO list:', error);
        cpos.value = filterFallbackCpos();
    } finally {
        loading.value = false;
    }
}

function filterFallbackCpos() {
    const currentFilters = filters.value;

    return fallbackCpos.filter((cpo) => {
        const matchesCode = !currentFilters.cpoCode || cpo.cpoCode?.toLowerCase().includes(currentFilters.cpoCode.toLowerCase());
        const matchesName = !currentFilters.companyName || cpo.companyName?.toLowerCase().includes(currentFilters.companyName.toLowerCase());
        const matchesEmail = !currentFilters.officialEmail || cpo.officialEmail?.toLowerCase().includes(currentFilters.officialEmail.toLowerCase());
        const matchesVisibility = currentFilters.isPublicVisible === null || cpo.isPublicVisible === currentFilters.isPublicVisible;

        return matchesCode && matchesName && matchesEmail && matchesVisibility;
    });
}

function clearFilters() {
    filters.value = {
        cpoCode: '',
        companyName: '',
        officialEmail: '',
        isPublicVisible: null
    };

    loadCpos();
}

function newCpo() {
    router.push({ name: 'cpoNew' });
}

async function viewCpo(cpo) {
    selectedCpo.value = cpo;
    detailDialogVisible.value = true;
    detailTab.value = '0';
    viewLoading.value = true;

    try {
        selectedCpo.value = await CpoCompanyInfoService.getCpoById(cpo.id);
    } catch (error) {
        console.error('Error loading CPO detail:', error);
    } finally {
        viewLoading.value = false;
    }
}

function editCpo(cpo) {
    router.push({
        name: 'cpoEdit',
        params: { id: cpo.id }
    });
}

function getVisibilityLabel(value) {
    return value ? 'Görünür' : 'Gizli';
}

function getVisibilitySeverity(value) {
    return value ? 'success' : 'secondary';
}

function boolLabel(value) {
    return value ? 'Evet' : 'Hayır';
}

function formatValue(value) {
    return value === null || value === undefined || value === '' ? '-' : value;
}
</script>

<template>
    <div class="cpo-page">
        <div class="card">
            <Accordion v-model:value="filterPanelOpen" class="mb-4">
                <AccordionPanel value="0">
                    <AccordionHeader>
                        <div class="flex items-center gap-2">
                            <i class="pi pi-filter"></i>
                            <span>CPO Arama</span>
                        </div>
                    </AccordionHeader>
                    <AccordionContent>
                        <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 pt-2">
                            <div>
                                <label class="block text-sm font-medium mb-2" for="cpoCode">CPO Kodu</label>
                                <InputText id="cpoCode" v-model="filters.cpoCode" class="w-full" />
                            </div>
                            <div>
                                <label class="block text-sm font-medium mb-2" for="companyName">Şirket Adı</label>
                                <InputText id="companyName" v-model="filters.companyName" class="w-full" />
                            </div>
                            <div>
                                <label class="block text-sm font-medium mb-2" for="officialEmail">Resmi E-posta</label>
                                <InputText id="officialEmail" v-model="filters.officialEmail" class="w-full" />
                            </div>
                            <div>
                                <label class="block text-sm font-medium mb-2" for="isPublicVisible">Görünürlük</label>
                                <Select
                                    id="isPublicVisible"
                                    v-model="filters.isPublicVisible"
                                    :options="visibilityOptions"
                                    optionLabel="label"
                                    optionValue="value"
                                    class="w-full"
                                />
                            </div>
                        </div>
                        <div class="flex justify-end gap-2 mt-4">
                            <Button label="Temizle" icon="pi pi-times" severity="secondary" text @click="clearFilters" />
                            <Button label="Ara" icon="pi pi-search" @click="loadCpos" />
                        </div>
                    </AccordionContent>
                </AccordionPanel>
            </Accordion>

            <DataTable
                :value="cpos"
                :loading="loading"
                dataKey="id"
                paginator
                :rows="10"
                :rowsPerPageOptions="[10, 20, 50]"
                removableSort
                responsiveLayout="scroll"
                class="cpo-table"
            >
                <template #header>
                    <div class="flex flex-col md:flex-row md:items-center justify-between gap-3">
                        <span class="text-xl font-semibold">CPO (Şarj Operatörleri Listesi</span>
                        <Button label="Yeni CPO" icon="pi pi-plus" @click="newCpo" />
                    </div>
                </template>

                <Column field="cpoCode" header="CPO Kodu" sortable style="width: 10%" />
                <Column field="companyName" header="Şirket Adı" sortable style="width: 21%" />
                <Column field="legalCompanyName" header="Ticari Unvan" sortable style="width: 21%" />
                <Column field="officialEmail" header="Resmi E-posta" sortable style="width: 18%" />
                <Column field="officialPhone" header="Telefon" sortable style="width: 12%" />
                <Column field="isPublicVisible" header="Görünürlük" sortable style="width: 9%">
                    <template #body="{ data }">
                        <Tag :value="getVisibilityLabel(data.isPublicVisible)" :severity="getVisibilitySeverity(data.isPublicVisible)" />
                    </template>
                </Column>
                <Column header="İşlem" style="width: 9%">
                    <template #body="{ data }">
                        <Button icon="pi pi-eye" text rounded title="Görüntüle" class="mr-2" @click.stop="viewCpo(data)" />
                        <Button icon="pi pi-pencil" text rounded severity="success" title="Düzenle" @click.stop="editCpo(data)" />
                    </template>
                </Column>
            </DataTable>
        </div>

        <Dialog v-model:visible="detailDialogVisible" modal maximizable :style="{ width: 'min(1100px, 95vw)' }">
            <template #header>
                <div class="flex items-center gap-2">
                    <i class="pi pi-building"></i>
                    <span>{{ selectedCpo?.companyName ?? 'CPO Detay' }}</span>
                </div>
            </template>

            <div v-if="viewLoading" class="py-8 text-center text-gray-500">Yükleniyor...</div>

            <Tabs v-else v-model:value="detailTab">
                <TabList>
                    <Tab value="0">Şirket Bilgisi</Tab>
                    <Tab value="1">Şirket Profili</Tab>
                    <Tab value="2">Kayıtlı Adres</Tab>
                    <Tab value="3">Destek</Tab>
                    <Tab value="4">Temsilciler</Tab>
                    <Tab value="5">Dokümanlar</Tab>
                    <Tab value="6">Doğrulama</Tab>
                </TabList>
                <TabPanels>
                    <TabPanel value="0">
                        <div class="detail-grid">
                            <div><span>CPO Kodu</span><strong>{{ formatValue(selectedCpo?.cpoCode) }}</strong></div>
                            <div><span>Şirket Adı</span><strong>{{ formatValue(selectedCpo?.companyName) }}</strong></div>
                            <div><span>Ticari Unvan</span><strong>{{ formatValue(selectedCpo?.legalCompanyName) }}</strong></div>
                            <div><span>Web Sitesi</span><strong>{{ formatValue(selectedCpo?.website) }}</strong></div>
                            <div><span>Resmi E-posta</span><strong>{{ formatValue(selectedCpo?.officialEmail) }}</strong></div>
                            <div><span>Resmi Telefon</span><strong>{{ formatValue(selectedCpo?.officialPhone) }}</strong></div>
                            <div><span>Public Slug</span><strong>{{ formatValue(selectedCpo?.publicSlug) }}</strong></div>
                            <div>
                                <span>Görünürlük</span>
                                <Tag :value="getVisibilityLabel(selectedCpo?.isPublicVisible)" :severity="getVisibilitySeverity(selectedCpo?.isPublicVisible)" />
                            </div>
                        </div>
                    </TabPanel>
                    <TabPanel value="1">
                        <div class="detail-grid">
                            <div><span>Vergi No</span><strong>{{ formatValue(selectedCpo?.companyProfile?.taxNumber) }}</strong></div>
                            <div><span>Vergi Dairesi</span><strong>{{ formatValue(selectedCpo?.companyProfile?.taxOffice) }}</strong></div>
                            <div><span>MERSİS No</span><strong>{{ formatValue(selectedCpo?.companyProfile?.mersisNumber) }}</strong></div>
                            <div><span>Ticaret Sicil No</span><strong>{{ formatValue(selectedCpo?.companyProfile?.tradeRegistryNumber) }}</strong></div>
                            <div><span>Logo</span><strong>{{ formatValue(selectedCpo?.companyProfile?.logoFile) }}</strong></div>
                            <div><span>Banner</span><strong>{{ formatValue(selectedCpo?.companyProfile?.bannerFile) }}</strong></div>
                            <div class="md:col-span-2 xl:col-span-3"><span>Hakkında</span><strong>{{ formatValue(selectedCpo?.companyProfile?.about) }}</strong></div>
                        </div>
                    </TabPanel>
                    <TabPanel value="2">
                        <div class="detail-grid">
                            <div><span>Ülke Kodu</span><strong>{{ formatValue(selectedCpo?.registeredAddress?.countryCode) }}</strong></div>
                            <div><span>Şehir</span><strong>{{ formatValue(selectedCpo?.registeredAddress?.city) }}</strong></div>
                            <div><span>İlçe</span><strong>{{ formatValue(selectedCpo?.registeredAddress?.district) }}</strong></div>
                            <div><span>Adres 1</span><strong>{{ formatValue(selectedCpo?.registeredAddress?.addressLine1) }}</strong></div>
                            <div><span>Adres 2</span><strong>{{ formatValue(selectedCpo?.registeredAddress?.addressLine2) }}</strong></div>
                            <div><span>Posta Kodu</span><strong>{{ formatValue(selectedCpo?.registeredAddress?.postalCode) }}</strong></div>
                            <div><span>Enlem</span><strong>{{ formatValue(selectedCpo?.registeredAddress?.latitude) }}</strong></div>
                            <div><span>Boylam</span><strong>{{ formatValue(selectedCpo?.registeredAddress?.longitude) }}</strong></div>
                        </div>
                    </TabPanel>
                    <TabPanel value="3">
                        <div class="detail-grid mb-4">
                            <div><span>Destek E-posta</span><strong>{{ formatValue(selectedCpo?.supportProfile?.supportEmail) }}</strong></div>
                            <div><span>Destek Telefon</span><strong>{{ formatValue(selectedCpo?.supportProfile?.supportPhone) }}</strong></div>
                            <div><span>Acil Telefon</span><strong>{{ formatValue(selectedCpo?.supportProfile?.emergencyPhone) }}</strong></div>
                            <div><span>Çalışma Saatleri</span><strong>{{ formatValue(selectedCpo?.supportProfile?.workingHours) }}</strong></div>
                            <div><span>Zaman Dilimi</span><strong>{{ formatValue(selectedCpo?.supportProfile?.timeZone) }}</strong></div>
                            <div><span>7/24 Destek</span><strong>{{ boolLabel(selectedCpo?.supportProfile?.has24x7Support) }}</strong></div>
                            <div><span>Çağrı Merkezi</span><strong>{{ boolLabel(selectedCpo?.supportProfile?.hasOwnCallCenter) }}</strong></div>
                            <div><span>Ticket Sistemi</span><strong>{{ boolLabel(selectedCpo?.supportProfile?.hasTicketingSystem) }}</strong></div>
                        </div>
                        <DataTable :value="selectedCpo?.supportProfile?.supportedLanguages ?? []" responsiveLayout="scroll">
                            <Column field="languageCode" header="Dil Kodu" />
                            <Column field="languageName" header="Dil" />
                            <Column field="isDefault" header="Varsayılan">
                                <template #body="{ data }">{{ boolLabel(data.isDefault) }}</template>
                            </Column>
                        </DataTable>
                    </TabPanel>
                    <TabPanel value="4">
                        <DataTable :value="selectedCpo?.representatives ?? []" responsiveLayout="scroll">
                            <Column field="fullName" header="Ad Soyad" />
                            <Column field="title" header="Unvan" />
                            <Column field="email" header="E-posta" />
                            <Column field="phone" header="Telefon" />
                            <Column field="representativeType" header="Tip" />
                            <Column field="isPrimary" header="Birincil">
                                <template #body="{ data }">{{ boolLabel(data.isPrimary) }}</template>
                            </Column>
                        </DataTable>
                    </TabPanel>
                    <TabPanel value="5">
                        <DataTable :value="selectedCpo?.documents ?? []" responsiveLayout="scroll">
                            <Column field="documentName" header="Doküman" />
                            <Column field="documentType" header="Tip" />
                            <Column field="fileName" header="Dosya" />
                            <Column field="documentNumber" header="No" />
                            <Column field="issueDate" header="Düzenleme" />
                            <Column field="expiryDate" header="Bitiş" />
                            <Column field="isVerified" header="Onay">
                                <template #body="{ data }">{{ boolLabel(data.isVerified) }}</template>
                            </Column>
                        </DataTable>
                    </TabPanel>
                    <TabPanel value="6">
                        <div class="detail-grid">
                            <div><span>Durum</span><strong>{{ formatValue(selectedCpo?.verification?.verificationStatus) }}</strong></div>
                            <div><span>Gönderim</span><strong>{{ formatValue(selectedCpo?.verification?.submittedAt) }}</strong></div>
                            <div><span>İnceleme</span><strong>{{ formatValue(selectedCpo?.verification?.reviewedAt) }}</strong></div>
                            <div><span>Doğrulama</span><strong>{{ formatValue(selectedCpo?.verification?.verifiedAt) }}</strong></div>
                            <div class="md:col-span-2 xl:col-span-3"><span>Red Nedeni</span><strong>{{ formatValue(selectedCpo?.verification?.rejectedReason) }}</strong></div>
                            <div class="md:col-span-2 xl:col-span-3"><span>İnceleyen Notu</span><strong>{{ formatValue(selectedCpo?.verification?.reviewerNotes) }}</strong></div>
                        </div>
                    </TabPanel>
                </TabPanels>
            </Tabs>
        </Dialog>
    </div>
</template>

<style scoped>
.cpo-page {
    width: 100%;
}

.cpo-table :deep(.p-datatable-table) {
    table-layout: fixed;
    width: 100%;
}

.cpo-table :deep(.p-datatable-tbody > tr > td),
.cpo-table :deep(.p-datatable-thead > tr > th) {
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
    min-width: 0;
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

@media (min-width: 1280px) {
    .detail-grid {
        grid-template-columns: repeat(3, minmax(0, 1fr));
    }
}
</style>
