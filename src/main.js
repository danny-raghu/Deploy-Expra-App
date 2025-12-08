import {initJsPsych} from 'jspsych';
import 'jspsych/css/jspsych.css';
import htmlKeyboardResponse from '@jspsych/plugin-html-keyboard-response';
import htmlButtonResponse from '@jspsych/plugin-html-button-response';
import imageButtonResponse from '@jspsych/plugin-image-button-response';
import SurveyTextPlugin from '@jspsych/plugin-survey-text';
import SurveyMultiChoicePlugin from '@jspsych/plugin-survey-multi-choice';
import { JsPsychCoinTask } from './taskplugin.js'
import { JsPsychResponseTask } from './responseplugin.js';

const jsPsych = initJsPsych(
        {on_finish: function() {
        jsPsych.data.displayData();},
         default_iti: 500,
        });

/* create timeline */
var timeline = [];

/* Generate a random number b/w 0 to 1 to allot participant to Cond-1 or Cond-2 */

var condition = Math.random(); // if condition < 0.5 - Cond-1 else Cond-2.

/* define welcome message trial */
    var welcome = {
      type: htmlKeyboardResponse,
      stimulus: "Willkommen zum Experiment. Drücken Sie eine beliebige Taste, um zu beginnen.",
      post_trial_gap: 500
    };
    timeline.push(welcome);

/* define content message trial */
    var content = {
      type: htmlButtonResponse,
      stimulus: `<p><strong>Inhalt des Experiments:</strong></p> 

      <p> Willkommen zu unserem Experiment über intuitive Physik. 
      Wir danken Ihnen für Ihr Interesse und Ihre Bereitschaft, an unserer Studie 
      teilzunehmen. </p>

      <p>Nehmen Sie nur an der Studie teil, wenn Sie mindestens 18 Jahre alt sind und 
      fließende Deutschkenntnisse besitzen.</p>

      <p>Bitte machen Sie nur weiter, wenn Sie an einem <strong>Laptop</strong> oder <strong>Computer</strong> teilnehmen.</p>

      <p>Beantworten Sie die folgenden Fragen bitte in einem Durchgang und versuchen Sie 
      dies in einer ruhigen, ungestörten Umgebung zu tun. 
      Das Experiment dauert etwa 15 Minuten und wird bei einer Teilnahme über SONA 
      mit 0,25 CP vergütet.</p>

      <p>Bitte sprechen Sie nicht mit anderen über das Experiment oder die Ihnen 
      gezeigte Aufgabe.</p>

      <p>Drücken Sie eine beliebige Taste, um fortzufahren.</p>
      `,
      choices: ['Weiter'],
      post_trial_gap: 500
    };
    timeline.push(content);

/* define data policy trial */
    var data_policy = {
      type: htmlButtonResponse,
      stimulus: `<p><strong>Datenschutz:</strong></p> 
      <p><strong>Freiwilligkeit & Rücktritt​</strong></p>
      <p>Die Teilnahme ist freiwillig. 
      Sie können Ihre Teilnahme jederzeit und ohne Angabe von Gründen beenden, 
      ohne dass Ihnen daraus Nachteile entstehen. Bereits erhobene Daten werden in 
      diesem Fall nicht weiterverwendet. Eine Löschung der Daten nach Zustimmung und 
      Durchführung des Experiments ist aufgrund der anonymen Erhebung nicht möglich.​</p>

        <p><strong>Datenschutz</strong> </p> 
      <p> Ihre Angaben werden streng vertraulich behandelt. 
      Die Daten werden ausschließlich in anonymisierter Form gespeichert und ausgewertet, 
      sodass kein Rückschluss auf Ihre Person möglich ist. Nur die Studienleitung hat 
      Zugriff auf die Rohdaten.​ </p>

        <p><strong>Ablauf und Dauer​</strong> </p>
        <p>Die Beantwortung des Fragebogens dauert ca. 15 Minuten. 
        Bitte bearbeiten Sie das folgende Experiment am Stück und achten Sie auf eine 
        Vermeidung von äußeren Ablenkungen.</p>

      <p>Indem Sie auf “weiter” klicken, stimmen Sie der Datenschutzerklärung zu.</p>
      `,
      choices: ['Weiter'],
      post_trial_gap: 500
    };
    timeline.push(data_policy);

/* define instructions trial */
    var instructions = {
      type: htmlButtonResponse,
      stimulus: `<p><strong>Anweisungen</strong></p> 

      <p>Im nächsten Schritt sehen Sie vier leicht unterschiedliche Bilder. </p>

      <p>Zu Beginn sehen Sie ein statisches Bild einer Person, die auf dem Bus steht. 
      Bitte versuchen Sie, sich in die gegebene Position und Situation der Person auf dem 
      Bildschirm zu versetzen. </p>

      <p>Die Person, die auf dem Bus steht, springt senkrecht, circa 30 cm in die Höhe 
      (30 cm = circa die Länge von Ellenbogen bis Fingerspitzen), während der Bus mit einer
       konstanten Geschwindigkeit von 30 km/h fährt. </p>

      <p><strong>Bitte ignorieren Sie den Luftwiderstand</strong>  und versuchen Sie, die 
      folgende Frage richtig zu beantworten. </p>

      <p>Wo werden Sie nach dem Sprung auf dem<strong> Dach des Busses</strong> landen? 
      Schätzen Sie Ihre Landeposition in Bezug auf den <strong>Bus</strong> ein

      <p><i>Bitte benutzen Sie den Schieberegler, um Ihre Antwort zu geben, indem Sie die 
      springende Person an die Stelle bewegen, an der Sie <strong>nach</strong> dem 
      Sprung landen würden, also Ihre geschätzte Landeposition.</i></p>
      
      <p>Das Einzige, was sich bei den verschiedenen Versuchen ändert, ist Ihre 
      Startposition auf dem Bus bevor Sie abspringen. <i>Zwischen den einzelnen Versuchen 
      wird ein schwarzer Bildschirm eingeblendet.</i> </p>     
      `,
      choices: ['Weiter'],
      post_trial_gap: 500
    };

/* define fixation trial */
    var fixation = {
      type: htmlKeyboardResponse,
      stimulus: '<div style="font-size:60px;">+</div>',
      choices: "NO_KEYS",
      trial_duration: 750,
      data: {
        task: 'fixation'
      }
    };

/* Define Presentation-Response Procedure */
    var present_response_procedure = {
    timeline: [
        { type: imageButtonResponse,
          stimulus: jsPsych.timelineVariable('img'),
          stimulus_width: 763,
          data: {
          task: 'presentation'
                },
          choices: ['Weiter']
        },
        fixation,
        { type: JsPsychResponseTask,
          jump_position: jsPsych.timelineVariable('position')
        }
    ],
    timeline_variables: [
        { img: '/Deploy-Expra-App/images/Bus_image_1.png', position: 1 },
        { img: '/Deploy-Expra-App/images/Bus_image_2.png', position: 2 },
        { img: '/Deploy-Expra-App/images/Bus_image_3.png', position: 3 },
        { img: '/Deploy-Expra-App/images/Bus_image_4.png', position: 4 },
    ],
    randomize_order: true,
        }

/* define instructions trial for priming task */
    var priming_instructions = {
      type: htmlButtonResponse,
      stimulus: `<p><strong>Anweisungen:</strong></p> 

      <p>Auf der nächsten Seite sehen Sie eine Landschaft, über der ein Förderband 
      (die horizontale Linie) gespannt wurde. An diesem Förderband ist ein Magnet 
      befestigt, an dessen Ende sich eine Münze befindet. Das Förderband bewegt sich 
      mit einer konstanten Geschwindigkeit (etwa 30 km/h), sodass die Münze und der Magnet 
      mit dieser Geschwindigkeit mitgeführt werden. </p>

      <p>Unter dem Förderband steht eine Schatzbox, in die die Münze fallen soll. </p>

      <p>Sobald Sie die Leertaste drücken, wird die Münze losgelassen, während sich der 
      Magnet weiterhin vorwärts bewegt.</p>

      <p>Sie haben 4 Versuche.</p>

      <p>Sobald Sie die Leertaste drücken, wird die Münze freigegeben. 
      Ihre Aufgabe besteht darin, so viele Münzen wie möglich zu sammeln, 
      indem Sie die Münze im richtigen Moment loslassen, damit sie in der Schatzbox landet. 
      Nutzen Sie das Feedback nach jedem Versuch, um den Zeitpunkt des Loslassens besser zu 
      kalibrieren.</p>
      
      <p>Klicken Sie auf „Weiter“, um fortzufahren.</p>     
      `,
      choices: ['Weiter'],
      post_trial_gap: 500
    };

/* Insert Coin Task Procedure */

    var coin_task_procedure = {
    timeline: [
        {type: JsPsychCoinTask,
         velocity: jsPsych.timelineVariable('velocity')
        },
        
    ],
    timeline_variables: [
        { velocity: 5 },
        { velocity: 5 },
        { velocity: 5 },
        { velocity: 5 },
    ],
    randomize_order: true,
        }

/*Define the Condition allocating steps */
console.log(`Condition value: ${condition}`);

if(condition < 0.5){
  timeline.push(instructions,present_response_procedure,priming_instructions,coin_task_procedure);
}else{
  timeline.push(priming_instructions, coin_task_procedure, instructions, present_response_procedure);
}

/*Define Briefing trial */

    var briefing_instructions = {
      type: htmlButtonResponse,
      stimulus: `<p><strong>Aufklärung des Studienziels</strong></p> 
      
      <p>Worum ging es in der Studie?</p> 

      <p>In dieser Studie wollen wir das Verständnis für fallende Objekte aus sich 
      bewegenden Trägern untersuchen.</p>

      <p>Ein weit verbreitetes Misskonzept ist der “straight-down belief”, eine 
      systematische intuitive Theorie über Bewegung, die mit den fundamentalen 
      Newton'schen Gesetzen nicht vereinbar ist.</p>

      <p>Menschen neigen dazu, zu glauben, dass ein Objekt vertikal herunterfällt, 
      wenn es von einem sich bewegenden Träger fallen gelassen wird und unterhalb des 
      Abwurfpunkts auftreffen soll. Dabei wird nicht berücksichtigt, dass sich das Objekt 
      aufgrund seiner Trägheit mit der Geschwindigkeit des sich bewegenden Trägers 
      zusätzlich zum Fall weiter nach vorne bewegt und somit in einer Parabel fällt.</p>

      <p>Ihre Antworten helfen uns dieses Misskonzept genauer zu verstehen.</p>

      <p>Vielen Dank für Ihre Teilnahme!</p>
      `,
      choices: ['Weiter'],
      post_trial_gap: 500
    };
    timeline.push(briefing_instructions);

/*Define Demographics Trials */

    // Trial for gender (multiple choice)
    var gender_question_trial = {
      type: SurveyMultiChoicePlugin,
      questions: [
        {
          prompt: "Was ist Ihr Geschlecht?",
          options: ['Männlich', 'Weiblich', 'Divers', 'Keine Angabe'],
          name: 'Geschlecht',
          required: true
        }
      ],
      preamble: '<h3>Demografische Informationen</h3><p>Bitte beantworten Sie die folgenden Fragen.</p>'
    };
    timeline.push(gender_question_trial);

    //Trial for age and study course (text)
    var age_study_question_trial = {
        type: SurveyTextPlugin,
        questions: [
                    {
                      prompt: "Wie alt sind Sie?",
                      name: 'Alter', // Use a 'name' to easily identify the data in results
                      placeholder: "Zahl eingeben",
                      required: true
                    },
                    {
                      prompt: "Welchen Studiengang belegen Sie?",
                      name: 'Studiengang', // Use a 'name' to easily identify the data in results
                      placeholder: "Studiengang eingeben",
                      required: true
                    }
                  ],
  preamble: '<h3>Demografische Informationen</h3><p>Bitte beantworten Sie die folgenden Fragen.</p>'
};

timeline.push(age_study_question_trial);

jsPsych.run(timeline);

