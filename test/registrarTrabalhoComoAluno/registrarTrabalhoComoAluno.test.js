import { expect } from 'chai';
import { fakerPT_BR as faker } from '@faker-js/faker';
import { api } from '../helpers/api.js';
import { comTokenDeAdmin, loginComoAluno } from '../helpers/auth.js';
import testesDeTrabalhos from '../fixtures/registrarTrabalhoComoAluno.json' with { type: 'json' };

describe('Registrar Entrega de Trabalho como Aluno', () => {
    testesDeTrabalhos.forEach((testeDeTrabalho) => {
        const sufixoUnico = faker.string.numeric(8);
        const aluno = {
            nome: `${testeDeTrabalho.dadosAluno.nomePrefixo} ${faker.person.firstName()}`,
            email: `${testeDeTrabalho.dadosAluno.emailPrefixo}.${sufixoUnico}@example.com`,
            matricula: `${testeDeTrabalho.dadosAluno.matriculaPrefixo}${sufixoUnico}`,
            senha: testeDeTrabalho.dadosAluno.senha
        };

        const disciplina = {
            nome: testeDeTrabalho.dadosDisciplina.nome,
            codigo: `${testeDeTrabalho.dadosDisciplina.codigoPrefixo}${sufixoUnico}`,
            cargaHoraria: testeDeTrabalho.dadosDisciplina.cargaHoraria
        };

        it(testeDeTrabalho.testTitle, async () => {
            const dadosAluno = aluno;

            const cadastroAlunoResposta = await api()
                .post('/api/admin/alunos')
                .set('Content-Type', 'application/json')
                .set('Authorization', await comTokenDeAdmin())
                .send(dadosAluno);
            
            expect(cadastroAlunoResposta.status).to.equal(testeDeTrabalho.statusCodeEsperadoCadastroAluno);
            expect(cadastroAlunoResposta.body).to.have.property('id');
            expect(cadastroAlunoResposta.body.nome).to.equal(dadosAluno.nome);
            expect(cadastroAlunoResposta.body.email).to.equal(dadosAluno.email);
            expect(cadastroAlunoResposta.body.matricula).to.equal(dadosAluno.matricula);
            expect(cadastroAlunoResposta.body).to.not.have.property('senha');

            const alunoId = cadastroAlunoResposta.body.id;

            const cadastroDisciplinaResposta = await api()
                .post('/api/admin/disciplinas')
                .set('Content-Type', 'application/json')
                .set('Authorization', await comTokenDeAdmin())
                .send(disciplina);

            expect(cadastroDisciplinaResposta.status).to.equal(testeDeTrabalho.statusCodeEsperadoCadastroDisciplina);
            const disciplinaId = cadastroDisciplinaResposta.body.id;

            const cadastroMatriculaResposta = await api()
                .post(`/api/admin/disciplinas/${disciplinaId}/matriculas`)
                .set('Content-Type', 'application/json')
                .set('Authorization', await comTokenDeAdmin())
                .send({
                    alunoId: alunoId
                });

            expect(cadastroMatriculaResposta.status).to.equal(testeDeTrabalho.statusCodeEsperadoCadastroMatricula);
            expect(cadastroMatriculaResposta.body.alunoId).to.equal(alunoId);
            expect(cadastroMatriculaResposta.body.disciplinaId).to.equal(disciplinaId);

            const loginResposta = await loginComoAluno(aluno.email, aluno.senha);

            expect(loginResposta.status).to.equal(testeDeTrabalho.statusCodeEsperadoLogin);
            expect(loginResposta.body.usuario.id).to.equal(alunoId);
            expect(loginResposta.body.usuario.role).to.equal('aluno');
            expect(loginResposta.body.token).to.be.a('string');

            const trabalho = {
                disciplinaId: disciplinaId,
                titulo: `${testeDeTrabalho.dadosTrabalho.titulo} ${faker.company.buzzPhrase()}`,
                descricao: testeDeTrabalho.dadosTrabalho.descricao
            };
            
            const cadastroTrabalhoResposta = await api()
                .post(`/api/alunos/${alunoId}/trabalhos`)
                .set('Content-Type', 'application/json')
                .set('Authorization', `Bearer ${loginResposta.body.token}`)
                .send(trabalho);
            
            expect(cadastroTrabalhoResposta.status).to.equal(testeDeTrabalho.statusCodeEsperadoCadastroTrabalho);
            expect(cadastroTrabalhoResposta.body).to.have.property('id');
            expect(cadastroTrabalhoResposta.body.alunoId).to.equal(alunoId);
            expect(cadastroTrabalhoResposta.body.disciplinaId).to.equal(trabalho.disciplinaId);
            expect(cadastroTrabalhoResposta.body.titulo).to.equal(trabalho.titulo);
            expect(cadastroTrabalhoResposta.body.descricao).to.equal(trabalho.descricao);
            expect(cadastroTrabalhoResposta.body.status).to.equal(testeDeTrabalho.statusEsperadoTrabalho);
            expect(cadastroTrabalhoResposta.body.nota).to.equal(null);
            expect(cadastroTrabalhoResposta.body.feedback).to.equal(null);
            expect(cadastroTrabalhoResposta.body).to.have.property('dataEntrega');
        });
    });
});
