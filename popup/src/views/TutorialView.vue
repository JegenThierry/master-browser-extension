<template>
  <main class="relative w-full h-full overflow-hidden">
    <div
      v-if="tutorialStepBaseline == 0"
      class="relative bg-white rounded-md shadow-md p-4 flex flex-col gap-y-2 h-full z-10 overflow-auto text-sm"
    >
      <h2 class="font-bold text-lg text-indigo-700">Navigation</h2>
      <p>
        Die Browsererweiterung bietet verschiedene Menüpunkte an. Mit nur einem Klick auf eines der
        verschiedenen Symbole in der unteren Leiste können Sie die Ansicht schnell und einfach
        ändern.
      </p>
      <ul class="flex flex-col gap-y-2">
        <li class="pt-2 border-t font-bold">Medienintermediär's Liste</li>
        <li class="flex gap-2">
          <VueMaterialIcon
            class="w-6 h-6 min-w-[1.5rem] min-h-[1.5rem] text-indigo-700"
            :icon="mdiViewListOutline"
          />
          <span>
            Diese Option bietet eine Liste verschiedener Medienintermediäre, die von unserer
            Erweiterung unterstützt werden. Sie können einen Medienintermediär auswählen, um eine
            Aufgabe zu starten. Jeder Medienintermediär verfügt über eine Liste von Unterseiten,
            denen bereits Transparenzinformationen zugeordnet sind. Sie haben jedoch auch die
            Möglichkeit, nach weiteren Medienintermediären zu suchen.
          </span>
        </li>

        <li class="flex gap-2">
          <img class="w-full h-auto pl-4" src="/src/assets/tutorial/step1/TaskProgress.png" />
        </li>

        <li class="pt-2 border-t font-bold">Aufgabenfortschritt</li>
        <li class="flex gap-2">
          <VueMaterialIcon
            class="w-6 h-6 min-w-[1.5rem] min-h-[1.5rem] text-indigo-700"
            :icon="mdiCheckboxMarkedCircleAutoOutline"
          />
          <span>
            Auf dieser Seite werden sämtliche Fortschritte der aktuellen Aufgabe aufgelistet. Die
            Anzeige variiert je nach der Art der aktiven Aufgabe. Jede Aufgabe muss in diesem
            Menüpunkt entweder abgeschlossen oder abgebrochen werden.
          </span>
        </li>

        <li class="flex gap-2">
          <img class="w-full h-auto pl-4" src="/src/assets/tutorial/step1/ListTask.png" />
        </li>

        <li class="pt-2 border-t font-bold">Einstellungen</li>
        <li class="flex gap-2">
          <VueMaterialIcon
            class="w-6 h-6 min-w-[1.5rem] min-h-[1.5rem] text-indigo-700"
            :icon="mdiCog"
          />
          <span>
            Die Einstellungsseite ermöglicht es Ihnen, das Tutorial erneut zu lesen, das Impressum
            einzusehen oder die Studie vorzeitig zu beenden.
          </span>
        </li>
      </ul>
      <div class="flex w-full ml-auto mt-auto pt-2 border-t">
        <button @click="nextTutorial()" class="ml-auto btn btn-primary">Weiter</button>
      </div>
    </div>

    <div
      v-if="tutorialStepBaseline == 1"
      class="relative bg-white rounded-md shadow-md p-4 flex flex-col gap-y-2 h-full z-10 overflow-auto text-sm"
    >
      <h2 class="font-bold text-lg text-indigo-700">Aufgaben</h2>
      <p>
        In der folgenden Einführung bieten wir eine umfassende Liste von Aufgaben an und erläutern
        kurz das Ziel jeder einzelnen Aufgabe.
      </p>
      <ul class="flex flex-col gap-y-2">
        <li class="pt-2 border-t font-bold">Markieraufgabe</li>
        <li>
          Abgekürzt als <span class="font-bold">MA</span> hat diese Aufgabe das Ziel, alle gut oder
          schlecht formulierten Textstellen zu markieren. Gut formulierte Textstellen sind solche,
          bei denen Sie den Eindruck haben, dass sie besonders einfach verständlich sind. Schlecht
          formulierte Textstellen hingegen sind solche, die für Sie besonders schwer bis überhaupt
          nicht verständlich sind.
        </li>
        <li>
          Um eine <span class="font-bold">Markieraufgabe</span> zu starten, müssen Sie sich auf
          einer unterstützten Medienintermediär-Seite befinden. Dort können Sie in einer Auswahlbox
          die Option 'Markieren' auswählen.
        </li>
        <li><img class="w-full h-auto" src="/src/assets/tutorial/step2/AufgabeSelektion.png" /></li>
        <li>
          Um Markierungen zu erstellen, können Sie eine beliebige Textstelle markieren und mit einem
          Rechtsklick diesen Text als gut oder schlecht formuliert markieren.
        </li>

        <li class="pt-2 border-t font-bold">Bewerten</li>
        <li>
          Abgekürzt als <span class="font-bold">RA</span> hat diese Aufgabe das Ziel, bereits
          existierende Markierungen zu bewerten.
        </li>
        <li>
          Um eine <span class="font-bold">Bewertungsaufgabe</span> zu starten, müssen Sie sich auf
          einer unterstützten Medienintermediär-Seite befinden. Dort können Sie in einer Auswahlbox
          die Option 'Bewerten' auswählen.
        </li>
        <li>
          Um Textstellen zu bewerten, können Sie eine vorhandene Markierung anklicken und dort eine
          Bewertung abgeben.
        </li>
        <li>
          <img class="w-full h-auto" src="/src/assets/tutorial/step2/Bewerten.png" />
        </li>

        <li class="pt-2 border-t font-bold">Semantisch (finden)</li>
        <li>
          Abgekürzt als <span class="font-bold">SE</span> hat diese Aufgabe das Ziel, zu prüfen ob
          ein Gewisser Begriff auf der Seite vorkommt.
        </li>
        <li>
          Um eine <span class="font-bold">Semantisch (finden)</span> zu starten, müssen Sie sich auf
          einer unterstützten Medienintermediär-Seite befinden. Dort können Sie in einer Auswahlbox
          die Option 'Semantisch (finden)' auswählen.
        </li>
        <li>
          Sie müssen genau eine Textstelle markieren, die zu dem Begriff passt. Sollte keine Stelle
          zu dem Begriff passen, können Sie die Aufgabe ohne markierte Stelle abgeben.
        </li>

        <li class="pt-2 border-t font-bold">Semantisch (markieren)</li>
        <li>
          Abgekürzt als <span class="font-bold">SE</span> hat diese Aufgabe das Ziel, alle vorkommen
          die zu einem gegebnem Begriff passen zu markieren.
        </li>
        <li>
          Um eine <span class="font-bold">Semantisch (markieren)</span> zu starten, müssen Sie sich
          auf einer unterstützten Medienintermediär-Seite befinden. Dort können Sie in einer
          Auswahlbox die Option 'Semantisch (markieren)' auswählen.
        </li>
      </ul>
      <div class="flex w-full ml-auto mt-auto pt-2 border-t">
        <button @click="goBack()" class="ml-auto btn btn-ghost">Zurück</button>
        <button @click="nextTutorial()" class="ml-auto btn btn-primary">Abschließen</button>
      </div>
    </div>

    <div class="absolute w-full h-full z-0 -top-1/4 left-1/2 opacity-75 -rotate-45">
      <VueSquigglyShape />
    </div>

    <div class="absolute w-full h-full z-0 -bottom-3/5 -left-1/4 opacity-75">
      <VueSquigglyShape />
    </div>
  </main>
</template>
<script setup lang="ts">
import VueMaterialIcon from '@/components/VueMaterialIcon.vue';
import VueSquigglyShape from '@/components/shapes/VueSquigglyShape.vue';
import { mdiCog, mdiCheckboxMarkedCircleAutoOutline, mdiViewListOutline } from '@mdi/js';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const tutorialStepBaseline = ref<number>(0);
const router = useRouter();

function nextTutorial() {
  if (tutorialStepBaseline.value == 1) {
    router.push('/locations');
    return;
  }
  tutorialStepBaseline.value = tutorialStepBaseline.value + 1;
}

function goBack() {
  tutorialStepBaseline.value = tutorialStepBaseline.value - 1;
}
</script>
