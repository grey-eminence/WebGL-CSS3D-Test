/**
 * @author Jacek Jankowski / http://grey-eminence.org/
 */

PlanarGoToControls = function ( object, storeParameters ) {

	this.object = object;
	//this.domElement = ( domElement !== undefined ) ? domElement : document;
	this.domElement = document;
	//this.render = renderFunction;
	//this.storeParameters = storeParameters;

	this.enabled = false;
	this.lookAroundSpeed = 1.0;
	this.goToSpeed = 1.0;
	
	var pitchObject = new THREE.Object3D();
	var yawObject = new THREE.Object3D();


	var scope = this;
	var mouseDownPosition = new THREE.Vector2();
	var mouseUpPosition = new THREE.Vector2();
	var lastPosition = new THREE.Vector3();
	var lastRotation = new THREE.Euler();




	this.setPostion = function () {

		this.cameraY = 4.0;
		object.rotation.set( 0, 0, 0 );
		pitchObject.add( object );
		yawObject.add( pitchObject );
		yawObject.position.y = this.cameraY;

	};

	this.getObject = function () {

		return yawObject;

	};

	this.getPitchObject = function () {

		return pitchObject;

	};

	function onMouseDown( event ) {

		if ( scope.enabled === false ) { return; }
		event.preventDefault();

		if ( event.button === 0 ) {

			mouseDownPosition.set( event.clientX, event.clientY );
			scope.domElement.addEventListener( 'mousemove', onMouseMove, false );
			scope.domElement.addEventListener( 'mouseup', onMouseUp, false );

		} 

	}

	function onMouseUp( /* event */ ) {

		if ( scope.enabled === false ) return;

		if ( event.button === 0 ) {

			mouseUpPosition.set( event.clientX, event.clientY );

			if ( mouseDownPosition.equals( mouseUpPosition ) ) {

				var mouseX = ( event.clientX / window.innerWidth ) * 2 - 1;
				var mouseY = -( event.clientY / window.innerHeight ) * 2 + 1;
				var vector = new THREE.Vector3( mouseX, mouseY, scope.object.near );
				var projector = new THREE.Projector();
				projector.unprojectVector( vector, scope.object );
				var raycaster = new THREE.Raycaster( yawObject.position, vector.sub( yawObject.position ).normalize() );

				var intersects = raycaster.intersectObject( mesh );

				if ( intersects.length > 0 ) {

					var tween = new TWEEN.Tween( { x: yawObject.position.x, y: yawObject.position.z } );
					tween.to( { x: intersects[ 0 ].point.x, y: intersects[ 0 ].point.z }, 1000 / scope.goToSpeed );
					tween.easing( TWEEN.Easing.Quartic.Out );
					tween.onUpdate( function () {

						yawObject.position.set( this.x, scope.cameraY, this.y );

					} );
					tween.start();
					tween.onComplete( function () { storeParameters(); } );

				}

			}
			else {
				storeParameters();
			}

			scope.domElement.removeEventListener( 'mousemove', onMouseMove, false );
			scope.domElement.removeEventListener( 'mouseup', onMouseUp, false );

		}

	}

	function onMouseMove( event ) {

		if ( scope.enabled === false ) return;
		event.preventDefault();

		var movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
		var movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;

		yawObject.rotation.y += movementX * 0.002 * scope.lookAroundSpeed;
		pitchObject.rotation.x += movementY * 0.002 * scope.lookAroundSpeed;
		pitchObject.rotation.x = Math.max( - Math.PI / 2, Math.min( Math.PI / 2, pitchObject.rotation.x ) );

	}


	this.addListeners = function () {

		this.domElement.addEventListener( 'contextmenu', function ( event ) { event.preventDefault(); }, false );
		this.domElement.addEventListener( 'mousedown', onMouseDown, false );

	};

	this.removeListeners = function () {

		this.domElement.removeEventListener( 'contextmenu', function ( event ) { event.preventDefault(); }, false );
		this.domElement.removeEventListener( 'mousedown', onMouseDown, false );

	};


};

