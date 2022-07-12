package com.bluetech.bluecase.web.rest;

import com.bluetech.bluecase.domain.Voto;
import com.bluetech.bluecase.repository.VotoRepository;
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
 * REST controller for managing {@link com.bluetech.bluecase.domain.Voto}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class VotoResource {

    private final Logger log = LoggerFactory.getLogger(VotoResource.class);

    private static final String ENTITY_NAME = "voto";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final VotoRepository votoRepository;

    public VotoResource(VotoRepository votoRepository) {
        this.votoRepository = votoRepository;
    }

    /**
     * {@code POST  /votos} : Create a new voto.
     *
     * @param voto the voto to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new voto, or with status {@code 400 (Bad Request)} if the voto has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/votos")
    public ResponseEntity<Voto> createVoto(@RequestBody Voto voto) throws URISyntaxException {
        log.debug("REST request to save Voto : {}", voto);
        if (voto.getId() != null) {
            throw new BadRequestAlertException("A new voto cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Voto result = votoRepository.save(voto);
        return ResponseEntity
            .created(new URI("/api/votos/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /votos/:id} : Updates an existing voto.
     *
     * @param id the id of the voto to save.
     * @param voto the voto to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated voto,
     * or with status {@code 400 (Bad Request)} if the voto is not valid,
     * or with status {@code 500 (Internal Server Error)} if the voto couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/votos/{id}")
    public ResponseEntity<Voto> updateVoto(@PathVariable(value = "id", required = false) final Long id, @RequestBody Voto voto)
        throws URISyntaxException {
        log.debug("REST request to update Voto : {}, {}", id, voto);
        if (voto.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, voto.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!votoRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Voto result = votoRepository.save(voto);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, voto.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /votos/:id} : Partial updates given fields of an existing voto, field will ignore if it is null
     *
     * @param id the id of the voto to save.
     * @param voto the voto to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated voto,
     * or with status {@code 400 (Bad Request)} if the voto is not valid,
     * or with status {@code 404 (Not Found)} if the voto is not found,
     * or with status {@code 500 (Internal Server Error)} if the voto couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/votos/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Voto> partialUpdateVoto(@PathVariable(value = "id", required = false) final Long id, @RequestBody Voto voto)
        throws URISyntaxException {
        log.debug("REST request to partial update Voto partially : {}, {}", id, voto);
        if (voto.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, voto.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!votoRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Voto> result = votoRepository
            .findById(voto.getId())
            .map(existingVoto -> {
                return existingVoto;
            })
            .map(votoRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, voto.getId().toString())
        );
    }

    /**
     * {@code GET  /votos} : get all the votos.
     *
     * @param eagerload flag to eager load entities from relationships (This is applicable for many-to-many).
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of votos in body.
     */
    @GetMapping("/votos")
    public List<Voto> getAllVotos(@RequestParam(required = false, defaultValue = "false") boolean eagerload) {
        log.debug("REST request to get all Votos");
        return votoRepository.findAllWithEagerRelationships();
    }

    /**
     * {@code GET  /votos/:id} : get the "id" voto.
     *
     * @param id the id of the voto to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the voto, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/votos/{id}")
    public ResponseEntity<Voto> getVoto(@PathVariable Long id) {
        log.debug("REST request to get Voto : {}", id);
        Optional<Voto> voto = votoRepository.findOneWithEagerRelationships(id);
        return ResponseUtil.wrapOrNotFound(voto);
    }

    /**
     * {@code DELETE  /votos/:id} : delete the "id" voto.
     *
     * @param id the id of the voto to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/votos/{id}")
    public ResponseEntity<Void> deleteVoto(@PathVariable Long id) {
        log.debug("REST request to delete Voto : {}", id);
        votoRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
