import request from 'supertest';
import { expect } from 'chai';
import { fakerPT_BR as faker } from '@faker-js/faker';

describe('Exercício', () => {
    it('deve retornar 200 quando o usuário e senha forem corretos', async () => {
        const loginResposta = await request('http://localhost:3000')
            .post('/api/auth/login')
            .set('Content-Type', 'application/json')
            .send({
                email: 'admin@escola.com',
                senha: 'admin123'
            });

        expect(loginResposta.status).to.equal(200);
    });

    it('deve cadastrar um aluno quando ele informa dados válidos', async () => {
        const novoAluno = {
            nome: faker.person.fullName(),
            email: faker.internet.email().toLowerCase(),
            matricula: faker.string.numeric(8),
            senha: '123456'
        };

        // Obter o token
        const loginResposta = await request('http://localhost:3000')
            .post('/api/auth/login')
            .set('Content-Type', 'application/json')
            .send({
                email: 'admin@escola.com',
                senha: 'admin123'
            });

        const token = loginResposta.body.token;

        // Cadastrar o aluno
        const cadastroAlunoResposta = await request('http://localhost:3000')
            .post('/api/admin/alunos')
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .send(novoAluno);

        // Validar que ele foi cadastrado
        expect(cadastroAlunoResposta.status).to.equal(201);
        expect(cadastroAlunoResposta.body.nome).to.equal(novoAluno.nome);
        expect(cadastroAlunoResposta.body.email).to.equal(novoAluno.email);
        expect(cadastroAlunoResposta.body.matricula).to.equal(novoAluno.matricula);
        expect(cadastroAlunoResposta.body).to.not.have.property('senha');
    });

    it('deve retornar todos os alunos cadastrados', async () => {
        // Obter o token
        const loginResposta = await request('http://localhost:3000')
            .post('/api/auth/login')
            .set('Content-Type', 'application/json')
            .send({
                email: 'admin@escola.com',
                senha: 'admin123'
            });

        const token = loginResposta.body.token;

        // Buscar todos os alunos
        const listarAlunosResposta = await request('http://localhost:3000')
            .get('/api/admin/alunos')
            .set('Authorization', `Bearer ${token}`);

        // Validar resposta
        expect(listarAlunosResposta.status).to.equal(200);
        expect(listarAlunosResposta.body).to.be.an('array');
        expect(listarAlunosResposta.body.length).to.be.greaterThan(0);

        // Validar um aluno conhecido da base inicial
        expect(listarAlunosResposta.body[0]).to.have.property('id');
        expect(listarAlunosResposta.body[0]).to.have.property('nome');
        expect(listarAlunosResposta.body[0]).to.have.property('email');
        expect(listarAlunosResposta.body[0]).to.have.property('matricula');
    });


    it('deve deletar o ultimo aluno cadastrado', async () => {
        // Obter o token
        const loginResposta = await request('http://localhost:3000')
            .post('/api/auth/login')
            .set('Content-Type', 'application/json')
            .send({
                email: 'admin@escola.com',
                senha: 'admin123'
            });

        const token = loginResposta.body.token;

        // Listar alunos
        const listarAlunosResposta = await request('http://localhost:3000')
            .get('/api/admin/alunos')
            .set('Authorization', `Bearer ${token}`);

        expect(listarAlunosResposta.status).to.equal(200);
        expect(listarAlunosResposta.body).to.be.an('array');
        expect(listarAlunosResposta.body.length).to.be.greaterThan(0);

        // Pegar o ultimo aluno da lista
        const ultimoAluno = listarAlunosResposta.body[listarAlunosResposta.body.length - 1];

        // Deletar o ultimo aluno
        const deletarAlunoResposta = await request('http://localhost:3000')
            .delete(`/api/admin/alunos/${ultimoAluno.id}`)
            .set('Authorization', `Bearer ${token}`);

        expect(deletarAlunoResposta.status).to.equal(204);
    });
});


