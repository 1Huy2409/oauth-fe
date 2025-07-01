<template>
  <div class="w-[1200px] h-[100vh] mx-auto">
    <!-- Header -->
    <header class="bg-white shadow-sm w-full rounded-lg">
      <div class="w-full px-2 lg:px-4">
        <div class="flex justify-between items-center h-16">
          <!-- Logo -->
          <div class="flex-shrink-0">
            <h1 class="text-xl font-bold text-gray-900">
              Dashboard - Danh sách Users
            </h1>
          </div>

          <!-- User Info & Logout Button -->
          <div class="flex items-center space-x-4">
            <span class="text-gray-700 text-sm">
              Welcome,
              <span class="font-medium">{{ authStore.user?.fullname }}</span>
            </span>
            <button
              @click="handleLogout"
              class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
              :disabled="authStore.isLoading"
            >
              {{ authStore.isLoading ? "Đang xử lý..." : "Đăng xuất" }}
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="w-full py-6">
      <div class="bg-white shadow rounded-lg">
        <div class="px-6 py-4 border-b border-gray-200">
          <div class="flex justify-between items-center">
            <h2 class="text-lg font-medium text-gray-900">Danh sách Users</h2>
            <div class="flex items-center space-x-2">
              <span class="text-sm text-gray-500">
                Tổng: {{ users.length }} users
              </span>
              <button
                @click="fetchUsers"
                :disabled="isLoading"
                class="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md text-sm font-medium transition-colors disabled:opacity-50"
              >
                {{ isLoading ? "Đang tải..." : "Làm mới" }}
              </button>
            </div>
          </div>
        </div>

        <div class="p-6">
          <!-- Loading State -->
          <div v-if="isLoading" class="flex justify-center items-center py-12">
            <div
              class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"
            ></div>
            <span class="ml-3 text-gray-600">Đang tải danh sách users...</span>
          </div>

          <!-- Error State -->
          <div v-else-if="error" class="text-center py-12">
            <div class="text-red-600 mb-4">
              <svg
                class="w-12 h-12 mx-auto mb-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p class="text-lg font-medium">Không thể tải danh sách users</p>
              <p class="text-sm text-gray-600 mt-1">{{ error }}</p>
            </div>
            <button
              @click="fetchUsers"
              class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Thử lại
            </button>
          </div>

          <!-- Users List (Vertical Layout) -->
          <div v-else-if="users.length > 0" class="space-y-3">
            <CardUser
              v-for="user in users"
              :key="user.id"
              :user="user"
              @view-profile="handleViewProfile"
              @update-user="handleUpdateUser"
              @delete-user="handleDeleteUser"
            />
          </div>

          <!-- Empty State -->
          <div v-else class="text-center py-12">
            <div class="text-gray-400 mb-4">
              <svg
                class="w-12 h-12 mx-auto mb-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              <p class="text-lg font-medium">Chưa có users nào</p>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- User Detail Modal -->
    <div
      v-if="selectedUser"
      class="fixed inset-0 bg-gray-500 bg-opacity-50 z-50 flex items-center justify-center p-4"
    >
      <div
        class="bg-white rounded-lg max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto"
      >
        <div class="flex justify-between items-center mb-6">
          <h3 class="text-xl font-semibold text-gray-900">Thông tin User</h3>
          <button
            @click="selectedUser = null"
            class="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg
              class="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <!-- Profile Content -->
        <div class="space-y-4">
          <!-- Avatar & Basic Info -->
          <div class="text-center pb-4 border-b">
            <div
              class="w-20 h-20 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-3"
            >
              <span class="text-white font-bold text-xl">
                {{ getInitials(selectedUser.fullname) }}
              </span>
            </div>
            <h2 class="text-xl font-semibold text-gray-900">
              {{ selectedUser.fullname }}
            </h2>
            <p class="text-gray-600">@{{ selectedUser.username }}</p>
            <span
              :class="getRoleBadgeClass(selectedUser.role)"
              class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-2"
            >
              {{ selectedUser.role || "User" }}
            </span>
          </div>

          <!-- Detailed Info -->
          <div class="grid grid-cols-1 gap-4">
            <div class="bg-gray-50 p-3 rounded-lg">
              <h4 class="text-sm font-medium text-gray-500 mb-1">Email</h4>
              <p class="text-gray-900">{{ selectedUser.email }}</p>
            </div>

            <div class="bg-gray-50 p-3 rounded-lg">
              <h4 class="text-sm font-medium text-gray-500 mb-1">Username</h4>
              <p class="text-gray-900">{{ selectedUser.username }}</p>
            </div>

            <div class="bg-gray-50 p-3 rounded-lg">
              <h4 class="text-sm font-medium text-gray-500 mb-1">Vai trò</h4>
              <p class="text-gray-900">{{ selectedUser.role || "User" }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div
      v-if="userToDelete"
      class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
    >
      <div class="bg-white rounded-lg max-w-md w-full p-6">
        <div class="flex items-center mb-4">
          <div
            class="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mr-3"
          >
            <svg
              class="w-6 h-6 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h3 class="text-lg font-semibold text-gray-900">Xác nhận xóa</h3>
        </div>

        <p class="text-gray-600 mb-6">
          Bạn có chắc chắn muốn xóa user
          <strong>{{ userToDelete.fullname }}</strong
          >? Hành động này không thể hoàn tác.
        </p>

        <div class="flex space-x-3">
          <button
            @click="userToDelete = null"
            class="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md text-sm font-medium transition-colors"
          >
            Hủy
          </button>
          <button
            @click="confirmDelete"
            class="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
          >
            Xóa
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, watch } from "vue";
import { useAuthStore } from "@/stores/auth";
import { useRouter } from "vue-router";
import CardUser from "@/components/CardUser.vue";
import userService from "@/services/user.js";

const authStore = useAuthStore();
const router = useRouter();

// Reactive data
const users = ref([]);
const isLoading = ref(false);
const error = ref(null);
const selectedUser = ref(null);
const userToDelete = ref(null);
// Watch auth state và redirect nếu không authenticated
watch(
  () => authStore.isAuthenticated,
  (newValue) => {
    if (!newValue) {
      router.push("/login");
    }
  },
  { immediate: true }
);

// Fetch users function
const fetchUsers = async () => {
  isLoading.value = true;
  error.value = null;

  try {
    const response = await userService.getAllUsers();
    if (response.success) {
      users.value = response.data.metadata || [];
    } else {
      error.value = response.error;
    }
  } catch (err) {
    error.value = "Đã xảy ra lỗi khi tải danh sách users";
    console.error("Error fetching users:", err);
  } finally {
    isLoading.value = false;
  }
};

// Helper functions
const getInitials = (fullname) => {
  if (!fullname) return "?";
  return fullname
    .split(" ")
    .map((name) => name.charAt(0))
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

const getRoleBadgeClass = (role) => {
  const roleClasses = {
    admin: "bg-red-100 text-red-800",
    moderator: "bg-yellow-100 text-yellow-800",
    user: "bg-green-100 text-green-800",
    guest: "bg-gray-100 text-gray-800",
  };

  return roleClasses[role?.toLowerCase()] || "bg-blue-100 text-blue-800";
};

// Event handlers
const handleViewProfile = (user) => {
  selectedUser.value = user;
};

const handleUpdateUser = (user) => {
  // TODO: Implement update user functionality
  console.log("Update user:", user.fullname);
  // You can navigate to edit page or open edit modal
  // router.push(`/users/${user.id}/edit`)
};

const handleDeleteUser = (user) => {
  userToDelete.value = user;
};

const confirmDelete = async () => {
  // TODO: Implement delete user functionality
  console.log("Delete user:", userToDelete.value);
  // You can call delete API here
  const result = await userService.deleteUserById(userToDelete.value._id);
  if (result.success) {
    alert(result.message)
    fetchUsers()
  } else {
    alert(result.error)
  }
  userToDelete.value = null;
};

const handleLogout = async () => {
  await authStore.logout();
  router.push("/login");
};

// Lifecycle
onMounted(() => {
  if (!authStore.isAuthenticated) {
    router.push("/login");
  } else {
    fetchUsers();
  }
});
</script>
