<template>
  <div class="modal-overlay" @click="closeModal">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <h2>{{ isEdit ? 'Editar' : 'Criar' }} Usuário</h2>
        <button class="close-button" @click="closeModal">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
      
      <form @submit.prevent="submitForm" class="modal-body">
        <div class="form-section">
          <h3>Informações Pessoais</h3>
          
          <div class="form-group">
            <label for="name">Nome Completo</label>
            <input
              id="name"
              v-model="formData.name"
              type="text"
              required
              placeholder="Digite seu nome completo"
            />
          </div>

          <div class="form-group">
            <label for="email">Email</label>
            <input
              id="email"
              v-model="formData.email"
              type="email"
              required
              placeholder="Digite seu email"
            />
          </div>

          <div class="form-group">
            <label for="password">{{ isEdit ? 'Nova Senha (opcional)' : 'Senha' }}</label>
            <input
              id="password"
              v-model="formData.password"
              type="password"
              :required="!isEdit"
              placeholder="Digite sua senha"
            />
          </div>

          <div class="form-group">
            <label for="profileImage">Foto de Perfil (URL)</label>
            <input
              id="profileImage"
              v-model="formData.profileImage"
              type="url"
              placeholder="https://exemplo.com/sua-foto.jpg"
            />
          </div>
        </div>

        <div class="form-section">
          <h3>Endereço Profissional</h3>
          
          <div class="form-row">
            <div class="form-group">
              <label for="street">Rua/Avenida</label>
              <input
                id="street"
                v-model="formData.street"
                type="text"
                placeholder="Nome da rua ou avenida"
              />
            </div>
            <div class="form-group form-group-small">
              <label for="number">Número</label>
              <input
                id="number"
                v-model="formData.number"
                type="text"
                placeholder="123"
              />
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="complement">Complemento</label>
              <input
                id="complement"
                v-model="formData.complement"
                type="text"
                placeholder="Apto, Sala, Andar..."
              />
            </div>
            <div class="form-group">
              <label for="neighborhood">Bairro</label>
              <input
                id="neighborhood"
                v-model="formData.neighborhood"
                type="text"
                placeholder="Nome do bairro"
              />
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="city">Cidade</label>
              <input
                id="city"
                v-model="formData.city"
                type="text"
                placeholder="Nome da cidade"
              />
            </div>
            <div class="form-group">
              <label for="state">Estado/UF</label>
              <input
                id="state"
                v-model="formData.state"
                type="text"
                placeholder="SP, RJ, MG..."
              />
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="zipCode">CEP</label>
              <input
                id="zipCode"
                v-model="formData.zipCode"
                type="text"
                placeholder="00000-000"
                @input="formatZipCode"
              />
            </div>
            <div class="form-group">
              <label for="country">País</label>
              <input
                id="country"
                v-model="formData.country"
                type="text"
                placeholder="Brasil"
              />
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button type="button" @click="closeModal" class="btn-secondary">
            Cancelar
          </button>
          <button type="submit" class="btn-primary">
            {{ isEdit ? 'Atualizar' : 'Criar' }} Usuário
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ModalUserForm',
  props: {
    isEdit: {
      type: Boolean,
      default: false
    },
    user: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      formData: {
        name: '',
        email: '',
        password: '',
        profileImage: '',
        street: '',
        number: '',
        complement: '',
        neighborhood: '',
        city: '',
        state: '',
        zipCode: '',
        country: ''
      }
    }
  },
  watch: {
    user: {
      handler(newUser) {
        if (newUser && Object.keys(newUser).length > 0) {
          this.formData = {
            name: newUser.name || '',
            email: newUser.email || '',
            password: '',
            profileImage: newUser.profileImage || '',
            street: newUser.street || '',
            number: newUser.number || '',
            complement: newUser.complement || '',
            neighborhood: newUser.neighborhood || '',
            city: newUser.city || '',
            state: newUser.state || '',
            zipCode: newUser.zipCode || '',
            country: newUser.country || ''
          }
        } else {
          this.resetForm()
        }
      },
      immediate: true
    }
  },
  methods: {
    formatZipCode() {
      let value = this.formData.zipCode.replace(/\D/g, '')
      if (value.length > 5) {
        value = value.replace(/(\d{5})(\d)/, '$1-$2')
      }
      this.formData.zipCode = value
    },
    resetForm() {
      this.formData = {
        name: '',
        email: '',
        password: '',
        profileImage: '',
        street: '',
        number: '',
        complement: '',
        neighborhood: '',
        city: '',
        state: '',
        zipCode: '',
        country: ''
      }
    },
    closeModal() {
      this.$emit('close')
    },
    submitForm() {
      const userData = { ...this.formData }
      
      // Se for edição e a senha estiver vazia, removê-la
      if (this.isEdit && !userData.password) {
        delete userData.password
      }
      
      this.$emit('submit', userData)
    }
  }
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(8px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  animation: fadeIn 0.3s ease-out;
}

.modal-content {
  background: white;
  border-radius: 20px;
  width: 90%;
  max-width: 700px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.3);
  animation: slideIn 0.3s ease-out;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 30px 30px 20px;
  border-bottom: 1px solid #f0f0f0;
}

.modal-header h2 {
  margin: 0;
  color: #2c3e50;
  font-size: 24px;
  font-weight: 600;
}

.close-button {
  background: none;
  border: none;
  color: #7f8c8d;
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  transition: all 0.2s ease;
}

.close-button:hover {
  background: #f8f9fa;
  color: #e74c3c;
}

.modal-body {
  padding: 30px;
}

.form-section {
  margin-bottom: 40px;
}

.form-section h3 {
  margin: 0 0 20px;
  color: #34495e;
  font-size: 18px;
  font-weight: 600;
  padding-bottom: 10px;
  border-bottom: 2px solid #3498db;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  color: #2c3e50;
  font-weight: 500;
  font-size: 14px;
}

.form-group input {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e9ecef;
  border-radius: 10px;
  font-size: 16px;
  transition: all 0.2s ease;
  box-sizing: border-box;
}

.form-group input:focus {
  outline: none;
  border-color: #3498db;
  box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
}

.form-row {
  display: flex;
  gap: 15px;
}

.form-row .form-group {
  flex: 1;
}

.form-group-small {
  flex: 0 0 120px !important;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 15px;
  padding-top: 30px;
  border-top: 1px solid #f0f0f0;
}

.btn-secondary,
.btn-primary {
  padding: 12px 24px;
  border: none;
  border-radius: 10px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 120px;
}

.btn-secondary {
  background: #f8f9fa;
  color: #6c757d;
}

.btn-secondary:hover {
  background: #e9ecef;
  color: #495057;
}

.btn-primary {
  background: linear-gradient(135deg, #3498db, #2980b9);
  color: white;
}

.btn-primary:hover {
  background: linear-gradient(135deg, #2980b9, #2471a3);
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(52, 152, 219, 0.3);
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-30px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* Responsividade */
@media (max-width: 768px) {
  .modal-content {
    width: 95%;
    margin: 10px;
  }
  
  .modal-header,
  .modal-body {
    padding: 20px;
  }
  
  .form-row {
    flex-direction: column;
    gap: 0;
  }
  
  .form-group-small {
    flex: 1 !important;
  }
}
</style>
