<script setup>
import { ref, onMounted } from 'vue';
import { SystemPageService } from '@/service/SystemPageService';

const pages = ref([]);
const loading = ref(false);
const showDialog = ref(false);
const showContentDialog = ref(false);
const editingId = ref(null);
const selectedPage = ref(null);
const formData = ref({});

onMounted(async () => {
    await loadPages();
});

async function loadPages() {
    loading.value = true;
    try {
        pages.value = await SystemPageService.getSystemPages();
    } catch (error) {
        console.error('Error loading system pages:', error);
    } finally {
        loading.value = false;
    }
}

function getStatusSeverity(status) {
    const severities = {
        'Published': 'success',
        'Draft': 'warn',
        'Archived': 'danger'
    };
    return severities[status] || 'info';
}

function getActiveColor(isActive) {
    return isActive ? 'success' : 'danger';
}

function openNew() {
    editingId.value = null;
    formData.value = {};
    showDialog.value = true;
}

function editPage(page) {
    editingId.value = page.id;
    formData.value = { ...page };
    showDialog.value = true;
}

function viewContent(page) {
    selectedPage.value = page;
    showContentDialog.value = true;
}

async function savePage() {
    if (editingId.value) {
        await SystemPageService.updateSystemPage(editingId.value, formData.value);
    } else {
        await SystemPageService.createSystemPage(formData.value);
    }
    showDialog.value = false;
    await loadPages();
}

async function publishPage(id) {
    if (confirm('Sayfayı yayınlamak istiyor musunuz?')) {
        await SystemPageService.publishPage(id);
        await loadPages();
    }
}

async function deletePage(id) {
    if (confirm('Sayfayı silmek istiyor musunuz?')) {
        await SystemPageService.deleteSystemPage(id);
        await loadPages();
    }
}
</script>

<template>
    <div class="card">
        <DataTable :value="pages" :loading="loading" paginator :rows="20" dataKey="id" filterDisplay="menu">
            <template #header>
                <div class="flex justify-between items-center gap-4">
                    <span class="text-xl font-semibold">Sistem Sayfaları</span>
                    <Button label="Yeni Sayfa" icon="pi pi-plus" @click="openNew" />
                </div>
            </template>

            <Column field="title" header="Başlık" sortable style="width: 20%" />
            <Column field="slug" header="URL Slug" sortable style="width: 16%" />
            <Column field="group" header="Grup" sortable style="width: 12%" />
            <Column field="status" header="Durum" sortable style="width: 12%">
                <template #body="{ data }">
                    <Tag :value="data.status" :severity="getStatusSeverity(data.status)" />
                </template>
            </Column>
            <Column field="viewCount" header="Görüntülemeler" sortable style="width: 10%" />
            <Column header="Aktif" style="width: 8%">
                <template #body="{ data }">
                    <Tag :value="data.isActive ? 'Evet' : 'Hayır'" :severity="getActiveColor(data.isActive)" />
                </template>
            </Column>
            <Column field="lastModified" header="Güncelleme" sortable style="width: 12%" />
            <Column header="İşlemler" style="width: 10%">
                <template #body="{ data }">
                    <Button icon="pi pi-eye" text rounded class="mr-2" @click="viewContent(data)" title="İçeriği Görüntüle" />
                    <Button icon="pi pi-pencil" text rounded class="mr-2" @click="editPage(data)" title="Düzenle" />
                    <Button icon="pi pi-trash" text rounded severity="danger" @click="deletePage(data.id)" title="Sil" />
                </template>
            </Column>
        </DataTable>
    </div>

    <!-- Dialog için sayfa oluştur/düzenle -->
    <Dialog v-model:visible="showDialog" :header="editingId ? 'Sayfayı Düzenle' : 'Yeni Sayfa'" modal size="large">
        <div class="grid grid-cols-1 gap-4 mb-4">
            <div>
                <label class="block text-sm font-medium mb-2">Başlık</label>
                <InputText v-model="formData.title" class="w-full" />
            </div>
            <div>
                <label class="block text-sm font-medium mb-2">URL Slug</label>
                <InputText v-model="formData.slug" class="w-full" />
            </div>
            <div class="grid grid-cols-2 gap-4">
                <div>
                    <label class="block text-sm font-medium mb-2">Grup</label>
                    <Dropdown v-model="formData.group" :options="['Legal', 'Help', 'Info']" class="w-full" />
                </div>
                <div>
                    <label class="block text-sm font-medium mb-2">Durum</label>
                    <Dropdown v-model="formData.status" :options="['Published', 'Draft', 'Archived']" class="w-full" />
                </div>
            </div>
            <div>
                <label class="block text-sm font-medium mb-2">Açıklama</label>
                <Textarea v-model="formData.description" class="w-full" rows="4" />
            </div>
        </div>
        <template #footer>
            <Button label="İptal" icon="pi pi-times" @click="showDialog = false" class="p-button-text" />
            <Button label="Kaydet" icon="pi pi-check" @click="savePage" />
        </template>
    </Dialog>

    <!-- İçeriği görüntüle dialog -->
    <Dialog v-model:visible="showContentDialog" :header="selectedPage?.title" modal size="large">
        <div v-if="selectedPage" class="grid grid-cols-1 gap-4">
            <div>
                <p class="text-sm text-muted-color mb-2"><strong>URL:</strong> {{ selectedPage.slug }}</p>
                <p class="text-sm text-muted-color mb-2"><strong>Grup:</strong> {{ selectedPage.group }}</p>
                <p class="text-sm text-muted-color mb-2"><strong>Durum:</strong> {{ selectedPage.status }}</p>
                <p class="text-sm text-muted-color"><strong>Görüntülemeler:</strong> {{ selectedPage.viewCount }}</p>
            </div>
            <div>
                <p class="text-sm font-medium mb-2">İçerik:</p>
                <p class="text-sm">{{ selectedPage.description }}</p>
            </div>
        </div>
        <template #footer>
            <Button label="Kapat" icon="pi pi-times" @click="showContentDialog = false" class="p-button-text" />
        </template>
    </Dialog>
</template>
