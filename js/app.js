(function(FingersView) {
    'use strict';

    var camera, scene, renderer;
    var geometry, material, mesh;
    var controller;
    var mouseX = 0;
    var mouseY = 0;

    var windowHalfX = window.innerWidth / 2;
    var windowHalfY = window.innerHeight / 2;
    document.addEventListener( 'mousemove', onDocumentMouseMove, false );

    buildLeapMotionController();
    build3DScene();

    animate();

    function build3DScene() {

        camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 15000 );
        camera.position.z = 1000;

        scene = new THREE.Scene();

        geometry = new THREE.CubeGeometry( 200, 200, 200 );
        material = new THREE.MeshBasicMaterial( { color: 0xff0000, wireframe: true } );
        mesh = new THREE.Mesh( geometry, material );
        scene.add( mesh );

        // build the skybox Mesh
        var path = "assets/stormydays/";
//        var path = "assets/gloomy/";
        var format = '.png';
        var urls = [
            path + 'ft' + format, path + 'bk' + format,
            path + 'up' + format, path + 'dn' + format,
            path + 'rt' + format, path + 'lf' + format
        ];

        var textureCube = THREE.ImageUtils.loadTextureCube( urls );

        var shader = THREE.ShaderLib[ "cube" ];
        shader.uniforms[ "tCube" ].value = textureCube;

        var material = new THREE.ShaderMaterial( {
            fragmentShader: shader.fragmentShader,
            vertexShader: shader.vertexShader,
            uniforms: shader.uniforms,
            depthWrite: false,
            side: THREE.BackSide
        } ),

        mesh = new THREE.Mesh( new THREE.CubeGeometry( 10000, 10000, 10000 ), material );
        scene.add( mesh );

        renderer = new THREE.WebGLRenderer(); //        renderer = new THREE.CanvasRenderer();
        renderer.setSize( window.innerWidth, window.innerHeight, true);

        document.body.appendChild( renderer.domElement );

        var fingersView = new FingersView();
        fingersView.setController(controller);
        fingersView.setRootObject(scene);
    }


    function buildLeapMotionController() {
        controller = new Leap.Controller({
            enableGestures: true
        });

        controller.on('animationFrame', function() {
            var frame = controller.frame();
            if (frame.gestures && frame.gestures.length > 0) {
                for(var i = 0, count = frame.gestures.length; i < count; i++) {
                    var gesture = frame.gestures[i];
                    gesture.id//
                    gesture.handIds// The list of hands associated with this Gesture
                    gesture.pointableIds// The list of fingers and tools associated with this Gesture, if any.
                    gesture.state//'start', 'update', 'stop'
                    gesture.duration//
                    gesture.type// circle, swipe, screentap, keyTap
                    console.log('gesture: ' + gesture.type + ' is ' + gesture.state);
                }
            }
        });

        controller.connect();
    }

    function onDocumentMouseMove( event ) {
        mouseX = ( event.clientX - windowHalfX ) * 10;
        mouseY = ( event.clientY - windowHalfY ) * 10;
    }

    function animate() {

        // note: three.js includes requestAnimationFrame shim
        requestAnimationFrame( animate );

        //mesh.rotation.x += 0.01;
        //mesh.rotation.y += 0.02;

        camera.position.x += ( mouseX - camera.position.x ) * .05;
        camera.position.y += ( - mouseY - camera.position.y ) * .05;
        camera.lookAt( scene.position );

        renderer.render( scene, camera );
    }
})(FingersView);