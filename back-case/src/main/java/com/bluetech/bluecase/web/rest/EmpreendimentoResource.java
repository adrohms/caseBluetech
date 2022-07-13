package com.bluetech.bluecase.web.rest;

import com.bluetech.bluecase.domain.Empreendimento;
import com.bluetech.bluecase.repository.EmpreendimentoRepository;
import com.bluetech.bluecase.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.bluetech.bluecase.domain.Empreendimento}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class EmpreendimentoResource {

    private final Logger log = LoggerFactory.getLogger(EmpreendimentoResource.class);

    private static final String ENTITY_NAME = "empreendimento";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final EmpreendimentoRepository empreendimentoRepository;

    public EmpreendimentoResource(EmpreendimentoRepository empreendimentoRepository) {
        this.empreendimentoRepository = empreendimentoRepository;
    }

    /**
     * {@code POST  /empreendimentos} : Create a new empreendimento.
     *
     * @param empreendimento the empreendimento to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new empreendimento, or with status {@code 400 (Bad Request)} if the empreendimento has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/empreendimentos")
    public ResponseEntity<Empreendimento> createEmpreendimento(@RequestBody Empreendimento empreendimento) throws URISyntaxException {
        log.debug("REST request to save Empreendimento : {}", empreendimento);
        if (empreendimento.getId() != null) {
            throw new BadRequestAlertException("A new empreendimento cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Empreendimento result = empreendimentoRepository.save(empreendimento);
        return ResponseEntity
            .created(new URI("/api/empreendimentos/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /empreendimentos/:id} : Updates an existing empreendimento.
     *
     * @param id the id of the empreendimento to save.
     * @param empreendimento the empreendimento to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated empreendimento,
     * or with status {@code 400 (Bad Request)} if the empreendimento is not valid,
     * or with status {@code 500 (Internal Server Error)} if the empreendimento couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/empreendimentos/{id}")
    public ResponseEntity<Empreendimento> updateEmpreendimento(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Empreendimento empreendimento
    ) throws URISyntaxException {
        log.debug("REST request to update Empreendimento : {}, {}", id, empreendimento);
        if (empreendimento.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, empreendimento.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!empreendimentoRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Empreendimento result = empreendimentoRepository.save(empreendimento);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, empreendimento.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /empreendimentos/:id} : Partial updates given fields of an existing empreendimento, field will ignore if it is null
     *
     * @param id the id of the empreendimento to save.
     * @param empreendimento the empreendimento to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated empreendimento,
     * or with status {@code 400 (Bad Request)} if the empreendimento is not valid,
     * or with status {@code 404 (Not Found)} if the empreendimento is not found,
     * or with status {@code 500 (Internal Server Error)} if the empreendimento couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/empreendimentos/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Empreendimento> partialUpdateEmpreendimento(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Empreendimento empreendimento
    ) throws URISyntaxException {
        log.debug("REST request to partial update Empreendimento partially : {}, {}", id, empreendimento);
        if (empreendimento.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, empreendimento.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!empreendimentoRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Empreendimento> result = empreendimentoRepository
            .findById(empreendimento.getId())
            .map(existingEmpreendimento -> {
                if (empreendimento.getNome() != null) {
                    existingEmpreendimento.setNome(empreendimento.getNome());
                }
                if (empreendimento.getEndereco() != null) {
                    existingEmpreendimento.setEndereco(empreendimento.getEndereco());
                }

                return existingEmpreendimento;
            })
            .map(empreendimentoRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, empreendimento.getId().toString())
        );
    }

    /**
     * {@code GET  /empreendimentos} : get all the empreendimentos.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of empreendimentos in body.
     */
    @GetMapping("/empreendimentos")
    public List<Empreendimento> getAllEmpreendimentos() {
        log.debug("REST request to get all Empreendimentos");
        return empreendimentoRepository.findAll();
    }

    /**
     * {@code GET  /empreendimentos/:id} : get the "id" empreendimento.
     *
     * @param id the id of the empreendimento to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the empreendimento, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/empreendimentos/{id}")
    public ResponseEntity<Empreendimento> getEmpreendimento(@PathVariable Long id) {
        log.debug("REST request to get Empreendimento : {}", id);
        Optional<Empreendimento> empreendimento = empreendimentoRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(empreendimento);
    }

    /**
     * {@code DELETE  /empreendimentos/:id} : delete the "id" empreendimento.
     *
     * @param id the id of the empreendimento to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/empreendimentos/{id}")
    public ResponseEntity<Void> deleteEmpreendimento(@PathVariable Long id) {
        log.debug("REST request to delete Empreendimento : {}", id);
        empreendimentoRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
