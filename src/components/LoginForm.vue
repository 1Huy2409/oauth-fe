<!-- <script setup>
import { cn } from "@/lib/utils";
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const props = defineProps({
  class: { type: null, required: false },
});
</script>

<template>
  <div :class="cn('flex flex-col gap-6 w-[980px]', props.class)">
    <Card class="overflow-hidden p-0">
      <CardContent class="grid p-0 md:grid-cols-2">
        <form class="p-6 md:p-8">
          <div class="flex flex-col gap-6">
            <div class="flex flex-col items-center text-center">
              <h1 class="text-2xl font-bold">Welcome back</h1>
              <p class="text-muted-foreground text-balance">
                Login to your HuyHung Website
              </p>
            </div>
            <div class="grid gap-3">
              <Label for="username">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="Enter username"
                required
              />
            </div>
            <div class="grid gap-3">
              <div class="flex items-center">
                <Label for="password">Password</Label>
                <a
                  href="#"
                  class="ml-auto text-sm underline-offset-2 hover:underline"
                >
                  Forgot your password?
                </a>
              </div>
              <Input id="password" type="password" placeholder="Enter password" required />
            </div>
            <Button type="submit" class="w-full"> Login </Button>
            <div
              class="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t"
            >
              <span class="bg-card text-muted-foreground relative z-10 px-2">
                Or continue with
              </span>
            </div>
            <div class="grid grid-cols-2 gap-4">
              <Button variant="outline" type="button" class="w-full">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <path
                    d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                    fill="currentColor"
                  />
                </svg>
                <span class="sr-only">Login with Google</span>
              </Button>
              <Button variant="outline" type="button" class="w-full">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <path
                    d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
                    fill="currentColor"
                  />
                </svg>
                <span class="sr-only">Login with Facebook</span>
              </Button>
            </div>
            <div class="text-center text-sm">
              Don't have an account?
              <a href="/register" class="underline underline-offset-4"> Sign up </a>
            </div>
          </div>
        </form>
        <div class="bg-muted relative hidden md:block">
          <img
            src="../assets/img/avagit.jpg"
            alt="Image"
            class="absolute inset-0 h-full w-full object-cover"
          />
        </div>
      </CardContent>
    </Card>
    <div
      class="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4"
    >
      By clicking continue, you agree to our
      <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
    </div>
  </div>
</template> -->
<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { cn } from "@/lib/utils";
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuthStore } from '@/stores/auth';

const props = defineProps({
  class: { type: null, required: false },
});

// ===== Reactive Data =====
const router = useRouter()
const authStore = useAuthStore()

const formData = ref({
  username: '',
  password: ''
})

const errors = ref({
  username: '',
  password: '',
  general: ''
})

const isSubmitting = ref(false)

// ===== Computed =====
const isFormValid = computed(() => {
  return formData.value.username.trim() && 
         formData.value.password.trim() && 
         !isSubmitting.value
})

// ===== Methods =====!
const clearErrors = () => {
  errors.value = {
    username: '',
    password: '',
    general: ''
  }
}

const validateForm = () => {
  clearErrors()
  let isValid = true

  if (!formData.value.username.trim()) {
    errors.value.username = 'Username là bắt buộc'
    isValid = false
  }

  if (!formData.value.password.trim()) {
    errors.value.password = 'Password là bắt buộc'
    isValid = false
  } else if (formData.value.password.length < 6) {
    errors.value.password = 'Password phải có ít nhất 6 ký tự'
    isValid = false
  }

  return isValid
}

const handleSubmit = async () => {
  if (!validateForm()) return

  isSubmitting.value = true
  clearErrors()

  try {
    const result = await authStore.login({
      username: formData.value.username.trim(),
      password: formData.value.password.trim()
    })

    if (result.success) {
      // Redirect to profile or intended page
      const redirectPath = router.currentRoute.value.query.redirect || '/profile'
      router.push(redirectPath)
    } else {
      errors.value.general = result.error || 'Đăng nhập thất bại'
    }
  } catch (error) {
    errors.value.general = 'Có lỗi xảy ra. Vui lòng thử lại.'
    console.error('Login error:', error)
  } finally {
    isSubmitting.value = false
  }
}

const handleInputChange = (field) => {
  // Clear error when user starts typing
  if (errors.value[field]) {
    errors.value[field] = ''
  }
  if (errors.value.general) {
    errors.value.general = ''
  }
}
const handleGoogleLogin = () => {
  window.location.href = "http://localhost:8000/api/v1/auth/google"
}

const handleFacebookLogin = () => {
  window.location.href = "http://localhost:8000/api/v1/auth/facebook"
}

</script>

<template>
  <div :class="cn('flex flex-col gap-6 w-[980px]', props.class)">
    <Card class="overflow-hidden p-0">
      <CardContent class="grid p-0 md:grid-cols-2">
        <form @submit.prevent="handleSubmit" class="p-6 md:p-8">
          <div class="flex flex-col gap-6">
            <!-- Header -->
            <div class="flex flex-col items-center text-center">
              <h1 class="text-2xl font-bold">Welcome back</h1>
              <p class="text-muted-foreground text-balance">
                Login to your HuyHung Website
              </p>
            </div>

            <!-- General Error -->
            <div v-if="errors.general" class="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
              {{ errors.general }}
            </div>

            <!-- Username Field -->
            <div class="grid gap-3">
              <Label for="username">Username</Label>
              <Input
                id="username"
                v-model="formData.username"
                @input="handleInputChange('username')"
                type="text"
                placeholder="Enter username"
                :class="{ 'border-red-500': errors.username }"
                :disabled="isSubmitting"
                required
              />
              <span v-if="errors.username" class="text-red-500 text-sm">{{ errors.username }}</span>
            </div>

            <!-- Password Field -->
            <div class="grid gap-3">
              <div class="flex items-center">
                <Label for="password">Password</Label>
                <a
                  href="#"
                  class="ml-auto text-sm underline-offset-2 hover:underline"
                >
                  Forgot your password?
                </a>
              </div>
              <Input 
                id="password" 
                v-model="formData.password"
                @input="handleInputChange('password')"
                type="password" 
                placeholder="Enter password" 
                :class="{ 'border-red-500': errors.password }"
                :disabled="isSubmitting"
                required 
              />
              <span v-if="errors.password" class="text-red-500 text-sm">{{ errors.password }}</span>
            </div>

            <!-- Submit Button -->
            <Button 
              type="submit" 
              class="w-full" 
              :disabled="!isFormValid || isSubmitting"
            > 
              <span v-if="isSubmitting" class="flex items-center gap-2">
                <svg class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Đang đăng nhập...
              </span>
              <span v-else>Login</span>
            </Button>

            <!-- Divider -->
            <div
              class="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t"
            >
              <span class="bg-card text-muted-foreground relative z-10 px-2">
                Or continue with
              </span>
            </div>

            <!-- Social Login Buttons -->
            <div class="grid grid-cols-2 gap-4">
              <Button variant="outline" type="button" class="w-full" :disabled="isSubmitting" @click="handleGoogleLogin">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="w-5 h-5">
                  <path
                    d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                    fill="currentColor"
                  />
                </svg>
                <span class="sr-only">Login with Google</span>
              </Button>
              <Button variant="outline" type="button" class="w-full" :disabled="isSubmitting" @click="handleFacebookLogin">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="w-5 h-5">
                  <path
                    d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
                    fill="currentColor"
                  />
                </svg>
                <span class="sr-only">Login with Facebook</span>
              </Button>
            </div>

            <!-- Register Link -->
            <div class="text-center text-sm">
              Don't have an account?
              <router-link to="/register" class="underline underline-offset-4 hover:text-primary"> 
                Sign up 
              </router-link>
            </div>
          </div>
        </form>

        <!-- Image Side -->
        <div class="bg-muted relative hidden md:block">
          <img
            src="../assets/img/avagit.jpg"
            alt="Login Image"
            class="absolute inset-0 h-full w-full object-cover"
          />
        </div>
      </CardContent>
    </Card>
    
    <!-- Terms -->
    <div
      class="text-muted-foreground text-center text-xs text-balance"
    >
      By clicking continue, you agree to our
      <a href="#" class="underline underline-offset-4 hover:text-primary">Terms of Service</a> and 
      <a href="#" class="underline underline-offset-4 hover:text-primary">Privacy Policy</a>.
    </div>
  </div>
</template>