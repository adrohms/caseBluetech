package com.bluetech.bluecase.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.bluetech.bluecase.IntegrationTest;
import com.bluetech.bluecase.domain.Voto;
import com.bluetech.bluecase.repository.VotoRepository;
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
 * Integration tests for the {@link VotoResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class VotoResourceIT {

    private static final String ENTITY_API_URL = "/api/votos";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private VotoRepository votoRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restVotoMockMvc;

    private Voto voto;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Voto createEntity(EntityManager em) {
        Voto voto = new Voto();
        return voto;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Voto createUpdatedEntity(EntityManager em) {
        Voto voto = new Voto();
        return voto;
    }

    @BeforeEach
    public void initTest() {
        voto = createEntity(em);
    }

    @Test
    @Transactional
    void createVoto() throws Exception {
        int databaseSizeBeforeCreate = votoRepository.findAll().size();
        // Create the Voto
        restVotoMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(voto)))
            .andExpect(status().isCreated());

        // Validate the Voto in the database
        List<Voto> votoList = votoRepository.findAll();
        assertThat(votoList).hasSize(databaseSizeBeforeCreate + 1);
        Voto testVoto = votoList.get(votoList.size() - 1);
    }

    @Test
    @Transactional
    void createVotoWithExistingId() throws Exception {
        // Create the Voto with an existing ID
        voto.setId(1L);

        int databaseSizeBeforeCreate = votoRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restVotoMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(voto)))
            .andExpect(status().isBadRequest());

        // Validate the Voto in the database
        List<Voto> votoList = votoRepository.findAll();
        assertThat(votoList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllVotos() throws Exception {
        // Initialize the database
        votoRepository.saveAndFlush(voto);

        // Get all the votoList
        restVotoMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(voto.getId().intValue())));
    }

    @Test
    @Transactional
    void getVoto() throws Exception {
        // Initialize the database
        votoRepository.saveAndFlush(voto);

        // Get the voto
        restVotoMockMvc
            .perform(get(ENTITY_API_URL_ID, voto.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(voto.getId().intValue()));
    }

    @Test
    @Transactional
    void getNonExistingVoto() throws Exception {
        // Get the voto
        restVotoMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewVoto() throws Exception {
        // Initialize the database
        votoRepository.saveAndFlush(voto);

        int databaseSizeBeforeUpdate = votoRepository.findAll().size();

        // Update the voto
        Voto updatedVoto = votoRepository.findById(voto.getId()).get();
        // Disconnect from session so that the updates on updatedVoto are not directly saved in db
        em.detach(updatedVoto);

        restVotoMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedVoto.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedVoto))
            )
            .andExpect(status().isOk());

        // Validate the Voto in the database
        List<Voto> votoList = votoRepository.findAll();
        assertThat(votoList).hasSize(databaseSizeBeforeUpdate);
        Voto testVoto = votoList.get(votoList.size() - 1);
    }

    @Test
    @Transactional
    void putNonExistingVoto() throws Exception {
        int databaseSizeBeforeUpdate = votoRepository.findAll().size();
        voto.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restVotoMockMvc
            .perform(
                put(ENTITY_API_URL_ID, voto.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(voto))
            )
            .andExpect(status().isBadRequest());

        // Validate the Voto in the database
        List<Voto> votoList = votoRepository.findAll();
        assertThat(votoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchVoto() throws Exception {
        int databaseSizeBeforeUpdate = votoRepository.findAll().size();
        voto.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restVotoMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(voto))
            )
            .andExpect(status().isBadRequest());

        // Validate the Voto in the database
        List<Voto> votoList = votoRepository.findAll();
        assertThat(votoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamVoto() throws Exception {
        int databaseSizeBeforeUpdate = votoRepository.findAll().size();
        voto.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restVotoMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(voto)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Voto in the database
        List<Voto> votoList = votoRepository.findAll();
        assertThat(votoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateVotoWithPatch() throws Exception {
        // Initialize the database
        votoRepository.saveAndFlush(voto);

        int databaseSizeBeforeUpdate = votoRepository.findAll().size();

        // Update the voto using partial update
        Voto partialUpdatedVoto = new Voto();
        partialUpdatedVoto.setId(voto.getId());

        restVotoMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedVoto.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedVoto))
            )
            .andExpect(status().isOk());

        // Validate the Voto in the database
        List<Voto> votoList = votoRepository.findAll();
        assertThat(votoList).hasSize(databaseSizeBeforeUpdate);
        Voto testVoto = votoList.get(votoList.size() - 1);
    }

    @Test
    @Transactional
    void fullUpdateVotoWithPatch() throws Exception {
        // Initialize the database
        votoRepository.saveAndFlush(voto);

        int databaseSizeBeforeUpdate = votoRepository.findAll().size();

        // Update the voto using partial update
        Voto partialUpdatedVoto = new Voto();
        partialUpdatedVoto.setId(voto.getId());

        restVotoMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedVoto.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedVoto))
            )
            .andExpect(status().isOk());

        // Validate the Voto in the database
        List<Voto> votoList = votoRepository.findAll();
        assertThat(votoList).hasSize(databaseSizeBeforeUpdate);
        Voto testVoto = votoList.get(votoList.size() - 1);
    }

    @Test
    @Transactional
    void patchNonExistingVoto() throws Exception {
        int databaseSizeBeforeUpdate = votoRepository.findAll().size();
        voto.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restVotoMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, voto.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(voto))
            )
            .andExpect(status().isBadRequest());

        // Validate the Voto in the database
        List<Voto> votoList = votoRepository.findAll();
        assertThat(votoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchVoto() throws Exception {
        int databaseSizeBeforeUpdate = votoRepository.findAll().size();
        voto.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restVotoMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(voto))
            )
            .andExpect(status().isBadRequest());

        // Validate the Voto in the database
        List<Voto> votoList = votoRepository.findAll();
        assertThat(votoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamVoto() throws Exception {
        int databaseSizeBeforeUpdate = votoRepository.findAll().size();
        voto.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restVotoMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(voto)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Voto in the database
        List<Voto> votoList = votoRepository.findAll();
        assertThat(votoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteVoto() throws Exception {
        // Initialize the database
        votoRepository.saveAndFlush(voto);

        int databaseSizeBeforeDelete = votoRepository.findAll().size();

        // Delete the voto
        restVotoMockMvc
            .perform(delete(ENTITY_API_URL_ID, voto.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Voto> votoList = votoRepository.findAll();
        assertThat(votoList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
