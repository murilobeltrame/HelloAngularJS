angular
    .module('app', [])
    .provider('localStorageProvider', function () {
        this.$get = function () {

            var set = function (key) {
                if (localStorage.getItem(key) == undefined) localStorage.setItem(key, JSON.stringify([]));
                return JSON.parse(localStorage.getItem(key));
            }

            return {
                Create: function (key, obj) {
                    obj.Id = new Date().getTime();
                    var _objects = set(key);
                    _objects.push(obj);
                    localStorage.setItem(key, JSON.stringify(_objects));
                },
                Read: function (key, where) {
                    var _where = new RegExp('^' + where, 'i');
                    var _results = [];
                    var _objects = set(key);
                    for (var i = 0; i < _objects.length; i++) {
                        var _object = _objects[i];
                        _results.push(_object);
                    }
                    return _results;
                },
                ReadAll: function (key) { return set(key); },
                Update: function (key, id, obj) {
                    var _objects = set(key);
                    for (var i = 0; i < _objects.length; i++) {
                        if (id == _objects[i].Id) {
                            _objects[i] = obj;
                            localStorage.setItem(key, JSON.stringify(_objects));
                            break;
                        }
                    }
                },
                Delete: function (key, id) {
                    var _objects = set(key);
                    for (var i = 0; i < _objects.length; i++) {
                        if (id == _objects[i].Id) {
                            _objects.splice(i, 1);
                            localStorage.setItem(key, JSON.stringify(_objects));
                            break;
                        }
                    }
                }
            }
        }
    })
    .factory('todoFactory', ['$http', function ($http) {

        var _url = 'http://localhost:52897/';

        var _fabrica = {};

        var _consultar = function (query) {

            var _queryUrl = _url + 'api/todos/';
            if (query) _queryUrl = _queryUrl + query;
            return $http.get(_queryUrl).then(function (resultados) {
                return resultados;
            });

        };
        var _inserir = function (item) {
            return $http.post(_url + 'api/todos', item).then(function (resultados) {
                return resultados;
            });
        };
        var _atualizar = function (item) {
            return $http.put(_url + 'api/todos/' + item.Id, item).then(function (resultados) {
                return resultados;
            });
        };
        var _apagar = function (id) {
            return $http.delete(_url + 'api/todos/' + id).then(function (resultados) {
                return resultados;
            });
        }

        _fabrica.consultar = _consultar;
        _fabrica.inserir = _inserir;
        _fabrica.atualizar = _atualizar;
        _fabrica.apagar = _apagar;

        return _fabrica;

    }])
    .controller('todoController', ['$scope', 'localStorageProvider', 'todoFactory', function ($scope, localStorageProvider, todoFactory) {

        var chaveTodo = 'chaveUnicaDoExemploTodo';

        $scope.Todo = {};
        $scope.Todos = [];

        $scope.salvar = function () {

            if (!$scope.Todo.Id) {
                //localStorageProvider.Create(chaveTodo, $scope.Todo);
                todoFactory.inserir($scope.Todo).then(function (resultado) {
                    $scope.Todo = {};
                    $scope.consultar();
                }, function () { });
            } else {
                //localStorageProvider.Update(chaveTodo, $scope.Todo.Id, $scope.Todo);
                todoFactory.atualizar($scope.Todo).then(function (resultado) {
                    $scope.Todo = {};
                    $scope.consultar();
                }, function () { });
            }
            //$scope.Todo = {};
            //$scope.consultar();
        }

        $scope.apagar = function (index) {

            //localStorageProvider.Delete(chaveTodo, $scope.Todos[index].Id);
            //$scope.consultar();
            todoFactory.apagar($scope.Todo.Id).then(function (resultado) {
                $scope.Todo = {};
                $scope.consultar();
            }, function () { });

        }

        $scope.atualizar = function (index) {

            $scope.Todo = {
                Nome: $scope.Todos[index].Nome,
                Id: $scope.Todos[index].Id
            };

        }

        $scope.consultar = function () {

            //$scope.Todos = localStorageProvider.ReadAll(chaveTodo);
            todoFactory.consultar().then(function (resultado) {
                $scope.Todos = resultado.data;
            }, function () { });

        }

        $scope.consultar();

    }]);
