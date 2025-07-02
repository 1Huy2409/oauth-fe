<script setup>
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ref } from "vue";
import authService from "../../services/auth.js";
import { useSharedDataStore } from "../../stores/shareData.js"
import { useRouter } from 'vue-router';
const router = useRouter();
const formData = ref({
  email: "",
});
const errors = ref({
  email: "",
});
const clearErrors = () => {
  errors.value = {
    email: "",
  };
};
const validateForm = () => {
  clearErrors();
  let valid = true;
  if (!formData.value.email) {
    errors.value.email = "Email is required.";
    valid = false;
  } else {
    // Regex kiểm tra email hợp lệ
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.value.email)) {
      errors.value.email = "Email is invalid.";
      valid = false;
    }
  }
  return valid;
};
const shareDataStore = useSharedDataStore()
const handleSubmit = async () => {
  if (!validateForm()) return;
  clearErrors();
  try {
    const result = await authService.forgotPassword(formData.value);
    if (result.success) {
        shareDataStore.persistData(formData.value.email)
        router.push('/password/reset')
    }
  } catch (error) {
    error.value.email = result.error
  }
};
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
  <div :class="cn('flex flex-col gap-6')">
    <Card class="overflow-hidden p-0">
      <CardContent class="grid p-0 md:grid-cols-1">
        <form @submit.prevent="handleSubmit" class="p-6 md:p-8">
          <div class="flex flex-col gap-6">
            <div class="flex flex-col items-center text-center">
              <h1 class="text-2xl font-bold">Forgot Password</h1>
              <p class="text-muted-foreground text-balance">
                Submit your email here, we will send you an otp code to restore
                your password
              </p>
            </div>

            <div class="grid gap-3">
              <!-- Email -->
              <Label for="email">Email</Label>
              <Input
                id="email"
                type="email"
                v-model="formData.email"
                @input="handleInputChange('email')"
                placeholder="Enter your email"
                :class="{ 'border-red-500': errors.email }"
                required
              />
              <span v-if="errors.email" class="text-red-500 text-sm">{{
                errors.email
              }}</span>
            </div>

            <Button
              type="submit"
              class="w-full bg-black text-white hover:bg-black/90 cursor-pointer"
            >
              Send OTP code
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  </div>
</template>
