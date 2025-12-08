import { JsPsych, ParameterType} from 'jspsych';
import { Application, Assets, Sprite, Graphics, Text} from 'pixi.js';
import { Controller } from './controller';

export var JsPsychCoinTask = (function (jspsych) {
  "use strict";

  const info = {
    name: "{coin-task}",
    version: "1.0.0", // When working in a Javascript environment with no build, you will need to manually put set the version information. This is used for metadata purposes and publishing.
    parameters: {
      /** Provide a clear description of the parameter_name that could be used as documentation. We will eventually use these comments to automatically build documentation and produce metadata. */
      velocity: {
        type: jspsych.ParameterType.INT,
        default: 5,
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
  class CoinTaskPlugin {

    constructor(jsPsych) {
      this.jsPsych = jsPsych;
    }

    trial(display_element, trial) {

        var elapsed = 0; //Variable to track elapsed time from space-pressing
        var victory = 0; //Variable to track if task successful
        var press_position = []; //Variable to record the coin's position of space-pressing relative to Chest

        const app = new Application();
        const controller = new Controller();

        app.init({resizeTo: window}).then(() => {
            display_element.appendChild(app.canvas);
            //app.canvas.style.position = 'absolute';
                });

        const assetsToLoad = [
                                 '/images/bg001.png',
                                  '/images/chest.png',
                                  '/images/Coin.png',
                                  '/images/magnet_rotated.png'
                              ];

        Assets.load(assetsToLoad).then((loadedAssets) => {
          // This function runs only after ALL assets are fully loaded
          // You can access assets in the returned object using their full URL as the key
          const bg_texture = loadedAssets['/images/bg001.png'];
          const collector_texture = loadedAssets['/images/chest.png'];
          const coin_texture = loadedAssets['/images/Coin.png'];
          const magnet_texture = loadedAssets['/images/magnet_rotated.png'];

          const bg = new Sprite(bg_texture);
          const collector = new Sprite(collector_texture);
          const coin = new Sprite(coin_texture);
          const magnet = new Sprite(magnet_texture);

          bg.width = app.screen.width;
          bg.height = app.screen.height;
          bg.x = 0;
          bg.y = 0;

          const ground = bg.height - 0.08*bg.height; //Ground is approx 8% of the height

          //Adding the Rope
          const rope = new Graphics()
          .moveTo(0, 0.08*bg.height) //Rope is approx 8% of the bg height from above
          .lineTo(bg.width, 0.08*bg.height)
          .stroke({
            color: 0x000000
          });

          //Adding the Victory/Failure message
          const text1 = new Text({
          text: 'Victory :)'});

          const text2 = new Text({
          text: 'Failure :/'});

          collector.scale.set(0.5,0.5); // Chest: 288*228 pixels
          collector.x = 0.65*bg.width; //Chest at 65% of the bg width
          collector.y = ground - collector.height;

          magnet.scale.set(1,1) //magnet: 66*81 pixels
          magnet.x = rope.bounds.minX;
          magnet.y = rope.bounds.maxY; //place magnet at lower part of the rope

          coin.scale.set(0.05,0.05)  //coin: 497*534 pixels
          coin.x = magnet.x + 0.8*magnet.width; //80% of magnet's width
          coin.y = magnet.y + magnet.height;

          text1.x = app.screen.width/2;
          text1.y = app.screen.height/2;

          text2.x = app.screen.width/2;
          text2.y = app.screen.height/2;

          app.stage.addChild(bg, collector, rope, magnet, coin);
          console.log(`All assets loaded and added to stage.`);

          console.log(`Animation starts from here on!`);

           //Add an animation loop callback to the application's ticker.
        
          app.ticker.add((time) => {
        
            const spacePressed = controller.keys.space.pressed;
        
            if(spacePressed == true) {
        
              press_position.push(collector.x - coin.x);
        
              if(coin.y + coin.height >= ground){
                coin.y = ground - coin.height;
                coin.x -= trial.velocity*time.deltaTime;
        
                if(victory == 1){
                  app.stage.addChild(text1);
                }else{app.stage.addChild(text2);}
        
              }else{ 
                  const path = new Graphics() //Add the path followed by the coin
                  .moveTo(coin.x, coin.y)
                  .lineTo(coin.x + 3, coin.y + 3)
                  .stroke({
                            color: 0x000000
                          });
                elapsed += time.elapsedMS;
                coin.y += trial.velocity*elapsed*elapsed/(600000);
                app.stage.addChild(path);
              }
        
              if(coin.x >= collector.x && 
                  coin.x + coin.width <= collector.x + collector.width && 
                  coin.y >= collector.y &&
                  coin.y < ground - coin.height)
                { 
                  victory = 1; 
                }
            }
        
            console.log(`press position: ${press_position[0]}`);
        
            coin.x += trial.velocity*time.deltaTime;
            magnet.x += trial.velocity*time.deltaTime;
        
        
            if(magnet.x > app.screen.width) {
              app.ticker.stop(); //Stop the ticker if magnet is beyond the screen
              app.destroy(true, true);
              end_trial(press_position[0]);
            } 
          });

      const end_trial = () => {
          // save data
          var trial_data = {
                                    data1: press_position[0], // Make sure this type and name matches the information for data1 in the data object contained within the info const.
                                    data2: "hello world!", // Make sure this type and name matches the information for data2 in the data object contained within the info const.
                                };

          display_element.innerHTML = '';
          // end trial
          this.jsPsych.finishTrial(trial_data);
      };


      });
    }
  }
  CoinTaskPlugin.info = info;

  return CoinTaskPlugin;
})(jsPsychModule);
