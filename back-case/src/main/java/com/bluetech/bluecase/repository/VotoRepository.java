package com.bluetech.bluecase.repository;

import com.bluetech.bluecase.domain.Voto;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Voto entity.
 */
@Repository
public interface VotoRepository extends JpaRepository<Voto, Long> {
    default Optional<Voto> findOneWithEagerRelationships(Long id) {
        return this.findOneWithToOneRelationships(id);
    }

    default List<Voto> findAllWithEagerRelationships() {
        return this.findAllWithToOneRelationships();
    }

    default Page<Voto> findAllWithEagerRelationships(Pageable pageable) {
        return this.findAllWithToOneRelationships(pageable);
    }

    @Query(
        value = "select distinct voto from Voto voto left join fetch voto.nome",
        countQuery = "select count(distinct voto) from Voto voto"
    )
    Page<Voto> findAllWithToOneRelationships(Pageable pageable);

    @Query("select distinct voto from Voto voto left join fetch voto.nome")
    List<Voto> findAllWithToOneRelationships();

    @Query("select voto from Voto voto left join fetch voto.nome where voto.id =:id")
    Optional<Voto> findOneWithToOneRelationships(@Param("id") Long id);
}
