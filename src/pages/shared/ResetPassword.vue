<script setup>
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ref } from 'vue'
import authService from "../../services/auth.js";
import { useSharedDataStore } from "../../stores/shareData.js"
import { useRouter } from "vue-router";
const router = useRouter()
const shareData = useSharedDataStore()
const formData = ref({
  email: shareData.email,
  passwordResetToken: "",
  newPassword: ""
});
const errors = ref({
  email: "",
  passwordResetToken: "",
  newPassword: ""
});
const clearErrors = () => {
  errors.value = {
    email: "",
    passwordResetToken: "",
    newPassword: ""
  };
};
const validateForm = () => {
  clearErrors();
  let valid = true;
  if (!formData.value.email) {
    errors.value.email = "Email is required!";
    valid = false;
  } else {
    // Regex kiểm tra email hợp lệ
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.value.email)) {
      errors.value.email = "Email is invalid.";
      valid = false;
    }
  }
  if (!formData.value.passwordResetToken)
  {
    errors.value.passwordResetToken = "Password reset token is required!"
  }
  if (!formData.value.newPassword || formData.value.newPassword.length < 5) {
    errors.value.newPassword = 'Password must be at least 5 characters long.';
    valid = false;
  }
  return valid;
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
const handleSubmit = async () => {
  if (!validateForm()) return;
  clearErrors();
  try {
    const result = await authService.resetPassword(formData.value);
    if (result.success) {
        shareData.clearData()
        alert("Reset password successfully!")
        router.push('/login')
    }
  } catch (error) {
    error.value.email = result.error
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
              <h1 class="text-2xl font-bold">Reset Password</h1>
              <p class="text-muted-foreground text-balance">
                Enter your OTP here and set new password!
              </p>
            </div>

            <div class="grid gap-3">
              <!-- Email -->
              <Label for="email">Email</Label>
              <Input
                id="email"
                type="email"
                v-model="formData.email"
                disabled="true"
                placeholder="Enter your email"
                :class="{ 'border-red-500': errors.email }"
                required
              />
              <span v-if="errors.email" class="text-red-500 text-sm">{{
                errors.email
              }}</span>
            </div>

            <!-- password reset token -->
            <div class="grid gap-3">
              <Label for="name">OTP code</Label>
              <Input
                id="name"
                v-model="formData.passwordResetToken"
                @input="handleInputChange('passwordResetToken')"
                type="text"
                placeholder="Enter OTP code"
                :class="{ 'border-red-500': errors.passwordResetToken }"
                required
              />
              <span
                v-if="errors.passwordResetToken"
                class="text-red-500 text-sm"
                >{{ errors.passwordResetToken }}</span
              >
            </div>
            <div class="grid gap-3">
              <!-- Password -->
              <Label for="newPassword">New Password</Label>
              <Input
                id="newPassword"
                type="password"
                v-model="formData.newPassword"
                @input="handleInputChange('newPassword')"
                placeholder="Enter your password"
                :class="{ 'border-red-500': errors.newPassword }"
                required
              />
              <p class="text-sm text-muted-foreground">Minimum 5 characters.</p>
              <span v-if="errors.newPassword" class="text-red-500 text-sm">{{
                errors.newPassword
              }}</span>
            </div>
            <Button
              type="submit"
              class="w-full bg-black text-white hover:bg-black/90 cursor-pointer"
            >
              Change Password
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  </div>
</template>
