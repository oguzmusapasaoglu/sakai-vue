<script setup>
import { computed, ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { CpoCompanyInfoService } from '@/service/CpoCompanyInfoService';

const router = useRouter();
const route = useRoute();

const cpoId = computed(() => route.params.id);
const isEditMode = computed(() => Boolean(cpoId.value));
const pageTitle = computed(() => (isEditMode.value ? 'CPO Düzenle' : 'Yeni CPO Girişi'));
const loading = ref(false);
const saving = ref(false);

const formData = ref(createEmptyForm());
const touched = ref({});
const requiredFields = ['cpoCode', 'companyName', 'legalCompanyName', 'website', 'officialEmail', 'officialPhone', 'userFullName', 'userEmail', 'userPhone'];

const validationErrors = computed(() => {
    const errors = {};

    requiredFields.forEach((field) => {
        if (!formData.value[field]?.trim()) {
            errors[field] = 'Bu alan zorunludur.';
        }
    });

    if (formData.value.website?.trim() && !isValidWebsite(formData.value.website)) {
        errors.website = 'Geçerli bir web sitesi giriniz.';
    }

    if (formData.value.officialEmail?.trim() && !isValidEmail(formData.value.officialEmail)) {
        errors.officialEmail = 'Geçerli bir e-posta adresi giriniz.';
    }

    if (formData.value.userEmail?.trim() && !isValidEmail(formData.value.userEmail)) {
        errors.userEmail = 'Geçerli bir e-posta adresi giriniz.';
    }

    if (formData.value.officialPhone?.trim() && !isValidPhone(formData.value.officialPhone)) {
        errors.officialPhone = 'Geçerli bir telefon numarası giriniz.';
    }

    if (formData.value.userPhone?.trim() && !isValidPhone(formData.value.userPhone)) {
        errors.userPhone = 'Geçerli bir telefon numarası giriniz.';
    }

    return errors;
});

const isFormValid = computed(() => Object.keys(validationErrors.value).length === 0);

onMounted(async () => {
    if (isEditMode.value) {
        await loadCpoData();
    }
});

function createEmptyForm() {
    return {
        cpoCode: '',
        companyName: '',
        legalCompanyName: '',
        website: '',
        officialEmail: '',
        officialPhone: '',
        userFullName: '',
        userEmail: '',
        userPhone: ''
    };
}

async function loadCpoData() {
    loading.value = true;

    try {
        const cpo = await CpoCompanyInfoService.getCpoById(cpoId.value);
        formData.value = {
            ...createEmptyForm(),
            cpoCode: cpo?.cpoCode ?? '',
            companyName: cpo?.companyName ?? '',
            legalCompanyName: cpo?.legalCompanyName ?? '',
            website: cpo?.website ?? '',
            officialEmail: cpo?.officialEmail ?? '',
            officialPhone: cpo?.officialPhone ?? '',
            userEmail: cpo?.officialEmail ?? '',
            userPhone: cpo?.officialPhone ?? ''
        };
    } catch (error) {
        console.error('Error loading CPO:', error);
    } finally {
        loading.value = false;
    }
}

function buildPayload() {
    return {
        cpoCode: formData.value.cpoCode.trim(),
        companyName: formData.value.companyName.trim(),
        legalCompanyName: formData.value.legalCompanyName.trim(),
        website: formData.value.website.trim(),
        officialEmail: formData.value.officialEmail.trim(),
        officialPhone: formData.value.officialPhone.trim(),
        userFullName: formData.value.userFullName.trim(),
        userEmail: formData.value.userEmail.trim(),
        userPhone: formData.value.userPhone.trim()
    };
}

async function saveCpo() {
    markAllTouched();

    if (!isFormValid.value) {
        return;
    }

    saving.value = true;

    try {
        if (isEditMode.value) {
            await CpoCompanyInfoService.updateCpo(cpoId.value, buildPayload());
        } else {
            await CpoCompanyInfoService.createCpo(buildPayload());
        }

        router.push({ name: 'cpoList' });
    } catch (error) {
        console.error('Error saving CPO:', error);
    } finally {
        saving.value = false;
    }
}

function goBack() {
    router.push({ name: 'cpoList' });
}

function touch(field) {
    touched.value[field] = true;
}

function markAllTouched() {
    requiredFields.forEach((field) => {
        touched.value[field] = true;
    });
}

function fieldError(field) {
    return touched.value[field] ? validationErrors.value[field] : '';
}

function isValidWebsite(value) {
    return /^(https?:\/\/)?([\p{L}\p{N}-]+\.)+[\p{L}]{2,}(\/.*)?$/u.test(value.trim());
}

function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function isValidPhone(value) {
    return /^\+?[0-9\s().-]{7,20}$/.test(value);
}
</script>

<template>
    <div class="card">
        <div class="flex items-center gap-2 mb-4">
            <Button icon="pi pi-arrow-left" text rounded title="Geri Dön" @click="goBack" />
            <span class="text-xl font-semibold">{{ pageTitle }}</span>
        </div>

        <div v-if="loading" class="py-8 text-center text-gray-500">Yükleniyor...</div>

        <form v-else @submit.prevent="saveCpo">
            <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                <div>
                    <label class="block text-sm font-medium mb-2" for="cpoCode">CPO Kodu</label>
                    <InputText id="cpoCode" v-model="formData.cpoCode" class="w-full" maxlength="64" :invalid="Boolean(fieldError('cpoCode'))" @blur="touch('cpoCode')" />
                    <small v-if="fieldError('cpoCode')" class="text-red-500">{{ fieldError('cpoCode') }}</small>
                </div>
                <div>
                    <label class="block text-sm font-medium mb-2" for="companyName">Şirket Adı</label>
                    <InputText id="companyName" v-model="formData.companyName" class="w-full" maxlength="255" :invalid="Boolean(fieldError('companyName'))" @blur="touch('companyName')" />
                    <small v-if="fieldError('companyName')" class="text-red-500">{{ fieldError('companyName') }}</small>
                </div>
                <div>
                    <label class="block text-sm font-medium mb-2" for="legalCompanyName">Ticari Unvan</label>
                    <InputText id="legalCompanyName" v-model="formData.legalCompanyName" class="w-full" maxlength="255" :invalid="Boolean(fieldError('legalCompanyName'))" @blur="touch('legalCompanyName')" />
                    <small v-if="fieldError('legalCompanyName')" class="text-red-500">{{ fieldError('legalCompanyName') }}</small>
                </div>
                <div>
                    <label class="block text-sm font-medium mb-2" for="website">Web Sitesi</label>
                    <InputText id="website" v-model="formData.website" class="w-full" maxlength="255" :invalid="Boolean(fieldError('website'))" @blur="touch('website')" />
                    <small v-if="fieldError('website')" class="text-red-500">{{ fieldError('website') }}</small>
                </div>
                <div>
                    <label class="block text-sm font-medium mb-2" for="officialEmail">Resmi E-posta</label>
                    <InputText id="officialEmail" v-model="formData.officialEmail" type="email" class="w-full" maxlength="255" :invalid="Boolean(fieldError('officialEmail'))" @blur="touch('officialEmail')" />
                    <small v-if="fieldError('officialEmail')" class="text-red-500">{{ fieldError('officialEmail') }}</small>
                </div>
                <div>
                    <label class="block text-sm font-medium mb-2" for="officialPhone">Resmi Telefon</label>
                    <InputText id="officialPhone" v-model="formData.officialPhone" class="w-full" maxlength="50" :invalid="Boolean(fieldError('officialPhone'))" @blur="touch('officialPhone')" />
                    <small v-if="fieldError('officialPhone')" class="text-red-500">{{ fieldError('officialPhone') }}</small>
                </div>
                <div>
                    <label class="block text-sm font-medium mb-2" for="userFullName">İlk Kullanıcı Ad Soyad</label>
                    <InputText id="userFullName" v-model="formData.userFullName" class="w-full" maxlength="200" :invalid="Boolean(fieldError('userFullName'))" @blur="touch('userFullName')" />
                    <small v-if="fieldError('userFullName')" class="text-red-500">{{ fieldError('userFullName') }}</small>
                </div>
                <div>
                    <label class="block text-sm font-medium mb-2" for="userEmail">İlk Kullanıcı E-posta</label>
                    <InputText id="userEmail" v-model="formData.userEmail" type="email" class="w-full" maxlength="255" :invalid="Boolean(fieldError('userEmail'))" @blur="touch('userEmail')" />
                    <small v-if="fieldError('userEmail')" class="text-red-500">{{ fieldError('userEmail') }}</small>
                </div>
                <div>
                    <label class="block text-sm font-medium mb-2" for="userPhone">İlk Kullanıcı Telefon</label>
                    <InputText id="userPhone" v-model="formData.userPhone" class="w-full" maxlength="50" :invalid="Boolean(fieldError('userPhone'))" @blur="touch('userPhone')" />
                    <small v-if="fieldError('userPhone')" class="text-red-500">{{ fieldError('userPhone') }}</small>
                </div>
            </div>

            <div class="flex justify-end gap-2 mt-4">
                <Button label="İptal" icon="pi pi-times" outlined type="button" @click="goBack" />
                <Button label="Kaydet" icon="pi pi-check" :disabled="!isFormValid" :loading="saving" type="submit" />
            </div>
        </form>
    </div>
</template>
