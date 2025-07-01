<template>
  <div class="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200 overflow-hidden group">
    <div class="flex items-center p-4 space-x-4">
      <!-- Avatar -->
      <div class="flex-shrink-0">
        <div class="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full flex items-center justify-center shadow-sm">
          <span class="text-white font-bold text-sm">
            {{ getInitials(user.fullname) }}
          </span>
        </div>
      </div>

      <!-- User Info -->
      <div class="flex-1 min-w-0">
        <div class="flex items-center space-x-3 mb-1">
          <!-- Full Name -->
          <h3 class="text-lg font-semibold text-gray-900 truncate">
            {{ user.fullname }}
          </h3>
          <!-- Role Badge -->
          <span :class="getRoleBadgeClass(user.role)" class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap">
            {{ user.role || 'User' }}
          </span>
        </div>
        
        <div class="flex items-center space-x-4 text-sm text-gray-600">
          <!-- Clickable Username -->
          <button 
            @click="$emit('view-profile', user)"
            class="text-blue-600 hover:text-blue-800 hover:underline font-medium transition-colors"
          >
            @{{ user.username }}
          </button>
          
          <!-- Email -->
          <div class="flex items-center space-x-1">
            <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
            </svg>
            <span class="truncate">{{ user.email }}</span>
          </div>
          
          <!-- ID -->
          <div class="flex items-center space-x-1">
            <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
            <span class="text-gray-500">ID: {{ user.id }}</span>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex-shrink-0 flex items-center space-x-2">
        <!-- Update Button -->
        <button 
          @click="$emit('update-user', user)"
          class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center space-x-1 shadow-sm"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          <span>Update</span>
        </button>
        
        <!-- Delete Button -->
        <button 
          @click="$emit('delete-user', user)"
          class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center space-x-1 shadow-sm"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          <span>Delete</span>
        </button>
      </div>
    </div>

    <!-- Hover effect overlay -->
    <div class="absolute inset-0 bg-gradient-to-r from-blue-500/2 to-purple-500/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
  </div>
</template>

<script setup>
const props = defineProps({
  user: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['view-profile', 'update-user', 'delete-user'])

const getInitials = (fullname) => {
  if (!fullname) return '?'
  return fullname
    .split(' ')
    .map(name => name.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

const getRoleBadgeClass = (role) => {
  const roleClasses = {
    'admin': 'bg-red-100 text-red-800',
    'moderator': 'bg-yellow-100 text-yellow-800',
    'user': 'bg-green-100 text-green-800',
    'guest': 'bg-gray-100 text-gray-800'
  }
  
  return roleClasses[role?.toLowerCase()] || 'bg-blue-100 text-blue-800'
}
</script>