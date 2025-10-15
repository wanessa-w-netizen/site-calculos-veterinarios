// Sistema de autenticação simples para demonstração
// Em produção, usar um sistema de autenticação real como NextAuth.js

export interface User {
  name: string;
  email: string;
  password: string;
  createdAt: string;
}

// Simulação de banco de dados de usuários
const USERS_DB = new Map<string, User>();

// Funções de autenticação
export const authService = {
  // Registrar novo usuário
  register: async (name: string, email: string, password: string): Promise<{ success: boolean; message: string }> => {
    // Verificar se usuário já existe
    if (USERS_DB.has(email)) {
      return { success: false, message: 'Este email já está cadastrado. Faça login ou use outro email.' };
    }

    // Validações básicas
    if (!name.trim() || !email.trim() || !password.trim()) {
      return { success: false, message: 'Todos os campos são obrigatórios.' };
    }

    if (password.length < 6) {
      return { success: false, message: 'A senha deve ter pelo menos 6 caracteres.' };
    }

    // Criar novo usuário
    const newUser: User = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password,
      createdAt: new Date().toISOString()
    };

    USERS_DB.set(email.trim().toLowerCase(), newUser);
    return { success: true, message: 'Cadastro realizado com sucesso! Você pode fazer login agora.' };
  },

  // Fazer login
  login: async (email: string, password: string): Promise<{ success: boolean; message: string; user?: User }> => {
    // Validações básicas
    if (!email.trim() || !password.trim()) {
      return { success: false, message: 'Email e senha são obrigatórios.' };
    }

    const normalizedEmail = email.trim().toLowerCase();
    const user = USERS_DB.get(normalizedEmail);
    
    if (!user) {
      return { success: false, message: 'Usuário não encontrado. Você precisa se cadastrar primeiro.' };
    }

    if (user.password !== password) {
      return { success: false, message: 'Senha incorreta. Verifique suas credenciais.' };
    }

    return { success: true, message: 'Login realizado com sucesso!', user };
  },

  // Verificar se usuário está autenticado
  isAuthenticated: (): boolean => {
    if (typeof window === 'undefined') return false;
    
    const isAuth = localStorage.getItem('isAuthenticated') === 'true';
    const email = localStorage.getItem('userEmail');
    const name = localStorage.getItem('userName');
    
    // Verificação mais rigorosa - todos os dados devem estar presentes
    return isAuth && !!email && !!name;
  },

  // Obter dados do usuário atual
  getCurrentUser: (): { name: string; email: string } | null => {
    if (typeof window === 'undefined') return null;
    
    const isAuth = localStorage.getItem('isAuthenticated') === 'true';
    const name = localStorage.getItem('userName');
    const email = localStorage.getItem('userEmail');
    
    if (!isAuth || !name || !email) return null;
    
    return { name, email };
  },

  // Fazer logout
  logout: (): void => {
    if (typeof window === 'undefined') return;
    
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userName');
  },

  // Salvar sessão do usuário
  saveSession: (user: User): void => {
    if (typeof window === 'undefined') return;
    
    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('userEmail', user.email);
    localStorage.setItem('userName', user.name);
  },

  // Verificar se usuário existe (para validação)
  userExists: (email: string): boolean => {
    return USERS_DB.has(email.trim().toLowerCase());
  },

  // Limpar todos os dados (para desenvolvimento)
  clearAllData: (): void => {
    USERS_DB.clear();
    if (typeof window !== 'undefined') {
      localStorage.removeItem('isAuthenticated');
      localStorage.removeItem('userEmail');
      localStorage.removeItem('userName');
    }
  }
};