<script setup>
import { cn } from "@/lib/utils";
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ref, computed } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';

const props = defineProps({
  class: { type: null, required: false },
});

// Reactive data for form fields
const router = useRouter();
const authStore = useAuthStore();

const formData = ref({
  fullname: '',
  email: '',
  username: '',
  password: '',
});

const errors = ref({
  fullname: '',
  email: '',
  username: '',
  password: '',
  general: '',
});


// computed property
const isFormValid = computed(() => {
  return formData.value.fullname.trim() && 
         formData.value.email.trim() && 
         formData.value.username.trim() && 
         formData.value.password.trim() 
})

// Method to handle form submission
const clearErrors = () => {
  errors.value = {
    fullname: '',
    email: '',
    username: '',
    password: '',
    general: '',
  };
};

const validateForm = () => {
  clearErrors();
  let valid = true;

  if (!formData.value.fullname) {
    errors.value.fullname = 'Full name is required.';
    valid = false;
  }
  if (!formData.value.email) {
    errors.value.email = 'Email is required.';
    valid = false;
  }
  if (!formData.value.username) {
    errors.value.username = 'Username is required.';
    valid = false;
  }
  if (!formData.value.password || formData.value.password.length < 5) {
    errors.value.password = 'Password must be at least 5 characters long.';
    valid = false;
  }
  return valid;
}

const handleSubmit = async (event) => {
  if (!validateForm()) return;

  clearErrors();

  try {
    const result = await authStore.register(formData.value);
    console.log('Registration result:', result);
    if (result.success) {
      router.push('/login');
      return;
    }
  } catch (error) {
    console.error('Registration error:', error);
    errors.value.general = 'Registration failed. Please try again.';
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

</script>

<template>
  <div :class="cn('flex flex-col gap-6', props.class)">
    <Card class="overflow-hidden p-0">
      <CardContent class="grid p-0 md:grid-cols-2">
        <form @submit.prevent="handleSubmit" class="p-6 md:p-8">
          <div class="flex flex-col gap-6">
            <div class="flex flex-col items-center text-center">
              <h1 class="text-2xl font-bold">Create an account</h1>
              <p class="text-muted-foreground text-balance">
                Let's get started. Fill in the details below to create your account.
              </p>
            </div>
            
            <div class="grid gap-3">
              <Label for="name">Full Name</Label>
              <Input
                id="name"
                v-model="formData.fullname"
                @input="handleInputChange('fullname')"
                type="text"
                placeholder="Enter your full name"
                required
              />
            </div>
            
            <div class="grid gap-3">
              <Label for="email">Email</Label>
              <Input
                id="email"
                type="email"
                v-model="formData.email"
                @input="handleInputChange('email')"
                placeholder="Enter your email"
                required
              />
            </div>

            <div class="grid gap-3">
              <Label for="username">Username</Label>
              <Input
                id="username"
                type="text"
                v-model="formData.username"
                @input="handleInputChange('username')"
                placeholder="Enter your username"
                required
              />
            </div>

            <div class="grid gap-3">
              <Label for="password">Password</Label>
              <Input 
                id="password" 
                type="password" 
                v-model="formData.password"
                @input="handleInputChange('password')"
                placeholder="Enter your password" 
                required 
              />
              <p class="text-sm text-muted-foreground">Minimum 5 characters.</p>
            </div>
            
            
            <Button type="submit" class="w-full bg-black text-white hover:bg-black/90">
              Sign up
            </Button>
            
            <div
              class="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t"
            >
              <span class="bg-card text-muted-foreground relative z-10 px-2">
                OR
              </span>
            </div>
            
            <div class="grid grid-cols-2 gap-4">
              
              <!-- Google -->
              <Button variant="outline" type="button" class="w-full">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="h-4 w-4">
                  <path
                    d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                    fill="currentColor"
                  />
                </svg>
                <span class="sr-only">Sign up with Google</span>
              </Button>
              
              <!-- Apple -->
              <Button variant="outline" type="button" class="w-full">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <path
                    d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
                    fill="currentColor"
                  />
                </svg>
                <span class="sr-only">Sign up with Facebook</span>
              </Button>
            </div>
            
            <div class="text-center text-sm">
              Already have an account?
              <a href="/login" class="underline underline-offset-4 hover:text-primary">Sign in</a>
            </div>
          </div>
        </form>
        
        <div class="bg-muted relative hidden md:block">
          <img
            src="../../assets/img/Kim-Ji-Won-6.jpg"
            alt="Registration background"
            class="absolute inset-0 h-full w-full object-cover"
          />
        </div>
      </CardContent>
    </Card>
    
    <div
      class="text-muted-foreground text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4 *:[a]:hover:text-primary"
    >
      By clicking continue, you agree to our
      <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
    </div>
  </div>
</template>