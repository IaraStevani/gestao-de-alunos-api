import request from 'supertest';
import { expect } from 'chai';
import { getToken } from '../helpers/auth.js';
import { fakerPT_BR as faker } from '@faker-js/faker';

describe('Login', () => {
    let token;

    beforeEach(async () => {
        token = await getToken('admin@escola.com', 'admin123');
    });

    it('deve cadastrar um aluno quando ele informa dados válidos', async () => {
        const novoAluno = {
            nome: faker.person.fullName(),
            email: faker.internet.email().toLowerCase(),
            matricula: faker.string.numeric(8),
            senha: '123456'
        };

        const cadastroAlunoResposta = await request('http://localhost:3000')
            .post('/api/admin/alunos')
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .send(novoAluno);

        expect(cadastroAlunoResposta.status).to.equal(201);
        expect(cadastroAlunoResposta.body.nome).to.equal(novoAluno.nome);
        expect(cadastroAlunoResposta.body.email).to.equal(novoAluno.email);
        expect(cadastroAlunoResposta.body.matricula).to.equal(novoAluno.matricula);
        expect(cadastroAlunoResposta.body).to.not.have.property('senha');
    });

    it('deve negar o cadastro de um aluno quando ele já existe', async () => {
        const cadastroAlunoResposta = await request('http://localhost:3000')
            .post('/api/admin/alunos')
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .send({
                nome: 'Ana Souza',
                email: 'ana.souza@example.com',
                matricula: '2024001',
                senha: '123456'
            });
    });
});