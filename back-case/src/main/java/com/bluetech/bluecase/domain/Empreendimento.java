package com.bluetech.bluecase.domain;

import java.io.Serializable;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Empreendimento.
 */
@Entity
@Table(name = "empreendimento")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Empreendimento implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "nome")
    private String nome;

    @Column(name = "endereco")
    private String endereco;

    @Column(name = "quantidade_de_votos")
    private Integer quantidadeDeVotos;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Empreendimento id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNome() {
        return this.nome;
    }

    public Empreendimento nome(String nome) {
        this.setNome(nome);
        return this;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getEndereco() {
        return this.endereco;
    }

    public Empreendimento endereco(String endereco) {
        this.setEndereco(endereco);
        return this;
    }

    public void setEndereco(String endereco) {
        this.endereco = endereco;
    }

    public Integer getQuantidadeDeVotos() {
        return this.quantidadeDeVotos;
    }

    public Empreendimento quantidadeDeVotos(Integer quantidadeDeVotos) {
        this.setQuantidadeDeVotos(quantidadeDeVotos);
        return this;
    }

    public void setQuantidadeDeVotos(Integer quantidadeDeVotos) {
        this.quantidadeDeVotos = quantidadeDeVotos;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Empreendimento)) {
            return false;
        }
        return id != null && id.equals(((Empreendimento) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Empreendimento{" +
            "id=" + getId() +
            ", nome='" + getNome() + "'" +
            ", endereco='" + getEndereco() + "'" +
            ", quantidadeDeVotos=" + getQuantidadeDeVotos() +
            "}";
    }
}
