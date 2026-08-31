import request from 'supertest';
import { expect } from 'chai';
import { getToken } from '../helpers/auth.js';


describe('Login', () => {
    let token;

    beforeEach(async () => {
        token = await getToken('admin@escola.com', 'admin123');
    });

    it('deve cadastrar um aluno quando ele informa dados válidos', async () => {
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
            .send({
                nome: 'Wedney Silva',
                email: 'wedney.silva@example.com',
                matricula: '2026-0003',
                senha: '123456'
            });

        // Validar que ele foi cadastrado
        expect(cadastroAlunoResposta.status).to.equal(201);
        expect(cadastroAlunoResposta.body.nome).to.equal('Wedney Silva');
        expect(cadastroAlunoResposta.body.email).to.equal('wedney.silva@example.com');
        expect(cadastroAlunoResposta.body.matricula).to.equal('2026-0003');

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