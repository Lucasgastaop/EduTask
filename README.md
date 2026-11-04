# CheckPoint 3 - Mobile Application Development (FIAP)

**Curso:** Tecnologia em Desenvolvimento de Sistemas  
**Disciplina:** Mobile Application Development  
**App:** EduTask

## 1. Definição do App

O **EduTask** é um aplicativo mobile desenvolvido em **React Native** com **Expo** e integração ao **Firebase**. O objetivo é organizar a rotina acadêmica em um único painel: tarefas pendentes, avisos com prazo e solicitações de suporte. Cada pessoa autenticada vê e altera somente os próprios registros.

### Funcionalidades

- **Autenticação de usuários:** login e cadastro com e-mail e senha pelo Firebase Authentication. A sessão permanece salva no aparelho e o logout encerra a sessão, desmonta o painel e volta para a tela de entrada.
- **Gerenciamento de tarefas (Firestore):** CRUD completo na coleção `tasks`, com título, descrição, categoria (`Tarefa`, `Aviso` ou `Suporte`) e status (`pendente` ou `concluido`). A listagem usa `onSnapshot` e mostra só os documentos do `uid` logado.
- **Tratamento de exceções:** campos vazios, e-mail inválido, senha curta, senhas diferentes no cadastro, credenciais recusadas pelo Firebase e falhas de leitura ou gravação no Firestore. O retorno aparece em um aviso na tela e em `Alert.alert`.

### Estrutura de pastas

```text
src/
  components/    campos, botões, cartão da tarefa e layout de autenticação
  context/       sessão do usuário (AuthContext)
  navigation/    rotas de login e do painel
  screens/       Login, Cadastro, Home e Criar/Editar
  services/      configuração do Firebase, Auth e CRUD
  utils/         validação, mensagens de erro e formatação
firestore.rules  regras para cada usuário acessar só as próprias tarefas
```

## Como configurar e executar

1. No [Firebase Console](https://console.firebase.google.com), crie um projeto.
2. Em **Authentication > Sign-in method**, ative **E-mail/Senha**.
3. Crie um banco **Cloud Firestore**.
4. Em **Firestore > Regras**, publique o conteúdo de `firestore.rules`.
5. Em **Configurações do projeto > Seus apps**, adicione um app **Web** e copie o objeto de configuração para `src/services/firebaseConfig.js`, no lugar dos valores `COLE_AQUI_...`.
6. Na pasta do projeto:

```bash
npm install
npx expo start
```

Abra no **Expo Go** (Android ou iOS) pelo QR Code. Para uma prova rápida no navegador:

```bash
npm run web
```

A `apiKey` do app cliente fica no código de propósito: o aplicativo precisa dela para falar com o Firebase. Quem protege os dados são as regras do Firestore, que exigem usuário autenticado e `userId` igual ao `uid` da sessão.

### Documento salvo em `tasks`

```json
{
  "userId": "uid do Firebase Auth",
  "title": "Entregar o checkpoint",
  "description": "Publicar o repositório e enviar o link no Teams.",
  "category": "Tarefa",
  "status": "pendente",
  "createdAt": "<timestamp do servidor>",
  "updatedAt": "<timestamp do servidor>"
}
```

A consulta filtra por `userId`. A ordenação da mais recente para a mais antiga acontece na tela, então não é preciso criar índice composto no Firestore.

## 3. Conceitos Utilizados no Projeto

O item 2 do checkpoint é a implementação neste repositório. Abaixo está o que cada parte do código coloca em prática.

### React Native e Expo

- **Componentes funcionais, props e estado:** telas e peças de interface (`View`, `Text`, `TextInput`, `Pressable`, `FlatList`) recebem dados por props. `useState` guarda formulário, filtro, carregamento e mensagens. `useEffect` abre a escuta do Firestore ao entrar na Home e cancela essa escuta na limpeza, inclusive quando a tela some depois do logout.
- **Listas:** a Home renderiza as atividades com `FlatList`. O estado vazio e o carregamento inicial aparecem no próprio painel.
- **Navegação:** `@react-navigation/native-stack` separa dois grupos de rotas. Sem sessão, o app mostra Login e Cadastro. Com sessão, mostra a Home e o formulário de criar ou editar. O `onAuthStateChanged` decide qual grupo fica montado. No logout, `signOut` zera o usuário, o grupo autenticado é desmontado e a lista some da memória junto com a tela.
- **Feedback:** validação antes da chamada de rede, faixa colorida na interface e `Alert.alert` para erro, sucesso e confirmação de exclusão.

### Firebase (Backend-as-a-Service)

- **Firebase Authentication:** `createUserWithEmailAndPassword` cria a conta e `signInWithEmailAndPassword` entra com e-mail e senha. O nome informado no cadastro vai para o perfil com `updateProfile`. No celular, a sessão usa a persistência do AsyncStorage; no navegador, a persistência local do browser. `signOut` encerra a sessão.
- **Cloud Firestore:** a coleção `tasks` guarda um documento por atividade. O campo `userId` liga o documento ao `uid` de quem está logado. Criar usa `addDoc`, alterar dados usa `updateDoc`, concluir ou reabrir também usa `updateDoc`, e excluir usa `deleteDoc`.
- **Escuta em tempo real (`onSnapshot`):** a Home assina a consulta `where('userId', '==', uid)`. Incluir, editar, concluir ou apagar uma tarefa atualiza a lista sem recarregar a tela. O retorno da função `onSnapshot` é o `unsubscribe` chamado no cleanup do `useEffect`.
- **Regras de segurança:** `firestore.rules` impede que um usuário leia ou altere a tarefa de outra conta, e impede trocar o `userId` de um documento existente.

### Tratamento de erros

As chamadas de autenticação e de banco ficam em `try/catch`. Os códigos do Firebase (`auth/invalid-credential`, `auth/email-already-in-use`, `auth/weak-password`, `permission-denied`, `auth/network-request-failed`, entre outros) viram frases em português em `src/utils/firebaseErrors.js`. Se o `firebaseConfig.js` ainda estiver com os valores de exemplo, o app avisa para configurar o projeto em vez de quebrar a tela.
