package com.bluetech.bluecase.repository;

import com.bluetech.bluecase.domain.Empreendimento;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Empreendimento entity.
 */
@SuppressWarnings("unused")
@Repository
public interface EmpreendimentoRepository extends JpaRepository<Empreendimento, Long> {}
