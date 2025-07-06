<template>
  <meta name="csrf-token" content="{{ csrf_token() }}">
  <AppHeader />

  <Login v-if="page === 'login'" @loginSuccess="page = 'usuarios'; loadUsers()" />

  <div v-if="page === 'usuarios'" class="p-4">
    <div class="flex justify-between mb-4">
      <button @click="openCreateModal" class="btn btn-green">Novo Usuário</button>
      <button @click="logout" class="btn btn-gray">Sair</button>
    </div>
    <UserList :users="users" @edit="editUser" @view="viewUser" @delete="deleteUser" />
    <ModalUserForm v-if="showForm" :user="editingUser" @save="saveUser" @close="closeForm" />
    <ModalUserView v-if="viewingUser" :user="viewingUser" @close="viewingUser = null" />
  </div>

  <AppFooter />
</template>
<script>
import AppHeader from './components/Header.vue';
import AppFooter from './components/Footer.vue';
import Login from './views/Login.vue';
import ModalUserForm from './components/ModalUserForm.vue';
import ModalUserView from './components/ModalUserView.vue';
import UserList from './components/UserList.vue';
import api from './axios';

export default {
  components: {
    AppHeader,
    AppFooter,
    Login,
    ModalUserForm,
    ModalUserView,
    UserList
  },
  data() {
    return {
      page: 'login',
      users: [],
      editingUser: null,
      showForm: false,
      viewingUser: null
    };
  },
  methods: {
    async loadUsers() {
      const res = await api.get('/users');
      this.users = res.data;
    },
    openCreateModal() {
      this.editingUser = null;
      this.showForm = true;
    },
    closeForm() {
      this.showForm = false;
    },
    editUser(user) {
      this.editingUser = user;
      this.showForm = true;
    },
    viewUser(user) {
      this.viewingUser = user;
    },
    async saveUser(data) {
      if (this.editingUser) {
        await api.put(`/users/${this.editingUser.id}`, data);
      } else {
        await api.post('/users', data);
      }
      this.showForm = false;
      this.loadUsers();
    },
    async deleteUser(id) {
      if (confirm('Tem certeza que deseja excluir?')) {
        await api.delete(`/users/${id}`);
        this.loadUsers();
      }
    },
    async logout() {
      await api.post('/logout');
      this.page = 'login';
      this.users = [];
    }
  }
};
</script>
