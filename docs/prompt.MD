Prompt 01

Use o servidor MCP do JMeter para criar um teste de performance que irá testar a API de gestão de alunos (veja o Swagger que está na pasta docs). O teste que quero que seja criado é um login com o usuário admin@escola.com e a senha admin123 que irá buscar todas as disciplinas e depois todos as notas. Esse teste deverá ser realizado com 100 usuários virtuais, com ramp up de 20 segundos e com um loop de 5 execuções. O resultado deverá ter o percentil de 95 menor que 1000 milissegundos. Salve o script JMX e execute-o para conseguir verificar os resultados da execução.

---
Prompt 02

Use o servidor MCP do jmeter para alterar o teste login-disciplina-notas.jmx. Quero que o número de usuários virtuais seja de 50, invés de 100. Além disso, quero que após o login você cadastre disciplinas (veja o swagger na pasta docs para entender como cadastrar disciplinas). Essas disciplinas deverão vir de um arquivo CSV com dados ficticios que quero que vc crie. O loop rodará apenas uma vez invés de 5. Vamos preservar o percential de 95 menor que 1000 milissegundos.

---
Prompt 03

❯ Use o plugin do navegador do Chrome para navegar para http://localhost:3001 e fazer login com admin@escola.com e senha admin123. Depois disso, clique em Disciplinas e acesse o link de alunos da disciplina PRW201. O objetivo é identificar todas as requests enviadas do front end para o backend for frontend dessa aplicação e depois usar o servidor MCP do jmeter para criar um plano de testes de performance com 100 usuários virtuais, com ramp up de 20 segundo e apenas 1 loop. Usaremos um user think time randomico com tempo constante de 50ms e aleatório de até 200ms. Depois da criação do script JMX, execute-o e verifique se o percentil de 95 é menor ou igual a 1000ms.