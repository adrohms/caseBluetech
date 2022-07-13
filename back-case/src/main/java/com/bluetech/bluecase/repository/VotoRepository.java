package com.bluetech.bluecase.repository;

import com.bluetech.bluecase.domain.Voto;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Voto entity.
 */
@SuppressWarnings("unused")
@Repository
public interface VotoRepository extends JpaRepository<Voto, Long> {}
