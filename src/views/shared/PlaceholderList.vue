<script setup>
defineProps({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        default: 'API bağlantıları eklendiğinde bu ekran gerçek verilerle beslenecek.'
    }
});
</script>

<template>
    <div class="grid grid-cols-12 gap-8">
        <div class="col-span-12">
            <div class="card">
                <div class="flex flex-col gap-2 mb-6">
                    <h1 class="text-2xl font-semibold m-0">{{ title }}</h1>
                    <p class="text-muted-color m-0">{{ description }}</p>
                </div>

                <DataTable :value="[]" tableStyle="min-width: 50rem">
                    <Column field="name" header="Ad"></Column>
                    <Column field="status" header="Durum"></Column>
                    <Column field="updatedAt" header="Güncelleme"></Column>
                    <template #empty>
                        <div class="py-8 text-center text-muted-color">Henüz demo veri yok.</div>
                    </template>
                </DataTable>
            </div>
        </div>
    </div>
</template>
