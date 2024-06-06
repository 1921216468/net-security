import { defineStore } from 'pinia'

const useUserStore = defineStore('user', {
    persist: true,
    state: () => {
        return {
            user: null,
            isLoggedIn: false,
        }
    }
})

export default useUserStore

