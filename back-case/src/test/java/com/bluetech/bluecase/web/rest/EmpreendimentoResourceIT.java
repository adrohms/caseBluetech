package com.bluetech.bluecase.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.bluetech.bluecase.IntegrationTest;
import com.bluetech.bluecase.domain.Empreendimento;
import com.bluetech.bluecase.repository.EmpreendimentoRepository;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link EmpreendimentoResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class EmpreendimentoResourceIT {

    private static final String DEFAULT_NOME = "AAAAAAAAAA";
    private static final String UPDATED_NOME = "BBBBBBBBBB";

    private static final String DEFAULT_ENDERECO = "AAAAAAAAAA";
    private static final String UPDATED_ENDERECO = "BBBBBBBBBB";

    private static final Integer DEFAULT_QUANTIDADE_DE_VOTOS = 1;
    private static final Integer UPDATED_QUANTIDADE_DE_VOTOS = 2;

    private static final String ENTITY_API_URL = "/api/empreendimentos";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private EmpreendimentoRepository empreendimentoRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restEmpreendimentoMockMvc;

    private Empreendimento empreendimento;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Empreendimento createEntity(EntityManager em) {
        Empreendimento empreendimento = new Empreendimento()
            .nome(DEFAULT_NOME)
            .endereco(DEFAULT_ENDERECO)
            .quantidadeDeVotos(DEFAULT_QUANTIDADE_DE_VOTOS);
        return empreendimento;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Empreendimento createUpdatedEntity(EntityManager em) {
        Empreendimento empreendimento = new Empreendimento()
            .nome(UPDATED_NOME)
            .endereco(UPDATED_ENDERECO)
            .quantidadeDeVotos(UPDATED_QUANTIDADE_DE_VOTOS);
        return empreendimento;
    }

    @BeforeEach
    public void initTest() {
        empreendimento = createEntity(em);
    }

    @Test
    @Transactional
    void createEmpreendimento() throws Exception {
        int databaseSizeBeforeCreate = empreendimentoRepository.findAll().size();
        // Create the Empreendimento
        restEmpreendimentoMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(empreendimento))
            )
            .andExpect(status().isCreated());

        // Validate the Empreendimento in the database
        List<Empreendimento> empreendimentoList = empreendimentoRepository.findAll();
        assertThat(empreendimentoList).hasSize(databaseSizeBeforeCreate + 1);
        Empreendimento testEmpreendimento = empreendimentoList.get(empreendimentoList.size() - 1);
        assertThat(testEmpreendimento.getNome()).isEqualTo(DEFAULT_NOME);
        assertThat(testEmpreendimento.getEndereco()).isEqualTo(DEFAULT_ENDERECO);
        assertThat(testEmpreendimento.getQuantidadeDeVotos()).isEqualTo(DEFAULT_QUANTIDADE_DE_VOTOS);
    }

    @Test
    @Transactional
    void createEmpreendimentoWithExistingId() throws Exception {
        // Create the Empreendimento with an existing ID
        empreendimento.setId(1L);

        int databaseSizeBeforeCreate = empreendimentoRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restEmpreendimentoMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(empreendimento))
            )
            .andExpect(status().isBadRequest());

        // Validate the Empreendimento in the database
        List<Empreendimento> empreendimentoList = empreendimentoRepository.findAll();
        assertThat(empreendimentoList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllEmpreendimentos() throws Exception {
        // Initialize the database
        empreendimentoRepository.saveAndFlush(empreendimento);

        // Get all the empreendimentoList
        restEmpreendimentoMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(empreendimento.getId().intValue())))
            .andExpect(jsonPath("$.[*].nome").value(hasItem(DEFAULT_NOME)))
            .andExpect(jsonPath("$.[*].endereco").value(hasItem(DEFAULT_ENDERECO)))
            .andExpect(jsonPath("$.[*].quantidadeDeVotos").value(hasItem(DEFAULT_QUANTIDADE_DE_VOTOS)));
    }

    @Test
    @Transactional
    void getEmpreendimento() throws Exception {
        // Initialize the database
        empreendimentoRepository.saveAndFlush(empreendimento);

        // Get the empreendimento
        restEmpreendimentoMockMvc
            .perform(get(ENTITY_API_URL_ID, empreendimento.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(empreendimento.getId().intValue()))
            .andExpect(jsonPath("$.nome").value(DEFAULT_NOME))
            .andExpect(jsonPath("$.endereco").value(DEFAULT_ENDERECO))
            .andExpect(jsonPath("$.quantidadeDeVotos").value(DEFAULT_QUANTIDADE_DE_VOTOS));
    }

    @Test
    @Transactional
    void getNonExistingEmpreendimento() throws Exception {
        // Get the empreendimento
        restEmpreendimentoMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewEmpreendimento() throws Exception {
        // Initialize the database
        empreendimentoRepository.saveAndFlush(empreendimento);

        int databaseSizeBeforeUpdate = empreendimentoRepository.findAll().size();

        // Update the empreendimento
        Empreendimento updatedEmpreendimento = empreendimentoRepository.findById(empreendimento.getId()).get();
        // Disconnect from session so that the updates on updatedEmpreendimento are not directly saved in db
        em.detach(updatedEmpreendimento);
        updatedEmpreendimento.nome(UPDATED_NOME).endereco(UPDATED_ENDERECO).quantidadeDeVotos(UPDATED_QUANTIDADE_DE_VOTOS);

        restEmpreendimentoMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedEmpreendimento.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedEmpreendimento))
            )
            .andExpect(status().isOk());

        // Validate the Empreendimento in the database
        List<Empreendimento> empreendimentoList = empreendimentoRepository.findAll();
        assertThat(empreendimentoList).hasSize(databaseSizeBeforeUpdate);
        Empreendimento testEmpreendimento = empreendimentoList.get(empreendimentoList.size() - 1);
        assertThat(testEmpreendimento.getNome()).isEqualTo(UPDATED_NOME);
        assertThat(testEmpreendimento.getEndereco()).isEqualTo(UPDATED_ENDERECO);
        assertThat(testEmpreendimento.getQuantidadeDeVotos()).isEqualTo(UPDATED_QUANTIDADE_DE_VOTOS);
    }

    @Test
    @Transactional
    void putNonExistingEmpreendimento() throws Exception {
        int databaseSizeBeforeUpdate = empreendimentoRepository.findAll().size();
        empreendimento.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restEmpreendimentoMockMvc
            .perform(
                put(ENTITY_API_URL_ID, empreendimento.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(empreendimento))
            )
            .andExpect(status().isBadRequest());

        // Validate the Empreendimento in the database
        List<Empreendimento> empreendimentoList = empreendimentoRepository.findAll();
        assertThat(empreendimentoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchEmpreendimento() throws Exception {
        int databaseSizeBeforeUpdate = empreendimentoRepository.findAll().size();
        empreendimento.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restEmpreendimentoMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(empreendimento))
            )
            .andExpect(status().isBadRequest());

        // Validate the Empreendimento in the database
        List<Empreendimento> empreendimentoList = empreendimentoRepository.findAll();
        assertThat(empreendimentoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamEmpreendimento() throws Exception {
        int databaseSizeBeforeUpdate = empreendimentoRepository.findAll().size();
        empreendimento.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restEmpreendimentoMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(empreendimento)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Empreendimento in the database
        List<Empreendimento> empreendimentoList = empreendimentoRepository.findAll();
        assertThat(empreendimentoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateEmpreendimentoWithPatch() throws Exception {
        // Initialize the database
        empreendimentoRepository.saveAndFlush(empreendimento);

        int databaseSizeBeforeUpdate = empreendimentoRepository.findAll().size();

        // Update the empreendimento using partial update
        Empreendimento partialUpdatedEmpreendimento = new Empreendimento();
        partialUpdatedEmpreendimento.setId(empreendimento.getId());

        partialUpdatedEmpreendimento.nome(UPDATED_NOME).quantidadeDeVotos(UPDATED_QUANTIDADE_DE_VOTOS);

        restEmpreendimentoMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedEmpreendimento.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedEmpreendimento))
            )
            .andExpect(status().isOk());

        // Validate the Empreendimento in the database
        List<Empreendimento> empreendimentoList = empreendimentoRepository.findAll();
        assertThat(empreendimentoList).hasSize(databaseSizeBeforeUpdate);
        Empreendimento testEmpreendimento = empreendimentoList.get(empreendimentoList.size() - 1);
        assertThat(testEmpreendimento.getNome()).isEqualTo(UPDATED_NOME);
        assertThat(testEmpreendimento.getEndereco()).isEqualTo(DEFAULT_ENDERECO);
        assertThat(testEmpreendimento.getQuantidadeDeVotos()).isEqualTo(UPDATED_QUANTIDADE_DE_VOTOS);
    }

    @Test
    @Transactional
    void fullUpdateEmpreendimentoWithPatch() throws Exception {
        // Initialize the database
        empreendimentoRepository.saveAndFlush(empreendimento);

        int databaseSizeBeforeUpdate = empreendimentoRepository.findAll().size();

        // Update the empreendimento using partial update
        Empreendimento partialUpdatedEmpreendimento = new Empreendimento();
        partialUpdatedEmpreendimento.setId(empreendimento.getId());

        partialUpdatedEmpreendimento.nome(UPDATED_NOME).endereco(UPDATED_ENDERECO).quantidadeDeVotos(UPDATED_QUANTIDADE_DE_VOTOS);

        restEmpreendimentoMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedEmpreendimento.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedEmpreendimento))
            )
            .andExpect(status().isOk());

        // Validate the Empreendimento in the database
        List<Empreendimento> empreendimentoList = empreendimentoRepository.findAll();
        assertThat(empreendimentoList).hasSize(databaseSizeBeforeUpdate);
        Empreendimento testEmpreendimento = empreendimentoList.get(empreendimentoList.size() - 1);
        assertThat(testEmpreendimento.getNome()).isEqualTo(UPDATED_NOME);
        assertThat(testEmpreendimento.getEndereco()).isEqualTo(UPDATED_ENDERECO);
        assertThat(testEmpreendimento.getQuantidadeDeVotos()).isEqualTo(UPDATED_QUANTIDADE_DE_VOTOS);
    }

    @Test
    @Transactional
    void patchNonExistingEmpreendimento() throws Exception {
        int databaseSizeBeforeUpdate = empreendimentoRepository.findAll().size();
        empreendimento.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restEmpreendimentoMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, empreendimento.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(empreendimento))
            )
            .andExpect(status().isBadRequest());

        // Validate the Empreendimento in the database
        List<Empreendimento> empreendimentoList = empreendimentoRepository.findAll();
        assertThat(empreendimentoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchEmpreendimento() throws Exception {
        int databaseSizeBeforeUpdate = empreendimentoRepository.findAll().size();
        empreendimento.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restEmpreendimentoMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(empreendimento))
            )
            .andExpect(status().isBadRequest());

        // Validate the Empreendimento in the database
        List<Empreendimento> empreendimentoList = empreendimentoRepository.findAll();
        assertThat(empreendimentoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamEmpreendimento() throws Exception {
        int databaseSizeBeforeUpdate = empreendimentoRepository.findAll().size();
        empreendimento.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restEmpreendimentoMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(empreendimento))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Empreendimento in the database
        List<Empreendimento> empreendimentoList = empreendimentoRepository.findAll();
        assertThat(empreendimentoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteEmpreendimento() throws Exception {
        // Initialize the database
        empreendimentoRepository.saveAndFlush(empreendimento);

        int databaseSizeBeforeDelete = empreendimentoRepository.findAll().size();

        // Delete the empreendimento
        restEmpreendimentoMockMvc
            .perform(delete(ENTITY_API_URL_ID, empreendimento.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Empreendimento> empreendimentoList = empreendimentoRepository.findAll();
        assertThat(empreendimentoList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
