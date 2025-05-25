export const passwordResetEmail = (resetLink: string) => `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <title>Redefinição de Senha</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f5f5f5;
      padding: 20px;
      color: #333;
    }
    .container {
      background-color: #ffffff;
      padding: 20px;
      max-width: 600px;
      margin: auto;
      border: 1px solid #ddd;
    }
    .btn {
      display: inline-block;
      padding: 10px 20px;
      background-color: #007bff;
      color: #fff;
      text-decoration: none;
      border-radius: 4px;
    }
    .footer {
      margin-top: 30px;
      font-size: 12px;
      color: #777;
    }
  </style>
</head>
<body>
  <div class="container">
    <h2>Redefinição de Senha</h2>
    <p>Olá,</p>
    <p>Recebemos uma solicitação para redefinir a senha da sua conta. Se você foi quem solicitou, clique no botão abaixo para criar uma nova senha:</p>
    <p style="text-align: center;">
      <a href="${resetLink}" class="btn">Redefinir Senha</a>
    </p>
    <p>Se você não solicitou essa alteração, ignore este e-mail. Sua senha atual continuará funcionando.</p>
    <div class="footer">
      <p>Este é um e-mail automático. Não responda a esta mensagem.</p>
    </div>
  </div>
</body>
</html>
`
