/**
* A class used to create a sample game of asteroids to show how
* the use the jsBlit 2D APIs and content management
* @constructor
*/
function Asteroids(useSilverlight, silverlightRuntimePath) {
	this.useSilverlight = useSilverlight;
	this.silverlightRuntimePath = silverlightRuntimePath;
}

Asteroids.prototype = {

	beginGame: function() {
		
		//We can easily just create different runtimes for the applications, with just
		//a one line change.  Hopefully soon there will be a flash and webgl version.
	    if(this.useSilverlight) {
	    	this.jsBlitWindow = new JsBlitWindowSL('window1', 830, 664, this, this.silverlightRuntimePath);
	    }
	    else {
	    	this.jsBlitWindow = new JsBlitWindowCV('window1', 830, 664, this);
	    }
	    this.jsBlitWindow.setFrameRate(30);
	},
	
	//TODO: Comment
	onLoaded: function (jsBlitWindow) {

		//We must define a render target that we want to render into and set
	    //that as the active render target on the graphics device
	    var rt = this.jsBlitWindow.getGraphicsDevice().createRenderTarget(830, 664);
	    this.jsBlitWindow.getGraphicsDevice().setRenderTarget(rt);

	    //A possible optimization is to put all these into one texture
	    //and then just render parts of the same texture
	    this.backgroundTexture = null;
	    this.rocketTexture = null;
	    this.asteroidTexture = null;
	    
	    //The sprite batch instance is used to render all of the game sprite
	    //to the render target
	    this.spriteBatch = this.jsBlitWindow.getGraphicsDevice().createSpriteBatch();
	    
	    this.rocketSprite = null;
	    this.allSprites = new Array(); 

		this.loadContent();
	},
	
    /**
    * Creates the asteroid sprites
    */
    createAsteroids: function () {
    
        var num, i, sprite;
        num = 20;
        for(i=0; i<num; ++i) {
            sprite = new Sprite();
			sprite.setAlpha(0.5);
            sprite.setTexture(this.asteroidTexture);
            sprite.addRotation(MathHelper.random() * 2 * MathHelper.PI);
            sprite.addVelocity(0.5 + MathHelper.random() * 10);
            sprite.scale = new Vector2(0.5, 0.5);
            
            var rt = this.jsBlitWindow.getGraphicsDevice().getRenderTarget();
            sprite.position = new Vector3(MathHelper.random() * rt.width, MathHelper.random() * rt.height, 0);
            this.allSprites.push(sprite);
        }
    },
    
    /**
    * Creates the rocket sprite
    */
    createRocket: function () {
        var rt;
        
        this.rocketSprite = new Sprite();

		//Asteroids have a depth of 0 so this will make the rocket always
		//appear on top of the sprites
		this.rocketSprite.setDepth(1);
        this.rocketSprite.setTexture(this.rocketTexture);
        
        //Since the rocket image points upwards, set initial direction vector
        this.rocketSprite.direction = new Vector3(0,-1,0);
        
        rt = this.jsBlitWindow.getGraphicsDevice().getRenderTarget();
        this.rocketSprite.position = new Vector3(rt.width / 2, rt.height / 2,0);
        this.allSprites.push(this.rocketSprite);
    },
    
    /**
    * Requests all of the sprites needed in the game to be loaded
    */
    loadContent: function () {
    
        //Load all of the sprite textures need in the game
        this.jsBlitWindow.content.loadTextureAsync(new TextureLoadRequest('http://www.markdawson.org/jsblit/src/Samples/Asteroids/background830x664.jpg',
                                                                 'background',
                                                                 this));
                                                               
        this.jsBlitWindow.content.loadTextureAsync(new TextureLoadRequest('http://www.markdawson.org/jsblit/src/Samples/Asteroids/asteroid200x200.png',
                                                                 'asteroid',
                                                                 this));
                                                               
        this.jsBlitWindow.content.loadTextureAsync(new TextureLoadRequest('http://www.markdawson.org/jsblit/src/Samples/Asteroids/rocket.png',
                                                                 'rocket',
                                                                 this));
    },
    
    /**
    * The Content::loadTextureAsync call expects the delegate to have a signature in the object
    * like the function below.  This is called in the success and error cases.
    * @param {ImageLoadResponse} response
    */
    loadTextureCompleted: function (response) {

        if(response.error != null) {
            alert('failed to load image resources:' + response.token);
            return;
        }
        
        //We pass in a string as the 'token' parameter when loading the texture
        //so that we can distinguish them here
        if(response.token === 'background') {
            this.backgroundTexture = response.texture;
        }
        else if(response.token === 'rocket') {
            this.rocketTexture = response.texture;
        }
        else if(response.token === 'asteroid') {
            this.asteroidTexture = response.texture;
        }
        
        //Once all of the sprites have loaded we can now start
        //rendering - this call is important otherwise nothing
        //will be drawn to the screen
        if(this.asteroidTexture != null && 
           this.backgroundTexture != null &&
           this.rocketTexture != null) {
            this.createRocket();
            this.createAsteroids();
            this.jsBlitWindow.startRendering(); 
        }
    },
    
    /**
    * Returns the window that the asteroids game user input will be captured in
    * @return {JsBlitWindow}
    */
    getJsBlitWindow: function () {
        return this.jsBlitWindow;
    },
    
    /**
    * Called by the JsBlitApp instance, allowing the game to update any state
    * based on user input such as keyboard and mouse
    * @param {GraphicsDevice} graphicsDevice - rendering abstraction
    * @param {AppTime} appTime - game time information
    * @param {MouseState} mouseState - current mouse state
    * @param {KeyboardState} keyboardState - current keyboard state
    */
    update: function (graphicsDevice, appTime, mouseState, keyboardState) {
    
        var spriteIndex, currentSprite, rtWidth, rtHeight, velocityPressed;
    
        if(this.rocketSprite == null) {
            return;
        }
        
        velocityPressed = false;
        
        if(keyboardState.keyCode != null) {
            switch(keyboardState.keyCode) {
            
            //TODO: Will unify the keys in the actual framework so the user only has to
            //      program against one enum
            
                case 188:  // PC
                case 43:   // Mac in SL
                    //<
                    this.rocketSprite.addRotation(MathHelper.degreesToRadians(-10));
                    break;
                    
                case 190:  //PC
                case 47:   //Mac in SL
                    //>
                    this.rocketSprite.addRotation(MathHelper.degreesToRadians(10));
                    break;
                    
                case 70:
                    //f
                    break;
                    
                case 82:  // browser
                case 15:  // Silverlight, Mac
                    //r
                    velocityPressed = true;
                    this.rocketSprite.addVelocity(0.5);
                    break;
            }
        }
        
        //Make sure we put some friction on the rocket
        if(!velocityPressed) {
            this.rocketSprite.addVelocity(-0.25);
        }
        
        //Move all of the sprites and keep in the bounds of the render target
        rtWidth = graphicsDevice.getRenderTarget().width;
        rtHeight = graphicsDevice.getRenderTarget().height;
        for(spriteIndex = 0; spriteIndex<this.allSprites.length; ++spriteIndex) {
            currentSprite = this.allSprites[spriteIndex];
            currentSprite.update();
            
            if(currentSprite.position.x > rtWidth) {
                currentSprite.position.x = -currentSprite.width;
            } else if(currentSprite.position.x < -currentSprite.width) {
                currentSprite.position.x = rtWidth;
            }
            if(currentSprite.position.y > rtHeight) {
                currentSprite.position.y = -currentSprite.height;
            } else if(currentSprite.position.y < -currentSprite.height) {
                currentSprite.position.y = rtHeight;
            }
            
            //Since the position can change after an update, here is the place
            //where we can get the final draw values
            currentSprite.updateDrawOptions();
        }
    },
    
    /**
    * Called by the JsBlitApp instance, allow the game to render a scene
    * @param {GraphicsDevice} graphicsDevice
    * @param {AppTime} appTime
    */
    render: function (graphicsDevice, appTime) {

        //jsBlit is an immediate API, meaning you have to redraw
        //the entire scene each frame, its not a retained system like SVG or Silverlight.
        
        var spriteIndex, currentSprite, drawOptions, halfDimension;
        
        //Clear the render targe completely, since we are rendering a background
        //image over the entire render target we don't have to do this but it is
        //here for completeness
        
        //TODO: Comment out
        //graphicsDevice.clear(Color.green);
        
        //In our case we just have a bunch of sprites that we want to draw 
        //each frame, all calls must be between the begin and end calls
        
        this.spriteBatch.begin(SpriteSortOrder.backToFront, true);
        
        //Examples of other properties we can set
        //drawOptions.sourceRect = new Rect2D(300, 400, 200, 200);
        //drawOptions.destinationRect = new Rect2D(100, 200, 600, 200);
        //drawOptions.rotation = MathHelper.degreesToRadians(this.angle);
        //drawOptions.origin = new Vector2(this.backgroundTexture.width / 2, this.backgroundTexture.height / 2);
        
        drawOptions = new SpriteDrawOptions();
		drawOptions.depth = -1;
        this.spriteBatch.draw(this.backgroundTexture, drawOptions);
        
        for(spriteIndex = 0; spriteIndex<this.allSprites.length; ++spriteIndex){
            currentSprite = this.allSprites[spriteIndex];
            
            //The sprites drawOptions field is updated in its update() method
            this.spriteBatch.draw(currentSprite.texture, currentSprite.drawOptions);  
        }
        
        this.spriteBatch.end();
    }
};