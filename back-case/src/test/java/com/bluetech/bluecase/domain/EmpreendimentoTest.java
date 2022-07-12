package com.bluetech.bluecase.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.bluetech.bluecase.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class EmpreendimentoTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Empreendimento.class);
        Empreendimento empreendimento1 = new Empreendimento();
        empreendimento1.setId(1L);
        Empreendimento empreendimento2 = new Empreendimento();
        empreendimento2.setId(empreendimento1.getId());
        assertThat(empreendimento1).isEqualTo(empreendimento2);
        empreendimento2.setId(2L);
        assertThat(empreendimento1).isNotEqualTo(empreendimento2);
        empreendimento1.setId(null);
        assertThat(empreendimento1).isNotEqualTo(empreendimento2);
    }
}
