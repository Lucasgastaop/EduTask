export function formatDate(date) {
  if (!date) {
    return 'agora';
  }

  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
  });
}

export function displayNameOf(user) {
  if (user?.displayName?.trim()) {
    return user.displayName.trim();
  }

  const prefix = user?.email?.split('@')[0];
  return prefix || 'aluno';
}
