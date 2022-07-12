package com.bluetech.bluecase.domain;

import java.io.Serializable;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Voto.
 */
@Entity
@Table(name = "voto")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Voto implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @OneToOne
    @JoinColumn(unique = true)
    private User firstName;

    @ManyToOne
    private Empreendimento nome;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Voto id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getFirstName() {
        return this.firstName;
    }

    public void setFirstName(User user) {
        this.firstName = user;
    }

    public Voto firstName(User user) {
        this.setFirstName(user);
        return this;
    }

    public Empreendimento getNome() {
        return this.nome;
    }

    public void setNome(Empreendimento empreendimento) {
        this.nome = empreendimento;
    }

    public Voto nome(Empreendimento empreendimento) {
        this.setNome(empreendimento);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Voto)) {
            return false;
        }
        return id != null && id.equals(((Voto) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Voto{" +
            "id=" + getId() +
            "}";
    }
}
