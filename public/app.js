var myapp = angular.module('myapp',['ui.router']);

myapp.config(function($urlRouterProvider, $stateProvider){
	
	$urlRouterProvider.otherwise('/angular');
	
	$stateProvider
	.state('angular' ,{
		url :'/angular',
		templateUrl :'template/angular.html',
		controller :'tableController'		
	})
	 .state('angular.pagination' ,{
		  url :'/angular/pagination',
		  templateUrl :'template/pagination.html',
		  controller : 'tableController'         		  
	 })
	.state('mongodb' ,{
		url :'/mongodb/:id',
		templateUrl :'template/mongodb.html',
		controller :'mongodbController'		
	})
	.state('emberjs' ,{
		url :'/emberjs',
		templateUrl :'template/uploadedchart.html',
		controller :'doneChartsUploadController'		
	})
	.state('reactjs' ,{
		url :'/reactjs',
		templateUrl :'template/react.html',
		controller :'crudContrroller'
		})
	.state('redux' ,{
		url :'/redux',
		templateUrl :'template/tradeUpload.html',
		controller :'tradingUploadController'
		})
    .state('mongoose' ,{
		url :'/mongoose',
		templateUrl :'template/trading.html',
		controller :'tradingController'
		})
	.state('mean' ,{
		url :'/mean',
		template :'<div class="alert alert-info">Hello world mean</div>',
		controller :'reduxController'		
	})
	.state('customPagination' ,{
		url :'/custompagination',
		templateUrl :'template/custompagination.html',
		controller :'customController'		
	})
});




myapp.controller('tradingUploadController', function($scope ,$http ,$timeout){	

$scope.trade = {};
 $scope.message = false;
$scope.Submit = function(){	
	 $scope.uploading = true;
	var formdata = new FormData();
	
	for(key in $scope.trade){		
		formdata.append(key , $scope.trade[key]);
	}
	
	var file= $("#file")[0].files[0];
    formdata.append('image' ,file);
	
	console.log('formdata length' + 	JSON.stringify(formdata));  
		 
		  return $http.post('/uploadTradeData/trade', formdata, {
            transformRequest: angular.identity,
            headers: { 'Content-Type': undefined }
			}).success(function(){
				console.log('success called');
				$scope.uploading = false;
				 $scope.message = "Successfully loaded";
			});	
};


  $scope.photoChanged = function(files) {
        if (files.length > 0 && files[0].name.match(/\.(png|jpeg|jpg)$/)) {
            $scope.uploading = true;
            var file = files[0];
            var fileReader = new FileReader();
            fileReader.readAsDataURL(file);
            fileReader.onload = function(e) {
                $timeout(function() {
                    $scope.thumbnail = {};
                    $scope.thumbnail.dataUrl = e.target.result;
                    $scope.uploading = false;
                    $scope.message = false;
                });
            };
        } else {
            $scope.thumbnail = {};
            $scope.message = false;
        }
    };
	
});

myapp.controller('doneChartsUploadController', function($scope ,$http){	       
			

$scope.dataavail = 0;

		$http.get('/uploadTradeData/trade').success(function(response){			 
			 console.log('data received' + response);			
               $scope.imageData = response.docum;
console.log('done charts data is' + $scope.imageData);			   
               $scope.dataavail = 1;			
		 });		
				
});

 myapp.directive('fileModel', ['$parse', function($parse) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var parsedFile = $parse(attrs.fileModel);
            var parsedFileSetter = parsedFile.assign;

            element.bind('change', function() {
                scope.$apply(function() {
                    parsedFileSetter(scope, element[0].files[0]);
                });
            });
        }
    };
}]);
      

 myapp.service('uploadFile', function($http) {
    this.upload = function(file) {
        var fd = new FormData();
        fd.append('myfile', file.upload);
		
        return $http.post('/upload', fd, {
            transformRequest: angular.identity,
            headers: { 'Content-Type': undefined }
        });	 
    };
});
		 
  myapp.controller('tradingController', ['$scope','uploadFile','$timeout', function($scope, uploadFile, $timeout){
         
    $scope.file = {};
    $scope.message = false;
    $scope.alert = '';
    $scope.default = 'https://thebenclark.files.wordpress.com/2014/03/facebook-default-no-profile-pic.jpg';

	
 $scope.Submit = function() {
        $scope.uploading = true;
        uploadFile.upload($scope.file).then(function(data) {
            if (data.data.success) {
                $scope.uploading = false;
                $scope.alert = 'alert alert-success';
                $scope.message = data.data.message;
                $scope.file = {};
            } else {
                $scope.uploading = false;
                $scope.alert = 'alert alert-danger';
                $scope.message = data.data.message;
                $scope.file = {};
            }
        });
    };
	
	  $scope.photoChanged = function(files) {
        if (files.length > 0 && files[0].name.match(/\.(png|jpeg|jpg)$/)) {
            $scope.uploading = true;
            var file = files[0];
            var fileReader = new FileReader();
            fileReader.readAsDataURL(file);
            fileReader.onload = function(e) {
                $timeout(function() {
                    $scope.thumbnail = {};
                    $scope.thumbnail.dataUrl = e.target.result;
                    $scope.uploading = false;
                    $scope.message = false;
                });
            };
        } else {
            $scope.thumbnail = {};
            $scope.message = false;
        }
    };

		   
		   
		   
         }]);


myapp.controller('customController', function($scope){	

	
	$scope.employeedata = [
	{name:'Putin' ,email :'Putin@gmail.com' ,age :66},
	{name:'Bush' ,email :'Bush@gmail.com' ,age :70},
	{name:'Trump' ,email :'Trump@gmail.com' ,age :80},
	{name:'Modi' ,email :'Modi@gmail.com' ,age :90},
   ];	

	
	$scope.tabledata = [
	{name:'john' ,email :'john@gmail.com' ,age :28},
	{name:'ronn' ,email :'ronn@gmail.com' ,age :29},
	{name:'tony' ,email :'tony@gmail.com' ,age :26},
	{name:'sonn' ,email :'sonn@gmail.com' ,age :25},
    {name:'ram' ,email :'ram@gmail.com' ,age :28},
	{name:'shyam' ,email :'shyam@gmail.com' ,age :29},
	{name:'laxman' ,email :'laxman@gmail.com' ,age :26},
	{name:'abraham' ,email :'abraham@gmail.com' ,age :25}];	
});


myapp.directive('tabledirective' , function(){
	return{
	restrict :'EAMC'	, // E= element, A= attribute. C= Class,
	scope :{
		tabledata: '='
	},
	transclude : true,
	templateUrl :'template/tabledirective.html',
	replace : false
	}	
});


myapp.controller('reactjsController', function($scope , $stateParams){	
$scope.bindData =  $stateParams.portfolioId;
$scope.dataID =  $stateParams.dataID;
});

myapp.controller('mongodbController', function($scope , $stateParams){	
$scope.bindData =  $stateParams.id;
});


myapp.controller('licontroller', function($scope , $http){		
	 $http.get('/api/about').success(function(response){		
		console.log('the data came from server is' + response);
		$scope.liData = response.docum;		
	});	
});

myapp.controller('tableController', function($scope, $http){		
	
		$scope.sortType = "name";
		$scope.sortReverse = false;
		
		$scope.currentPage = 0;
		$scope.pageSize = 3;
        $scope.tableData =[];		
		
        $scope.$watch('tableData' , function(){
		
		if( $scope.tableData.length >0){
			$scope.totalPage = Math.ceil($scope.tableData.length/$scope.pageSize);			
		}
		
	    });
		
	$http.get('/api/pagination').success(function(response){		
		    console.log('the data came from server is' + response);
		    $scope.tableData = response.docum;		
	  });
	
});

myapp.filter('startFrom', function() {
	return function(input, start) {
		if (input) {
			start = +start;	// parse to int
			return input.slice(start);
		}
		return [];
	}
});



myapp.controller('crudContrroller', function($scope , $http){
	
	 /*$http.get('/api/about').success(function(response){		
		console.log('the data came from server is' + response);
		$scope.liData = response.docum;		
	});	*/
	
	
	$scope.init = function() {
		
        $http.get('/employee/emp').success(function(response){			 
			 $scope.tabledata = response.docum;	
		 });
     };
	
	$scope.init();
	
	$scope.beginUpdate = function(data){
		//$scope.doc = data;
		$scope.doc = angular.copy(data)
		
	}
	
	$scope.updateEmployee = function(doc){
		
		console.log(JSON.stringify(doc));
		
		$http.put('/employee/emp', doc).success(function(response){			 
			 console.log('employee updated successfully');
			 $scope.refresh();			 
		 });
	}
	
	$scope.deleteEmployee = function(id){
	
		$http.delete('/employee/emp/' + id).success(function(response){			 
			 $scope.refresh();
		 });
	};
	
	$scope.refresh = function(){		
		 $http.get('/employee/emp').success(function(response){			 
			 $scope.tabledata = response.docum;	
		 });
	};
	
	$scope.addEmployee = function(data){
		//$scope.doc = '';
		console.log(JSON.stringify(data));
		 $http.post('/employee/emp' , data).success(function(response){			 
			 console.log('employee addedd successfully');
			 $scope.refresh();			 
		 });		
	};
});
