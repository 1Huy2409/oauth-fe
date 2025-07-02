import { defineStore } from "pinia";
import { ref } from 'vue'

export const useSharedDataStore = defineStore('shareData', () => {
    const email = ref(localStorage.getItem('emailShare') || null)
    const persistData = (shareEmail) =>
    {
        email.value = shareEmail
        localStorage.setItem('emailShare', shareEmail)
    }
    const clearData = () => {
        email.value = null
        localStorage.removeItem('emailShare')
    }
    return {
        email,
        persistData,
        clearData
    }
})