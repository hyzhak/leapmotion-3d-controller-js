/**
 * Project: LeapMotion.
 * Copyright (c) 2013, Eugene-Krevenets
 */

(function() {
    'use strict';

    var PoolOfObjects = function(instanceType) {
        this.instanceType = instanceType;
    };

    PoolOfObjects.prototype = {
        instanceType: null,

        _pool: [],

        borrowObject: function() {
            var instance = this._pool.pop();
            if (instance) {
                return instance;
            }

            return new this.instanceType();
        },

        returnObject: function(instance) {
            this._pool.push(instance);
        }
    };

    window.PoolOfObjects = PoolOfObjects;
})();