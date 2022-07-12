package com.bluetech.bluecase.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.bluetech.bluecase.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class VotoTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Voto.class);
        Voto voto1 = new Voto();
        voto1.setId(1L);
        Voto voto2 = new Voto();
        voto2.setId(voto1.getId());
        assertThat(voto1).isEqualTo(voto2);
        voto2.setId(2L);
        assertThat(voto1).isNotEqualTo(voto2);
        voto1.setId(null);
        assertThat(voto1).isNotEqualTo(voto2);
    }
}
