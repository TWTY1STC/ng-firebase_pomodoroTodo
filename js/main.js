var app = angular.module("ToDoApp", ["firebase"]);

// this factory returns a synchronized array of todo items
app.factory("todoItems", ["$firebaseArray",
  function($firebaseArray) {
     var config = {
		apiKey: "AIzaSyC4FukAUxEpo-szKZ8ojWI_e9HPaG4gWVo",
		authDomain: "pomodorotimer-1eb7d.firebaseapp.com",
		databaseURL: "https://pomodorotimer-1eb7d.firebaseio.com",
		storageBucket: "pomodorotimer-1eb7d.appspot.com",
		messagingSenderId: "16857628315"
    };
    firebase.initializeApp(config);
    // create a reference to the database location where we will store our data
    var ref = firebase.database().ref();

    // this uses AngularFire to create the synchronized array
    return $firebaseArray(ref);
  }
]);
app.directive("connector", ["todoItems",
	function(todoItems){}
])
app.controller("TodoCtrl", ["$scope", "todoItems", 
	function ($scope, todoItems) {
		
		$scope.todos = todoItems;
		
		$scope.addTodo = function(){
			$scope.todos.$add({
				title: $scope.todo,
				completed: false,
				selected: false,
				timestamp: firebase.database.ServerValue.TIMESTAMP
			});

			$scope.todo = "";
		};
		
		$scope.removeTodo = function(todo){
			$scope.todos.$remove(todo);
		}
		
		$scope.clearCompletedTodos = function(){
			$scope.todos =$scope.todos.filter(function(todo){
					return !todo.completed
				})
		}
		console.log("todo.selected")
		
		$scope.viewAll = function(){
			$scope.todos = todoItems;
					
		}
		$scope.deleteAllCompleteTodos= function(){
			angular.forEach($scope.todos, function(todo){
				if(todo.completed){
					$scope.todos.$remove(todo)
				}
			})
		}
	}
	]);

app.controller("TimeCtrl", ["$scope", "$interval", 
	function($scope, $interval){
		var buzzer = new buzz.sound("audio/DingLing", {
			formats: [ 'mp3' ],
			preload: true
			//can use buzzer.play() to mark end of session
		});
		var workTime = 5;
		var breakTime = 5;
		var restTime = 10;
		var intervalId;
		
		var timeFormatter = function(time){			
				var minutes = Math.floor(time/60);
				var seconds = Math.floor(time%60);
				
				if (minutes < 10){minutes = '0' + minutes;
				}
				if (seconds < 10){seconds = '0' + seconds;
				}
					
				return minutes + " : " + seconds
		}
		
		$scope.timer = function(timeType){
			console.log(timeType)
			intervalId = $interval(function(){
				timeType--;	
				if(timeType === 0){$scope.stop(); buzzer.play()}			
				$scope.timeRemaining = timeFormatter(timeType);
				
			}, 1000);
		};	
		
		// $scope.$watch('timeRemaining', function(timeRemaining){
		// 	if (timeRemaining === 0){
		// 		$scope.stop();
		// 	}
		// });
		
		$scope.start = function(){
			if(intervalId){$interval.cancel(intervalId);}
			//workTime*=60
			$scope.timer(workTime);
			/* if($scope.timeRemaining === 0){
				stop();
				startBreak();
			} */
			
			
		};
		  
		$scope.startBreak = function(){
			if(intervalId){$interval.cancel(intervalId);}
			//breakTime*=60
			$scope.timer(breakTime);
		};
		
		$scope.startRest = function(){
			if(intervalId){$interval.cancel(intervalId);}
			//restTime*=60
			$scope.timer(restTime);
		
		};
		
		$scope.stop = function(){
			$interval.cancel(intervalId);
			$scope.timeRemaining = ":";
		};
	}
])