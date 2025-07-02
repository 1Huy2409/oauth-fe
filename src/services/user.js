import api from "./api.js";

export default {
  async getAllUsers() {
    try {
      const response = await api.get("/users");
      return {
        success: true,
        data: response,
      };
    } catch (error) {
      let errorMessage = error.response.data.message;
      return {
        success: false,
        error: errorMessage,
      };
    }
  },
  async getUserById(id) {
    try {
      const response = await api.get(`/users/${id}`);
      return {
        success: true,
        data: response,
      };
    } catch (error) {
      let errorMessage = error.response.data.message;
      return {
        success: false,
        error: errorMessage,
      };
    }
  },
  async deleteUserById(id) {
    try {
      const response = await api.delete(`/users/${id}`)
      return {
        success: true,
        message: response.message
      }
    }
    catch(error)
    {
      let errorMessage = error.response.data.message
      return {
        success: false,
        error: errorMessage
      }
    }
  },
  async addUser(user) {
    try {
      const response = await api.post("/users", user);
      return {
        success: true,
        data: response,
      };
    } catch (error) {
      let errorMessage = error.response.data.message;
      return {
        success: false,
        error: errorMessage,
      };
    }
  },
  async updateUserById(id, data) {
    try {
      const response = await api.put(`/users/${id}`, data);
      return {
        success: true,
        data: response,
      };
    } catch (error) {
      let errorMessage = error.response.data.message;
      return {
        success: false,
        error: errorMessage,
      };
    }
  }
};
