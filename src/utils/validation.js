const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateAuth({ name, email, password, confirmPassword, isRegister }) {
  const trimmedName = name?.trim() ?? '';
  const trimmedEmail = email?.trim() ?? '';

  if (!trimmedEmail || !password || (isRegister && (!trimmedName || !confirmPassword))) {
    return 'Preencha todos os campos.';
  }

  if (isRegister && trimmedName.length < 2) {
    return 'Informe seu nome completo.';
  }

  if (!EMAIL_PATTERN.test(trimmedEmail)) {
    return 'Informe um e-mail válido.';
  }

  if (password.length < 6) {
    return 'A senha precisa ter pelo menos 6 caracteres.';
  }

  if (isRegister && password !== confirmPassword) {
    return 'As senhas não coincidem.';
  }

  return '';
}

export function validateTask({ title, description, category, status }) {
  if (!title?.trim() || !description?.trim() || !category || !status) {
    return 'Preencha todos os campos.';
  }

  if (title.trim().length > 80) {
    return 'O título pode ter no máximo 80 caracteres.';
  }

  if (description.trim().length > 500) {
    return 'A descrição pode ter no máximo 500 caracteres.';
  }

  return '';
}
