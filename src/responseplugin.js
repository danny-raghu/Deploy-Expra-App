import { JsPsych, ParameterType} from 'jspsych';
import { Application, Assets, Sprite, Graphics, Text} from 'pixi.js';


export var JsPsychResponseTask = (function (jspsych) {
  "use strict";

  const info = {
    name: "{response-task}",
    version: "1.0.0", // When working in a Javascript environment with no build, you will need to manually put set the version information. This is used for metadata purposes and publishing.
    parameters: {
      /* Parameter which defines where the jumper has to be relative to the end of Bus - 4 options [1,2,3,4] */
      jump_position: {
        type: jspsych.ParameterType.INT,
        default: undefined,
      },
    },
    data: {
      /** Provide a clear description of the data1 that could be used as documentation. We will eventually use these comments to automatically build documentation and produce metadata. */
      data1: {
        type: ParameterType.FLOAT,
      },
      /** Provide a clear description of the data2 that could be used as documentation. We will eventually use these comments to automatically build documentation and produce metadata. */
      data2: {
        type: ParameterType.STRING,
      },
    },
  };

  /**
   * **{Dhanaraaj Raghuveer}**
   *
   * {Coin Task for Intuitive Physics experiment}
   *
   * @author {Dhanaraaj Raghuveer}
   * @see {@link {-}}
   */
  class ResponseTaskPlugin {

    constructor(jsPsych) {
      this.jsPsych = jsPsych;
    }

    trial(display_element, trial) {

        //Create a function to make the submit button of the response task
        function createSubmitButton(x, y, labelText) {
            //Create the button shape using PIXI.Graphics
            const button = new Graphics();
            const buttonWidth = 100;
            const buttonHeight = 40;
            const cornerRadius = 10;
            const buttonColor = 0x66CCFF;

            // Draw the default state
            button
                .roundRect(0, 0, buttonWidth, buttonHeight, cornerRadius)
                .fill(buttonColor);

            // B. Add the text label
            const text = new Text({
                text: labelText,
                style: {
                    fill: '#ffffff',
                    fontSize: 14,
                    fontWeight: 'bold',
                }
            });

            // Center the text within the button
            text.anchor.set(0.5);
            text.x = buttonWidth / 2;
            text.y = buttonHeight / 2;

            // Add text to the button (button becomes a container for the text)
            button.addChild(text);

            // C. Position the button
            button.x = x;
            button.y = y;

            // D. Enable Interactivity
            button.eventMode = 'static'; // Required to enable events
            button.cursor = 'pointer';   // Changes the cursor to a hand on hover

            return button;
        }

        const app = new Application();

        app.init({background: 'ffffff', resizeTo: window}).then(() => {
            display_element.appendChild(app.canvas);
            //app.canvas.style.position = 'absolute';
                });

        const assetsToLoad = [
                                 '/images/Bus.png',
                                 '/images/Jumping_down.png',
                              ];

        Assets.load(assetsToLoad).then((loadedAssets) => {
                  // This function runs only after ALL assets are fully loaded
                  // You can access assets in the returned object using their full URL as the key
                  const bus_texture = loadedAssets['/images/Bus.png'];
                  const jump_texture = loadedAssets['/images/Jumping_down.png'];
                  
        
                  const bus = new Sprite(bus_texture);
                  const jump = new Sprite(jump_texture);

                  const stageHeight = app.screen.height;
                  const stageWidth = app.screen.width;

                  bus.scale.set(0.47,0.55);//original: 1388*652
                  jump.scale.set(0.2,0.2)//original: 570*433

                  bus.x = stageWidth/2 - bus.width/2;
                  bus.y = stageHeight/2 - bus.height/2;

                  //Position the jumper according to the presentation_trial's image
                  if(trial.jump_position == 1){
                    jump.x = bus.x + 0.05*bus.width;
                  }else if(trial.jump_position == 2){
                    jump.x = bus.x + 0.25*bus.width;
                  }else if(trial.jump_position == 3){
                    jump.x = bus.x + 0.35*bus.width;
                  }else if(trial.jump_position == 4){
                    jump.x = bus.x + 0.65*bus.width;
                  }

                  jump.y = bus.y;

                  app.stage.addChild(bus);
                  app.stage.addChild(jump);

                  const marker = new Graphics()
                                  .rect(jump.x + jump.width/2, jump.y + jump.height, 5, 5)
                                  .fill({
                                    color: 0xffea00,
                                    alpha: 1
                                  });
                  app.stage.addChild(marker);

                  var data1 = jump.x - bus.x; 
                  console.log(`Jumper Position rel to Bus before keypress: ${data1}`);
                  console.log(typeof data1); 

                            
                   //Add the stuff relevant for response task.

                   // Add prompts
                  const text1 = new Text({
                    text: 'Drücken Sie die rechte Pfeiltaste, um sich nach rechts zu bewegen.-->',
                    style: {
                      fontSize: 11,
                      fontStyle: 'italic',
                      }});
                  text1.anchor.set(0.5,0.5)

                  const text2 = new Text({
                    text: '<--Drücken Sie die linke Pfeiltaste, um sich nach links zu bewegen.',
                  style: {
                      fontSize: 11,
                      fontStyle: 'italic',
                      }});

                  text2.anchor.set(0.5,0.5)

                  text1.x = bus.x + bus.width;
                  text1.y = 100;
                  app.stage.addChild(text1);

                  text2.x = bus.x;
                  text2.y = 100;
                  app.stage.addChild(text2);

                  //Add Event listeners to move the jumper position left/right
                  window.addEventListener('keyup', function(e) {
                      switch(e.key) {
                        case 'ArrowRight': {
                          jump.x += 10;
                          data1 += 10;  
                          console.log(`Jumper Position rel to Bus: ${data1}`);
                          break;
                        }
                        case 'ArrowLeft': {
                          jump.x -= 10;
                          data1 -= 10;
                          console.log(`Jumper Position rel to Bus: ${data1}`);
                          break;
                        }
                      }
                  });

                  //Add submit button
                  const submitBtn = createSubmitButton(
                        (app.screen.width - 120) / 2, // Center horizontally
                        (bus.y+bus.height+40), // Center vertically
                        'Einreichen',
                    );

                  app.stage.addChild(submitBtn);

                  submitBtn.on('pointerdown', submitData);

                  function submitData() { 
                    console.log('Submit Button clicked!'); 
                    app.destroy(true, true);   
                    end_trial(data1);                 
                  }

                  const end_trial = (data1) => {
                // save data
                var trial_data = {
                                          data1: data1, // Make sure this type and name matches the information for data1 in the data object contained within the info const.
                                          data2: "hello world!", // Make sure this type and name matches the information for data2 in the data object contained within the info const.
                                      };

                display_element.innerHTML = '';
                // end trial
                this.jsPsych.finishTrial(trial_data);
            };


              });

    }
  }
  ResponseTaskPlugin.info = info;

  return ResponseTaskPlugin;
})(jsPsychModule);
