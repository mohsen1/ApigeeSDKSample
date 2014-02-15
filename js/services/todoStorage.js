/*global todomvc */
'use strict';

/**
 * Services that persists and retrieves TODOs from localStorage
 */

var todoStorageFactory = todomvc.factory('todoStorage', function ($q) {
    var APIGEE_ORG = 'mazimi',
        APIGEE_APP = 'sandbox',
        dataClient;

    dataClient = new Apigee.Client({
        orgName: APIGEE_ORG,
        appName: APIGEE_APP
    });

    function logError(error){
        if(error) {
            console.log(error);
        }
    }

	return {
		get: function () {
            var deffered = $q.defer();
            dataClient.request({
                endpoint: 'todo'
            }, function(err, data, errMsg){
                if(err) return deffered.reject(errMsg);
                deffered.resolve(data.entities);
            });
            return deffered.promise;
		},

        put: function(todos) {
            todos = todos.forEach(function(todo) {
                todo.type = 'todo';
                var entity = new Apigee.Entity({
                    client: dataClient,
                    data: todo
                });
                entity.save(logError);
            });
        },

        addOne: function (todo) {
            todo.type = 'todo';
            dataClient.createEntity(todo, logError);
        },

        updateOne: function (todo){
            todo.type = 'todo';
            var entity = new Apigee.Entity({
                client: dataClient,
                data: todo
            });
            entity.save(logError);
        },

        deleteOne: function (todo) {
            todo.type = 'todo';
            var properties = {
                client: dataClient,
                data: todo
            }
            var entity = new Apigee.Entity(properties)
            entity.destroy(logError);
        }
	};
});

todoStorageFactory.$inject = ['$q']