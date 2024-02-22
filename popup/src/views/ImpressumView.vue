<template>
  <div class="flex flex-col gap-y-2 p-4 pb-20">
    <h1 class="py-2 text-lg">Impressum</h1>
    <h2>Verantwortlicher Dienstanbieter</h2>
    <p>Für die Inhal der Domain {{ GAME_URL }} ist aus Sicht des § 5 TMG verantwortlich:</p>
    <address>
      <strong>Deutsches Forschungszentrum für Künstliche Intelligenz GmbH (DFKI)</strong><br />
      Geschäftsführung: Prof. Dr. Antonio Krüger, Helmut Ditzer<br />
      Trippstadter Str. 122<br />
      67663 Kaiserslautern<br />
      Tel.: +49 631 20575 0<br />
      Fax: +49 631 20575 5030<br />
      Email: <a href="mailto:info@dfki.de">info@dfki.de</a><br /><br />

      Registergericht: Amtsgericht Kaiserslautern<br />
      Registernummer: HRB 2313<br /><br />

      ID-Nummer: DE 148 646 973
    </address>
    <p>
      Studienleiter ist: <strong>Thierry Jegen</strong> Kontakt:
      <strong>thierryjegen@gmail.com</strong>
    </p>
    <h2>Rechtliche Hinweise zu dem Datenschutz</h2>
    <p>
      Alle Datenschutz relevanten informationen sind in dem zur verfügung gestelltem Dokument
      Studieninformationen und Datenschutz hinterlegt.
    </p>
    <h2>Rechtliche Hinweise zum Urheberrecht</h2>
    <p>Alle beigelegten Assets sind selbst generiert, oder wurden mit KI tools generiert.</p>
  </div>
</template>

<script setup lang="ts">
import { GAME_URL } from '@/models/constants';
</script>
