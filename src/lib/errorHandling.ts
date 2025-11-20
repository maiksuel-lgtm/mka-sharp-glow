/**
 * Maps database and authentication errors to user-friendly messages
 * Prevents sensitive information leakage to client
 */
export const getClientSafeError = (error: any): string => {
  // Handle Supabase error codes
  if (error?.code) {
    switch (error.code) {
      case '23505':
        return 'Este agendamento já existe';
      case '23503':
        return 'Erro de referência nos dados';
      case '42501':
        return 'Acesso não autorizado';
      case 'PGRST116':
        return 'Nenhum resultado encontrado';
      default:
        break;
    }
  }

  // Handle RLS policy violations
  if (error?.message?.includes('RLS') || error?.message?.includes('policy')) {
    return 'Acesso não autorizado';
  }

  // Handle authentication errors
  if (error?.message?.includes('Invalid login credentials')) {
    return 'Email ou senha incorretos';
  }
  
  if (error?.message?.includes('already registered')) {
    return 'Este email já está cadastrado';
  }

  if (error?.message?.includes('Email not confirmed')) {
    return 'Por favor, confirme seu email antes de fazer login';
  }

  // Default safe message
  return 'Ocorreu um erro. Por favor, tente novamente.';
};
