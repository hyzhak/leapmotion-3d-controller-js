'use strict';
/**
 * Project: LeapMotion.
 * Copyright (c) 2013, Eugene-Krevenets
 */

(function(PoolOfObjects) {
    var ArrowFingerView = function() {
        THREE.Object3D.call( this );

        var geometry,
            material,
            mesh;
        geometry = new THREE.CubeGeometry( 10, 10, 100 );
        material = new THREE.MeshBasicMaterial( { color: 0xff0000, wireframe: true } );
        mesh = new THREE.Mesh( geometry, material );
        this.add(mesh);
    };
    ArrowFingerView.prototype = Object.create( THREE.Object3D.prototype );
    ArrowFingerView.prototype.useless = false;

    var FingersView = function() {};
    FingersView.prototype = {
        poolOfViews: new PoolOfObjects(ArrowFingerView),

        controller: null,

        setController: function(value) {
            this.controller = value;
            var self = this;
            value.on('animationFrame', function() {
                self.onFrame(self.controller.frame());
            });
        },

        _rootObject: null,

        setRootObject: function(value) {
            this._rootObject = value;
        },

        onFrame: function(frame) {
            this.markAllFingers();

            for(var i = 0, count = frame.pointables.length; i < count; i++) {
                var pointable = frame.pointables[i];
                var fingerView = this.getFingerViewById(pointable.id);
                fingerView.position.x = pointable.tipPosition.x;
                fingerView.position.y = pointable.tipPosition.y;
                fingerView.position.z = pointable.tipPosition.z;
                fingerView.useless = false;
            }

            this.sweepUselessFingers();
        },

        markAllFingers: function () {
            for(var i = 0, count = this._fingerView.length; i < count; i++) {
                var fingerView = this._fingerView[i];
                if (fingerView) {
                    fingerView.useless = true;
                }
            }
        },

        sweepUselessFingers: function () {
            for(var i = 0, count = this._fingerView.length; i < count; i++) {
                var fingerView = this._fingerView[i];
                if (fingerView && fingerView.useless) {
                    this.poolOfViews.returnObject(fingerView);
                    this._rootObject.remove(fingerView);
                    this._fingerView[i] = null;
                }
            }
        },

        _fingerView: [],

        getFingerViewById: function(id) {
            var fingerView;
            if (id < this._fingerView.length) {
                fingerView = this._fingerView[id];
            }

            if (fingerView) {
                return fingerView;
            }

            fingerView = this.poolOfViews.borrowObject();
            this._rootObject.add(fingerView);

            while(this._fingerView.length < id) {
                this._fingerView.push(null);
            }

            this._fingerView[id] = fingerView;

            return fingerView;
        }
    };

    window.FingersView = FingersView;
})(window.PoolOfObjects);